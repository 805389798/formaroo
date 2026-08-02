import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FormDetailClient from "./form-detail-client";
import { getServerDictionary } from "@/lib/locale";

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 认证守卫:未登录跳转到登录页
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const dict = await getServerDictionary();
  return <FormDetailClient formId={id} dict={dict.formDetail} />;
}
