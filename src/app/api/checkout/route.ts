import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckout } from "@/lib/lemon";

/**
 * 发起 LemonSqueezy Checkout
 * POST /api/checkout { variant: "pro" | "scale" }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { variant } = await request.json().catch(() => ({ variant: "pro" }));
  const variantId =
    variant === "scale" ? process.env.LS_SCALE_VARIANT_ID : process.env.LS_PRO_VARIANT_ID;

  if (!variantId) {
    return Response.json({ error: "Pricing not configured yet" }, { status: 500 });
  }

  try {
    const url = await createCheckout(Number(variantId), user.email!, {
      user_id: user.id,
    });
    return Response.json({ url });
  } catch (err) {
    console.error("[checkout] error:", err);
    return Response.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
