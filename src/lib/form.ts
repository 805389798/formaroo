import { createAdminClient } from "./supabase/server";
import crypto from "crypto";

/**
 * 表单提交处理核心
 * 职责:验证表单存在 → 反垃圾(蜜罐+频率限制) → 入库 → 触发 Webhook
 */

const RATE_LIMIT_WINDOW_MS = 60_000; // 1分钟窗口
const RATE_LIMIT_MAX = 10; // 每分钟最多10次(同IP)

// 简单内存限流(生产环境可换 Redis/数据库,免费层足够)
const ipHits = new Map<string, { count: number; windowStart: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipHits.set(ip, { count: 1, windowStart: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= RATE_LIMIT_MAX;
}

export interface SubmitResult {
  ok: boolean;
  status: number;
  message: string;
  redirectUrl?: string;
  submissionId?: string;
}

/**
 * 处理一次表单提交
 * @param formId 表单 ID
 * @param body 原始请求体(已解析的对象)
 * @param rawBody 原始字符串(用于 JSON 存储)
 * @param ip 提交者 IP
 * @param userAgent 提交者 UA
 * @param contentType 请求 Content-Type
 */
export async function handleSubmission(
  formId: string,
  body: Record<string, unknown>,
  ip: string | null,
  userAgent: string | null
): Promise<SubmitResult> {
  const supabase = createAdminClient();

  // 1. 查表单
  const { data: form, error: formErr } = await supabase
    .from("forms")
    .select("id, name, redirect_url, webhook_url, honeypot_field, enabled, submissions_count, user_id")
    .eq("id", formId)
    .single();

  if (formErr || !form) {
    return { ok: false, status: 404, message: "Form not found" };
  }

  if (!form.enabled) {
    return { ok: false, status: 403, message: "This form has been disabled" };
  }

  // 2. 反垃圾:蜜罐字段(填了就是机器人)
  const honeypot = form.honeypot_field || "company_website";
  const honeypotValue = body[honeypot];
  if (honeypotValue && String(honeypotValue).length > 0) {
    // 假装成功,实际丢弃
    return { ok: true, status: 200, message: "Success" };
  }

  // 3. 反垃圾:IP 频率限制
  if (ip && !rateLimit(ip)) {
    return { ok: false, status: 429, message: "Too many submissions, please try again later" };
  }

  // 4. 清理字段(去掉蜜罐字段本身)
  const cleanBody: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (k !== honeypot) cleanBody[k] = v;
  }

  // 5. 入库(用 service role 绕过 RLS)
  const { data: insertData, error: insertErr } = await supabase
    .from("submissions")
    .insert({
      form_id: formId,
      data: cleanBody,
      ip: ip,
      user_agent: userAgent ? userAgent.slice(0, 500) : null,
    })
    .select("id")
    .single();

  if (insertErr) {
    console.error("[formaroo] insert submission error:", insertErr);
    return { ok: false, status: 500, message: "Internal server error" };
  }

  // 6. 更新表单提交计数
  await supabase
    .from("forms")
    .update({ submissions_count: (form.submissions_count || 0) + 1 })
    .eq("id", formId);

  // 7. 触发 Webhook(异步,不阻塞响应)
  if (form.webhook_url) {
    fireWebhook(form.webhook_url, {
      form_id: formId,
      form_name: form.name,
      submission_id: insertData.id,
      data: cleanBody,
      created_at: new Date().toISOString(),
    }).catch((e) => console.error("[formaroo] webhook error:", e));
  }

  return {
    ok: true,
    status: 200,
    message: "Success",
    redirectUrl: form.redirect_url || undefined,
    submissionId: insertData.id,
  };
}

/** 异步触发用户配置的 Webhook */
async function fireWebhook(url: string, payload: unknown) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Formaroo-Webhook/1.0" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(`[formaroo] webhook ${url} returned ${res.status}`);
    }
  } finally {
    clearTimeout(timer);
  }
}

/** 生成安全的表单 ID(9位,url-safe,避免混淆字符) */
export function generateFormId(): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789"; // 去掉 l,o,0,1
  let id = "";
  const bytes = crypto.randomBytes(9);
  for (let i = 0; i < 9; i++) {
    id += alphabet[bytes[i] % alphabet.length];
  }
  return id;
}
