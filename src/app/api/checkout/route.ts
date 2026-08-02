import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { productUrl, GUMROAD_PRO_PERMALINK, GUMROAD_SCALE_PERMALINK } from "@/lib/gumroad";

/**
 * 发起升级:返回 Gumroad 产品购买页 URL
 * POST /api/checkout { variant: "pro" | "scale" }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { variant } = await request.json().catch(() => ({ variant: "pro" }));
  const isScale = variant === "scale";

  // 检查 Gumroad 产品是否已配置
  if (!isScale && !GUMROAD_PRO_PERMALINK) {
    return Response.json({ error: "Pro plan not configured yet" }, { status: 500 });
  }
  if (isScale && !GUMROAD_SCALE_PERMALINK) {
    return Response.json({ error: "Scale plan not configured yet" }, { status: 500 });
  }

  const url = productUrl(isScale ? "scale" : "pro");
  return Response.json({ url });
}
