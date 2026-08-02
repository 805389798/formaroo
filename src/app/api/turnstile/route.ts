import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/turnstile
 * 服务端验证 Cloudflare Turnstile token(canonical siteverify)
 *
 * 浏览器 → 本端点 → challenges.cloudflare.com siteverify → 放行/拒绝
 * secret 从环境变量 TURNSTILE_SECRET 读取(不硬编码,不落库)
 */
export async function POST(req: NextRequest) {
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

  // Cloudflare Workers(OpenNext)下拿真实客户端 IP
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "";

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
