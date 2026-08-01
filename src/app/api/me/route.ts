import { createClient } from "@/lib/supabase/server";

/**
 * 当前用户信息 + 订阅状态 + 用量
 * GET /api/me
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, plan, ls_status, submissions_used, usage_month, created_at")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return Response.json({ user: { id: user.id, email: user.email } });
  }

  // 用量配额(按计划)
  const quotas: Record<string, number> = {
    free: 100,     // 免费:每月 100 次提交
    pro: 10_000,   // Pro:每月 10,000 次
    scale: 100_000, // Scale:每月 100,000 次
  };
  const quota = quotas[profile.plan] || quotas.free;

  return Response.json({
    user: profile,
    quota,
    remaining: Math.max(0, quota - (profile.submissions_used || 0)),
  });
}
