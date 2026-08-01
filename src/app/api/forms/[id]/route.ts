import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * 表单详情 API
 * GET  /api/forms/[id]            → 表单配置 + 最近提交
 * PATCH /api/forms/[id]           → 更新配置(名称/重定向/Webhook/蜜罐/开关)
 * DELETE /api/forms/[id]          → 删除表单
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // 表单必须属于当前用户
  const { data: form, error: formErr } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (formErr || !form) return Response.json({ error: "Form not found" }, { status: 404 });

  const { data: submissions, error: subErr } = await supabase
    .from("submissions")
    .select("id, data, ip, created_at")
    .eq("form_id", id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (subErr) return Response.json({ error: subErr.message }, { status: 500 });

  return Response.json({ form, submissions });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const allowed = ["name", "redirect_url", "webhook_url", "honeypot_field", "enabled"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }
  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("forms")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ form: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("forms")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
