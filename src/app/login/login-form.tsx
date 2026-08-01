"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginForm({ initialMode }: { initialMode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "info"; text: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          },
        });
        if (error) throw error;
        if (data.session) {
          router.push("/dashboard");
        } else {
          setMessage({
            type: "info",
            text: "注册成功!请查收邮件点击确认链接后登录。",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "操作失败" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {mode === "login" ? "欢迎回来" : "创建账号"}
          </h1>
          <p className="text-gray-400 mt-2">Formaroo · 表单后端,三行代码接入</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">邮箱</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">密码</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="至少 6 位"
              />
            </div>

            {message && (
              <div
                className={`text-sm px-4 py-3 rounded-lg ${
                  message.type === "error"
                    ? "bg-red-900/50 text-red-300 border border-red-800"
                    : "bg-emerald-900/50 text-emerald-300 border border-emerald-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          {mode === "login" ? (
            <>
              没有账号?{" "}
              <button onClick={() => setMode("signup")} className="text-emerald-400 hover:underline">
                免费注册
              </button>
            </>
          ) : (
            <>
              已有账号?{" "}
              <button onClick={() => setMode("login")} className="text-emerald-400 hover:underline">
                去登录
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
