import { NextRequest } from "next/server";
import { handleSubmission } from "@/lib/form";

/**
 * ⭐ Formaroo 核心端点:接收表单提交
 * 用法:<form action="https://formaroo.yearn05.top/f/{formId}" method="POST">
 * 支持:application/x-www-form-urlencoded (HTML表单), application/json, multipart/form-data
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const userAgent = request.headers.get("user-agent");

  const contentType = request.headers.get("content-type") || "";

  try {
    let body: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          body[key] = {
            name: value.name,
            size: value.size,
            type: value.type,
          };
        } else {
          body[key] = value;
        }
      }
    } else {
      // application/x-www-form-urlencoded (默认 HTML 表单)
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        body[key] = typeof value === "string" ? value : String(value);
      }
    }

    const result = await handleSubmission(formId, body, ip, userAgent);

    // 支持重定向(经典 HTML 表单提交后跳转)
    if (result.ok && result.redirectUrl) {
      return Response.redirect(result.redirectUrl, 302);
    }

    // JSON 响应(现代前端/JS 调用)
    return Response.json(
      { success: result.ok, message: result.message, submission_id: result.submissionId },
      { status: result.status }
    );
  } catch (err) {
    console.error("[formaroo] submit error:", err);
    return Response.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
}

/** 允许跨域(开发者站点调用) */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
