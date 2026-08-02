import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyLicense, GUMROAD_PRO_PERMALINK, GUMROAD_SCALE_PERMALINK } from "@/lib/gumroad";

/**
 * 激活 Gumroad license key
 * POST /api/license { license_key: "xxx", plan: "pro" | "scale" }
 * 验证通过后更新用户 plan,解锁配额
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { license_key, plan } = await request.json().catch(() => ({}));
  if (!license_key || !plan) {
    return Response.json({ error: "license_key and plan are required" }, { status: 400 });
  }

  // 根据目标 plan 选择正确的 permalink
  const permalink =
    plan === "scale" ? GUMROAD_SCALE_PERMALINK : plan === "pro" ? GUMROAD_PRO_PERMALINK : null;

  if (!permalink) {
    return Response.json({ error: "Invalid plan" }, { status: 400 });
  }

  // 调 Gumroad 验证
  const result = await verifyLicense(license_key, permalink);

  if (!result.success || !result.plan) {
    return Response.json(
      { error: result.message || "License key 无效,请检查后重试" },
      { status: 400 }
    );
  }

  // 验证通过 → 更新用户 plan
  const { error } = await supabase
    .from("profiles")
    .update({
      plan: result.plan,
      ls_customer_id: null,
      ls_subscription_id: null,
      ls_variant_id: null,
      ls_status: "active",
    })
    .eq("id", user.id);

  if (error) {
    console.error("[license] profile update error:", error.message);
    return Response.json({ error: "Failed to update plan" }, { status: 500 });
  }

  return Response.json({
    success: true,
    plan: result.plan,
    product: result.productName,
    email: result.purchaseEmail,
  });
}
