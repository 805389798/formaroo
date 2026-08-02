"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  googleLogin: string;
  orDivider: string;
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

  /** Google 一键登录(降低注册门槛) */
  async function handleGoogleLogin() {
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) throw error;
      // 浏览器会跳转到 Google 授权页
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Error" });
      setLoading(false);
    }
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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e14] px-4 relative bg-grid">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        strategy="afterInteractive"
      />
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="kangaroo-hop text-3xl" aria-hidden>🦘</span>
          </Link>
          <h1 className="text-3xl font-mono font-bold text-white">
            
            {mode === "login" ? dict.welcomeBack : dict.createAccount}
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm">{dict.subtitle}</p>
        </div>

        <div className="term-panel rounded-lg p-8">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-white hover:bg-gray-100 text-gray-800 font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {dict.googleLogin}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#232b3a]" />
            <span className="text-xs text-gray-500 font-mono">{dict.orDivider}</span>
            <div className="flex-1 h-px bg-[#232b3a]" />
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">{dict.email}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md bg-[#0d121b] border border-[#232b3a] text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                placeholder="you@example.com"
              />
            </div>

            {authMethod === "otp" && mode === "login" ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">{dict.otpTitle}</label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  disabled={!otpSent}
                  className="w-full px-4 py-2.5 rounded-md bg-[#0d121b] border border-[#232b3a] text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 font-mono tracking-widest"
                  placeholder={dict.otpPlaceholder}
                />
                <p className="text-xs text-gray-500 mt-1 font-mono">{dict.otpSubtitle}</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">{dict.password}</label>
                <input
                  type="password"
                  required={mode === "signup" || authMethod !== "otp"}
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md bg-[#0d121b] border border-[#232b3a] text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
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
                className={`text-sm px-4 py-3 rounded-md font-mono ${
                  message.type === "error"
                    ? "bg-red-950/50 text-red-300 border border-red-900"
                    : "bg-emerald-950/40 text-emerald-300 border border-emerald-900"
                }`}
              >
                {message.type === "error" ? "✗ " : "✓ "}{message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md btn-accent font-mono transition disabled:opacity-50"
            >
              {loading
                ? "…" + dict.processing
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
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm font-mono">
          {mode === "login" && (
            <button
              onClick={() => {
                setAuthMethod(authMethod === "otp" ? "password" : "otp");
                setOtpSent(false);
                setOtpCode("");
                setMessage(null);
              }}
              className="text-amber-400 hover:underline mb-3 block mx-auto"
            >
              {authMethod === "otp" ? dict.passwordSwitch : dict.otpSwitch}
            </button>
          )}
          {mode === "login" ? (
            <>
              {dict.noAccount}{" "}
              <button onClick={() => setMode("signup")} className="text-amber-400 hover:underline">
                {dict.freeSignup}
              </button>
            </>
          ) : (
            <>
              {dict.haveAccount}{" "}
              <button onClick={() => setMode("login")} className="text-amber-400 hover:underline">
                {dict.goLogin}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
