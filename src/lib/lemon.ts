/**
 * LemonSqueezy 集成
 * - 创建订阅结账会话
 * - 验证并处理 Webhook(订阅状态变更)
 * 参考:https://docs.lemonsqueezy.com/api
 */

const LS_API_BASE = "https://api.lemonsqueezy.com/v1";
const LS_API_KEY = process.env.LEMONSQUEEZY_API_KEY || "";

// 订阅变体 ID(在 LS 后台创建产品后填入 .env)
// Pro: 每月 10,000 次提交
// Scale: 每月 100,000 次提交

/**
 * 创建 Checkout 会话 URL
 * @param variantId LS 变体 ID
 * @param userEmail 购买者邮箱
 * @param customData 附加数据(如 user_id)
 */
export async function createCheckout(
  variantId: number,
  userEmail: string,
  customData: Record<string, string>
): Promise<string> {
  const res = await fetch(`${LS_API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LS_API_KEY}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: userEmail,
            custom: customData,
          },
        },
        relationships: {
          store: { data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID! } },
          variant: { data: { type: "variants", id: String(variantId) } },
        },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[ls] checkout error:", res.status, text);
    throw new Error(`Checkout creation failed: ${res.status}`);
  }

  const json = await res.json();
  return json.data.attributes.url;
}

/** 获取用户的订阅信息(用于仪表盘显示) */
export async function getSubscription(subscriptionId: number) {
  const res = await fetch(`${LS_API_BASE}/subscriptions/${subscriptionId}`, {
    headers: { Authorization: `Bearer ${LS_API_KEY}`, Accept: "application/vnd.api+json" },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

/** 获取产品变体列表(用于构建定价页) */
export async function getVariants() {
  const res = await fetch(`${LS_API_BASE}/variants?page[size]=50`, {
    headers: { Authorization: `Bearer ${LS_API_KEY}`, Accept: "application/vnd.api+json" },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}
