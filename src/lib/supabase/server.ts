import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
/**
 * 服务端 Supabase 客户端(用于 Server Components / Route Handlers)
 * 自动从 cookie 读取用户 session
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component 中调用 set 会报错,可忽略(由 middleware 处理)
          }
        },
      },
    }
  );
}

/**
 * 服务端 Admin 客户端(Service Role Key,绕过 RLS)
 * 仅用于:表单提交接收端点(匿名用户提交数据入库)、订阅 webhook 等
 * 切勿暴露给浏览器!
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
