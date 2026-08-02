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

export default function PricingClient({ dict }: { dict: PricingDict }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loadingVariant, setLoadingVariant] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [licenseKey, setLicenseKey] = useState("");
  const [activatePlan, setActivatePlan] = useState<"pro" | "scale">("pro");
  const [activating, setActivating] = useState(false);
  const [activateMsg, setActivateMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
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
        setActivateMsg({
          type: "success",
          text: `${dict.success} ${data.plan === "scale" ? "Scale" : "Pro"}!`,
        });
        setLicenseKey("");
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
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">Formaroo</Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">{dict.title === "Pricing" ? "Dashboard" : "仪表盘"}</Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-4">{dict.title}</h1>
        <p className="text-center text-gray-500 mb-14">{dict.subtitle}</p>

        {error && (
          <div className="max-w-md mx-auto mb-8 text-sm text-red-300 bg-red-950/50 border border-red-900 rounded-xl px-4 py-3 text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-8 border relative ${
                p.highlight ? "border-emerald-700 bg-emerald-950/40 shadow-xl shadow-emerald-900/30" : "border-gray-800 bg-gray-900"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-emerald-600 font-medium whitespace-nowrap">
                  {dict.mostPopular}
                </span>
              )}
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-gray-500 text-sm">{dict.perMonth}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{p.desc}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300">
                    <span className="text-emerald-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={p.action}
                disabled={loadingVariant === p.name.toLowerCase()}
                className={`mt-8 w-full text-center py-3 rounded-xl font-medium transition disabled:opacity-50 ${
                  p.highlight ? "bg-emerald-600 hover:bg-emerald-500" : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {loadingVariant === p.name.toLowerCase() ? dict.goPay : p.cta}
              </button>
            </div>
          ))}
        </div>

        {/* License key 激活 */}
        <div className="max-w-lg mx-auto mt-16 bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-1">{dict.activateTitle}</h2>
          <p className="text-sm text-gray-500 mb-4">{dict.activateDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder={dict.placeholder}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
            />
            <div className="flex gap-2">
              <select
                value={activatePlan}
                onChange={(e) => setActivatePlan(e.target.value as "pro" | "scale")}
                className="px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none"
              >
                <option value="pro">Pro</option>
                <option value="scale">Scale</option>
              </select>
              <button
                onClick={activateLicense}
                disabled={activating || !licenseKey}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium disabled:opacity-50 whitespace-nowrap"
              >
                {activating ? dict.verifying : dict.activate}
              </button>
            </div>
          </div>
          {activateMsg && (
            <div
              className={`mt-3 text-sm px-4 py-3 rounded-lg ${
                activateMsg.type === "error"
                  ? "bg-red-900/50 text-red-300 border border-red-800"
                  : "bg-emerald-900/50 text-emerald-300 border border-emerald-800"
              }`}
            >
              {activateMsg.text}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
