import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/turnstile
 * 服务端验证 Cloudflare Turnstile token(canonical siteverify)
 *
 * 浏览器 → 本端点 → challenges.cloudflare.com siteverify → 放行/拒绝
 * secret 从环境变量 TURNSTILE_SECRET 读取(不硬编码,不落库)
 *
 * 额外防线:IP 频率限制 —— 防脚本对验证端点本身的批量调用(纵深防御)
 */

// 每分钟每个 IP 最多 20 次验证尝试(真人足够,脚本被掐)
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
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

export async function POST(req: NextRequest) {
  // Cloudflare Workers(OpenNext)下拿真实客户端 IP
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "";

  // 防线 1:IP 限流(先于解析,连 body 都省得读)
  if (ip && !rateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many attempts, please try again later" },
      { status: 429 }
    );
  }

  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const token = body.token;
  if (!token || typeof token !== "string") {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 });
  }

  let result: { success?: boolean };
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET || "",
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    });
    if (!r.ok) throw new Error(`siteverify ${r.status}`);
    result = await r.json();
  } catch (err) {
    // 网络错误/非 2xx/非 JSON → fail closed(拒绝)
    console.error("[turnstile] siteverify error:", err);
    return NextResponse.json({ success: false, error: "Verification unavailable" }, { status: 503 });
  }

  if (result.success !== true) {
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
