import { NextRequest } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * LemonSqueezy Webhook
 * 订阅状态变更 → 更新用户 plan
 * 官方签名验证:HMAC-SHA256(secret, body)
 * 参考:https://docs.lemonsqueezy.com/guides/developer-guide/webhooks
 */
export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[ls-webhook] webhook secret not configured");
    return Response.json({ error: "Not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  // 验证签名
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  if (signature !== expected) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = event.meta?.event_name;
  const data = event.data;
  const supabase = createAdminClient();

  // 只处理订阅相关事件
  if (eventName?.startsWith("subscription_")) {
    const subId = data?.id ? Number(data.id) : null;
    const attributes = data?.attributes || {};
    const status = attributes.status;
    const customerId = attributes.customer_id ? Number(attributes.customer_id) : null;
    const variantId = attributes.variant_id ? Number(attributes.variant_id) : null;
    const userEmail = attributes.user_email || attributes.customer_email;

    if (!subId) return Response.json({ ok: true });

    // 用 custom_data 里的 user_id 定位用户(优先),否则用邮箱
    const customData = attributes.custom_data || {};
    let userId: string | null = customData.user_id || null;

    if (!userId && userEmail) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", userEmail)
        .maybeSingle();
      if (profile) userId = profile.id;
    }

    if (!userId) {
      // 未找到用户:记录日志,仍返回 ok 避免 LS 重试风暴
      console.warn("[ls-webhook] no user found for subscription", subId, userEmail);
      return Response.json({ ok: true });
    }

    // 计划映射(根据 variant ID;数字需与 LS 后台一致)
    // 约定:pro_variant_id / scale_variant_id 环境变量
    let plan = "free";
    const proVariant = Number(process.env.LS_PRO_VARIANT_ID || 0);
    const scaleVariant = Number(process.env.LS_SCALE_VARIANT_ID || 0);
    if (variantId === proVariant) plan = "pro";
    if (variantId === scaleVariant) plan = "scale";

    const active = ["active", "on_trial", "paused", "past_due"].includes(status);
    const finalPlan = active ? plan : "free";

    const { error } = await supabase
      .from("profiles")
      .update({
        plan: finalPlan,
        ls_customer_id: customerId,
        ls_subscription_id: subId,
        ls_variant_id: variantId,
        ls_status: status,
      })
      .eq("id", userId);

    if (error) {
      console.error("[ls-webhook] profile update error:", error.message);
      return Response.json({ error: "DB error" }, { status: 500 });
    }
  }

  return Response.json({ ok: true });
}
