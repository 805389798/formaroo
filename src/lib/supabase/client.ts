import { createBrowserClient } from "@supabase/ssr";

/**
 * 浏览器端 Supabase 客户端
 * 仅用于 Client Components(登录表单、仪表盘交互等)
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
