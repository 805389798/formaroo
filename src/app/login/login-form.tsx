"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/language-switcher";
import Script from "next/script";

interface AuthDict {
  welcomeBack: string;
  createAccount: string;
  subtitle: string;
  email: string;
  password: string;
  login: string;
  signup: string;
  processing: string;
  noAccount: string;
  haveAccount: string;
  freeSignup: string;
  goLogin: string;
  successSignup: string;
  passHint: string;
  otpTitle: string;
  otpSubtitle: string;
  otpSend: string;
  otpVerify: string;
  otpSent: string;
  otpSwitch: string;
  passwordSwitch: string;
  otpPlaceholder: string;
}

export default function LoginForm({
  initialMode,
  dict,
}: {
  initialMode: "login" | "signup";
  dict: AuthDict;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "info"; text: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  /** 先过 Turnstile 服务端验证,通过才继续(防机器人批量注册/登录) */
  async function verifyTurnstile(): Promise<boolean> {
    const token = (window as unknown as { turnstile?: { getResponse: () => string } })
      .turnstile?.getResponse();
    if (!token) {
      setMessage({ type: "error", text: "Please complete the security check" });
      return false;
    }
    const res = await fetch("/api/turnstile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json().catch(() => ({ success: false }));
    return data.success === true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Gate: Turnstile 验证不通过则拒绝(服务端 siteverify)
      const passed = await verifyTurnstile();
      if (!passed) {
        setLoading(false);
        // token 单次使用,失败后重置 widget 允许重试
        (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
        return;
      }

      // 邮箱验证码登录(OTP):第一步发码,第二步验证
      if (authMethod === "otp" && mode === "login") {
        if (!otpSent) {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
          });
          if (error) throw error;
          setOtpSent(true);
          setMessage({ type: "info", text: dict.otpSent });
        } else {
          const { error } = await supabase.auth.verifyOtp({
            email,
            token: otpCode,
            type: "email",
          });
          if (error) throw error;
          router.push("/dashboard");
          router.refresh();
        }
        return;
      }

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
          setMessage({ type: "info", text: dict.successSignup });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 relative">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        strategy="afterInteractive"
      />
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {mode === "login" ? dict.welcomeBack : dict.createAccount}
          </h1>
          <p className="text-gray-400 mt-2">{dict.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{dict.email}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>

            {authMethod === "otp" && mode === "login" ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{dict.otpTitle}</label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  disabled={!otpSent}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  placeholder={dict.otpPlaceholder}
                />
                <p className="text-xs text-gray-500 mt-1">{dict.otpSubtitle}</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{dict.password}</label>
                <input
                  type="password"
                  required={mode === "signup" || authMethod !== "otp"}
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder={dict.passHint}
                />
              </div>
            )}

            {SITE_KEY && (
              <div
                className="cf-turnstile"
                data-sitekey={SITE_KEY}
                data-action="turnstile-spin-v2"
                data-theme="dark"
              />
            )}

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
              {loading
                ? dict.processing
                : authMethod === "otp" && mode === "login"
                  ? otpSent
                    ? dict.otpVerify
                    : dict.otpSend
                  : mode === "login"
                    ? dict.login
                    : dict.signup}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          {mode === "login" && (
            <button
              onClick={() => {
                setAuthMethod(authMethod === "otp" ? "password" : "otp");
                setOtpSent(false);
                setOtpCode("");
                setMessage(null);
              }}
              className="text-emerald-400 hover:underline mb-3 block mx-auto"
            >
              {authMethod === "otp" ? dict.passwordSwitch : dict.otpSwitch}
            </button>
          )}
          {mode === "login" ? (
            <>
              {dict.noAccount}{" "}
              <button onClick={() => setMode("signup")} className="text-emerald-400 hover:underline">
                {dict.freeSignup}
              </button>
            </>
          ) : (
            <>
              {dict.haveAccount}{" "}
              <button onClick={() => setMode("login")} className="text-emerald-400 hover:underline">
                {dict.goLogin}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
