import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./dashboard-client";
import { getServerDictionary } from "@/lib/locale";

export default async function DashboardPage() {
  // 认证守卫:未登录跳转到登录页(server component 安全检查)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const dict = await getServerDictionary();
  return <DashboardClient dict={dict.dashboard} />;
}
