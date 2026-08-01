// 站点 URL 工具:统一从环境变量读取,避免硬编码
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://formaroo.yearn05.com";

/** 拼出表单提交端点 URL */
export function formEndpoint(formId: string): string {
  return `${SITE_URL}/f/${formId}`;
}
