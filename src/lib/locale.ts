import { cookies } from "next/headers";
import { getDictionary, defaultLocale, locales, type Dictionary } from "./i18n";

/**
 * 服务端读取当前语言(基于 cookie,默认英文)
 * 用于 Server Components 渲染
 */
export async function getLocale(): Promise<string> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  return locale && (locales as readonly string[]).includes(locale) ? locale : defaultLocale;
}

/** 服务端获取当前语言的字典 */
export async function getServerDictionary(): Promise<Dictionary> {
  const locale = await getLocale();
  return getDictionary(locale);
}
