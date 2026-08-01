import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateFormId } from "@/lib/form";

/**
 * 表单 API:创建/列表
 * 需要登录(通过 Supabase session)
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data: forms, error } = await supabase
    .from("forms")
    .select("id, name, submissions_count, created_at, enabled")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ forms });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await request.json().catch(() => ({ name: "My Form" }));
  const formId = generateFormId();

  const { data, error } = await supabase
    .from("forms")
    .insert({ id: formId, user_id: user.id, name: name || "My Form" })
    .select("id, name, created_at")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ form: data }, { status: 201 });
}
