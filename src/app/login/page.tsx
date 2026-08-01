import LoginForm from "./login-form";

/**
 * 登录/注册页
 * ?mode=signup 直接进入注册模式(落地页按钮调用)
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; error?: string; next?: string }>;
}) {
  const params = await searchParams;
  return <LoginForm initialMode={params.mode === "signup" ? "signup" : "login"} />;
}
