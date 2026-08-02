/**
 * Gumroad License API 集成
 * 参考:https://gumroad.com/api (Licenses 章节)
 *
 * 流程:
 * 1. 用户在我们的仪表盘点"升级" → 跳转 Gumroad 产品购买页
 * 2. 付款后 Gumroad 自动发送 license key 到买家邮箱
 * 3. 用户把 license key 填回我们仪表盘 → 本模块调 Gumroad Verify 验证
 * 4. 验证通过 → 更新数据库 plan
 *
 * 注意:Verify License API 不需要 OAuth token,只需 product permalink。
 */

const GUMROAD_API = "https://api.gumroad.com/v2/licenses/verify";

// 产品 permalink(在 Gumroad 产品 URL 里,gumroad.com/l/<permalink>)
export const GUMROAD_PRO_PERMALINK = process.env.GUMROAD_PRO_PERMALINK || "";
export const GUMROAD_SCALE_PERMALINK = process.env.GUMROAD_SCALE_PERMALINK || "";

/** 产品购买页 URL(给用户跳转) */
export function productUrl(plan: "pro" | "scale"): string {
  const permalink = plan === "scale" ? GUMROAD_SCALE_PERMALINK : GUMROAD_PRO_PERMALINK;
  return `https://gumroad.com/l/${permalink}`;
}

export interface LicenseVerifyResult {
  success: boolean;
  plan: "pro" | "scale" | null;
  purchaseEmail?: string;
  productName?: string;
  subscriptionStatus?: string;
  refunded?: boolean;
  message?: string;
}

/**
 * 验证 Gumroad license key
 * @param licenseKey 用户提交的 license key
 * @param permalink  产品 permalink(pro 或 scale)
 */
export async function verifyLicense(
  licenseKey: string,
  permalink: string
): Promise<LicenseVerifyResult> {
  if (!licenseKey || !permalink) {
    return { success: false, plan: null, message: "Missing license key or product" };
  }

  const res = await fetch(GUMROAD_API, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      product_permalink: permalink,
      license_key: licenseKey,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!data || !data.success) {
    return {
      success: false,
      plan: null,
      message: data?.message || "Invalid license key",
    };
  }

  const purchase = data.purchase || {};
  const productName = (purchase.product_name || "").toLowerCase();

  // 判断 plan:根据产品名匹配
  let plan: "pro" | "scale" | null = null;
  if (productName.includes("scale")) plan = "scale";
  else if (productName.includes("pro")) plan = "pro";

  return {
    success: true,
    plan,
    purchaseEmail: purchase.email,
    productName: purchase.product_name,
    subscriptionStatus: purchase.subscription_status,
    refunded: purchase.refunded,
  };
}
