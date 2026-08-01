"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PricingPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loadingVariant, setLoadingVariant] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me").then(async (res) => {
      setLoggedIn(res.status === 200);
    });
  }, []);

  async function subscribe(variant: "pro" | "scale") {
    setLoadingVariant(variant);
    setError(null);
    if (!loggedIn) {
      router.push("/login?mode=signup");
      return;
    }
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "创建结账会话失败,请稍后再试");
      }
    } catch {
      setError("网络错误,请稍后再试");
    } finally {
      setLoadingVariant(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">Formaroo</Link>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">仪表盘</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-4">定价</h1>
        <p className="text-center text-gray-500 mb-14">免费开始,流量大了再升级</p>

        {error && (
          <div className="max-w-md mx-auto mb-8 text-sm text-red-300 bg-red-950/50 border border-red-900 rounded-xl px-4 py-3 text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="rounded-2xl p-8 border border-gray-800 bg-gray-900">
            <h3 className="font-semibold text-lg">Free</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500 text-sm">/月</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">验证想法、个人项目</p>
            <ul className="mt-6 space-y-3 text-sm">
              {["100 次提交/月", "1 个表单", "Webhook 转发", "提交管理面板"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-300">
                  <span className="text-emerald-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/login?mode=signup"
              className="mt-8 block text-center py-3 rounded-xl font-medium bg-gray-800 hover:bg-gray-700 transition"
            >
              免费开始
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-2xl p-8 border border-emerald-700 bg-emerald-950/40 shadow-xl shadow-emerald-900/30 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-emerald-600 font-medium">
              最受欢迎
            </span>
            <h3 className="font-semibold text-lg">Pro</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-gray-500 text-sm">/月</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">正式网站、生产环境</p>
            <ul className="mt-6 space-y-3 text-sm">
              {["10,000 次提交/月", "无限表单", "Webhook + 重定向", "优先支持"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-200">
                  <span className="text-emerald-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => subscribe("pro")}
              disabled={loadingVariant === "pro"}
              className="mt-8 w-full text-center py-3 rounded-xl font-medium bg-emerald-600 hover:bg-emerald-500 transition disabled:opacity-50"
            >
              {loadingVariant === "pro" ? "跳转支付..." : "升级 Pro"}
            </button>
          </div>

          {/* Scale */}
          <div className="rounded-2xl p-8 border border-gray-800 bg-gray-900">
            <h3 className="font-semibold text-lg">Scale</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-gray-500 text-sm">/月</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">高流量、团队使用</p>
            <ul className="mt-6 space-y-3 text-sm">
              {["100,000 次提交/月", "无限表单", "全部 Pro 功能", "专属支持"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-300">
                  <span className="text-emerald-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => subscribe("scale")}
              disabled={loadingVariant === "scale"}
              className="mt-8 w-full text-center py-3 rounded-xl font-medium bg-gray-800 hover:bg-gray-700 transition disabled:opacity-50"
            >
              {loadingVariant === "scale" ? "跳转支付..." : "升级 Scale"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
