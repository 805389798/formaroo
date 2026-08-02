"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LanguageSwitcher from "@/components/language-switcher";

/**
 * 全站统一导航
 * - logo 永远是链接:点击回首页(解决"点 logo 回首页"体验)
 * - 感知登录态:已登录显示 Dashboard / 退出,未登录显示 Log in / Get started
 */
export default function Nav({
  dict,
}: {
  dict: {
    features: string;
    pricing: string;
    docs: string;
    login: string;
    signup: string;
    dashboard: string;
    logout: string;
    plan?: string;
  };
}) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => setLoggedIn(res.status === 200))
      .catch(() => setLoggedIn(false));
  }, []);

  async function logout() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav className="border-b border-gray-800/60 bg-[#0a0e14]/85 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* logo = 链接,点击回首页 */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="kangaroo-hop text-xl" aria-hidden>🦘</span>
          <span className="font-mono text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition">
            Formaroo
          </span>
          <span className="hidden sm:inline text-[10px] text-gray-600 font-mono border border-gray-800 rounded px-1.5 py-0.5">
            v0.1
          </span>
        </Link>

        <div className="flex items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- 锚点导航 */}
          <a href="/#features" className="hidden md:block text-sm text-gray-400 hover:text-white transition">
            {dict.features}
          </a>
          <Link href="/pricing" className="hidden md:block text-sm text-gray-400 hover:text-white transition">
            {dict.pricing}
          </Link>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- 锚点导航 */}
          <a href="/#docs" className="hidden md:block text-sm text-gray-400 hover:text-white transition">
            {dict.docs}
          </a>

          <LanguageSwitcher />

          {loggedIn === null ? null : loggedIn ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition">
                {dict.dashboard}
              </Link>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-400 transition"
              >
                {dict.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-300 hover:text-white transition hidden sm:block">
                {dict.login}
              </Link>
              <Link
                href="/login?mode=signup"
                className="text-sm px-4 py-2 rounded-md btn-accent transition"
              >
                {dict.signup}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
