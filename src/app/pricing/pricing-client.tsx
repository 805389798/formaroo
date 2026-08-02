"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LanguageSwitcher from "@/components/language-switcher";

interface PricingDict {
  title: string;
  subtitle: string;
  perMonth: string;
  mostPopular: string;
  buyNow: string;
  goPay: string;
  activateTitle: string;
  activateDesc: string;
  placeholder: string;
  activate: string;
  verifying: string;
  success: string;
  error: string;
  networkError: string;
  freeStart: string;
}

/** 成功庆祝:礼花(确定性伪随机,符合 purity 规则) */
function Confetti() {
  const colors = ["#f59e0b", "#4ade80", "#60a5fa", "#f472b6", "#a78bfa", "#facc15"];
  // 确定性"随机"(seeded),避免渲染期调用 Math.random
  const pieces = Array.from({ length: 24 }, (_, i) => {
    const seed = (i * 2654435761) % 100;
    return {
      left: 10 + (seed % 80),
      delay: (i % 5) * 0.06,
      color: colors[i % colors.length],
      size: 6 + (i % 4) * 2,
    };
  });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: "60%",
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function PricingClient({ dict }: { dict: PricingDict }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loadingVariant, setLoadingVariant] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [licenseKey, setLicenseKey] = useState("");
  const [activatePlan, setActivatePlan] = useState<"pro" | "scale">("pro");
  const [activating, setActivating] = useState(false);
  const [activateMsg, setActivateMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [activated, setActivated] = useState(false);
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
        // eslint-disable-next-line react-hooks/immutability -- 页面跳转,非状态修改
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create checkout");
      }
    } catch {
      setError(dict.networkError);
    } finally {
      setLoadingVariant(null);
    }
  }

  async function activateLicense() {
    if (!licenseKey.trim()) return;
    setActivating(true);
    setActivateMsg(null);
    try {
      const res = await fetch("/api/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key: licenseKey.trim(), plan: activatePlan }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActivated(true);
        setActivateMsg({
          type: "success",
          text: `${dict.success} ${data.plan === "scale" ? "Scale" : "Pro"}!`,
        });
        setLicenseKey("");
        // 2.5 秒后自动跳转仪表盘,让用户看到成功反馈
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 2500);
      } else {
        setActivateMsg({ type: "error", text: data.error || dict.error });
      }
    } catch {
      setActivateMsg({ type: "error", text: dict.networkError });
    } finally {
      setActivating(false);
    }
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      desc: dict.freeStart,
      features: ["100 submissions/month", "1 form", "Webhook forwarding", "Submission dashboard"],
      cta: dict.freeStart,
      highlight: false,
      action: () => router.push("/login?mode=signup"),
    },
    {
      name: "Pro",
      price: "$9",
      desc: "Production sites",
      features: ["10,000 submissions/month", "Unlimited forms", "Webhooks + redirects", "Priority support"],
      cta: dict.buyNow,
      highlight: true,
      action: () => subscribe("pro"),
    },
    {
      name: "Scale",
      price: "$29",
      desc: "High traffic, teams",
      features: ["100,000 submissions/month", "Unlimited forms", "Everything in Pro", "Dedicated support"],
      cta: dict.buyNow,
      highlight: false,
      action: () => subscribe("scale"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#e8e6e3] bg-grid">
      <nav className="border-b border-gray-800/60 bg-[#0a0e14]/85 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="kangaroo-hop text-xl" aria-hidden>🦘</span>
            <span className="font-mono text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition">
              Formaroo
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition font-mono">
              {dict.title === "Pricing" ? "~/dashboard" : "~/仪表盘"}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-mono font-bold text-center mb-4">
          <span className="text-amber-400">$</span> {dict.title}
        </h1>
        <p className="text-center text-gray-500 font-mono text-sm mb-14">{dict.subtitle}</p>

        {error && (
          <div className="max-w-md mx-auto mb-8 text-sm font-mono text-red-300 bg-red-950/50 border border-red-900 rounded-md px-4 py-3 text-center">
            ✗ {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((p, i) => (
            <div
              key={p.name}
              className={`term-panel rounded-lg p-7 border relative fade-in-up ${
                p.highlight ? "border-amber-700/70 bg-[#141a26] shadow-lg shadow-amber-900/20" : ""
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded bg-amber-600 text-[#1a1206] font-mono font-bold whitespace-nowrap">
                  ★ {dict.mostPopular}
                </span>
              )}
              <h3 className="font-mono font-semibold text-lg">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-mono font-bold">{p.price}</span>
                <span className="text-gray-500 text-sm font-mono">{dict.perMonth}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{p.desc}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300 font-mono text-xs">
                    <span className="text-amber-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={p.action}
                disabled={loadingVariant === p.name.toLowerCase()}
                className={`mt-8 w-full text-center py-3 rounded-md font-mono transition disabled:opacity-50 ${
                  p.highlight ? "btn-accent" : "bg-[#1a2230] hover:bg-[#223047] text-gray-300"
                }`}
              >
                {loadingVariant === p.name.toLowerCase() ? "…" + dict.goPay : p.cta}
              </button>
            </div>
          ))}
        </div>

        {/* License key 激活 */}
        <div className="max-w-lg mx-auto mt-16 term-panel rounded-lg p-6 relative">
          {activated && <Confetti />}
          <h2 className="font-mono font-semibold mb-1">
            <span className="text-amber-400">$</span> {dict.activateTitle}
          </h2>
          <p className="text-sm text-gray-500 mb-4 font-mono">{dict.activateDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder={dict.placeholder}
              className="flex-1 px-4 py-2.5 rounded-md bg-[#0d121b] border border-[#232b3a] text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
            />
            <div className="flex gap-2">
              <select
                value={activatePlan}
                onChange={(e) => setActivatePlan(e.target.value as "pro" | "scale")}
                className="px-3 py-2.5 rounded-md bg-[#0d121b] border border-[#232b3a] text-white text-sm focus:outline-none font-mono"
              >
                <option value="pro">pro</option>
                <option value="scale">scale</option>
              </select>
              <button
                onClick={activateLicense}
                disabled={activating || !licenseKey}
                className="px-5 py-2.5 rounded-md btn-accent font-mono text-sm disabled:opacity-50 whitespace-nowrap"
              >
                {activating ? "…" + dict.verifying : "$ " + dict.activate}
              </button>
            </div>
          </div>
          {activateMsg && (
            <div
              className={`mt-3 text-sm px-4 py-3 rounded-md font-mono ${
                activateMsg.type === "error"
                  ? "bg-red-950/50 text-red-300 border border-red-900"
                  : "bg-emerald-950/40 text-emerald-300 border border-emerald-900"
              }`}
            >
              {activateMsg.type === "error" ? "✗ " : "✓ "}{activateMsg.text}
              {activateMsg.type === "success" && (
                <span className="block mt-1 text-xs text-gray-500 animate-pulse">
                  → redirecting to ~/dashboard...
                </span>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
