"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { locales } from "@/lib/i18n";

/**
 * 语言切换器(🌐 EN / 中文)
 * 通过 cookie 记住选择,下次访问自动应用
 */
export default function LanguageSwitcher() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function switchTo(locale: string) {
    // 存 cookie(有效期1年)。浏览器标准 Cookie API,非 React 状态。
    // eslint-disable-next-line react-hooks/immutability -- 浏览器 Cookie API 赋值,非 React 状态修改
    document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
    // 刷新让所有服务端组件重新读取语言
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition flex items-center gap-1.5"
        aria-label="Language"
      >
        <span>🌐</span>
        <span>EN / 中文</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 min-w-[140px]">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchTo(l)}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-800 transition"
            >
              {l === "en" ? "🇺🇸 English" : "🇨🇳 中文"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
