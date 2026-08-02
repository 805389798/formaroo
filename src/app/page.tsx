import Link from "next/link";
import Nav from "@/components/nav";
import { getServerDictionary } from "@/lib/locale";

export default async function HomePage() {
  const t = await getServerDictionary();

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#e8e6e3] bg-grid scanline relative">
      <Nav dict={t.nav} />

      {/* Hero:终端美学,代码即主角 */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center fade-in-up">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-900 rounded-md px-3 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>$ formaroo --status</span>
            <span className="text-emerald-400">▸ online</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-mono font-bold tracking-tight leading-tight max-w-3xl mx-auto">
            {t.hero.title1}
            <span className="text-amber-400"> {t.hero.title2}</span>
            <span className="cursor-blink"></span>
          </h1>
          <p className="text-lg text-gray-400 mt-6 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link
              href="/login?mode=signup"
              className="px-8 py-3.5 rounded-md btn-accent font-mono text-lg transition"
            >
              $ {t.hero.ctaStart}
            </Link>
            <a
              href="#docs"
              className="px-8 py-3.5 rounded-md bg-[#11161f] border border-[#232b3a] hover:border-gray-500 font-mono text-lg transition"
            >
              {t.hero.ctaDocs}
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-6 font-mono">
            {t.hero.freeNote}
          </p>
        </div>

        {/* 终端窗口:三行接入(产品灵魂) */}
        <div id="docs" className="max-w-3xl mx-auto mt-16 fade-in-up" style={{ animationDelay: "0.15s" }}>
          <div className="term-panel rounded-lg overflow-hidden shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#232b3a] bg-[#0d121b]">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              <span className="text-xs text-gray-500 ml-3 font-mono">{t.code.htmlLabel}</span>
              <span className="ml-auto text-[10px] font-mono text-gray-700">index.html</span>
            </div>
            <pre className="p-6 text-sm leading-relaxed overflow-x-auto font-mono">
              <code>
                <span className="text-gray-600">$</span>{" "}
                <span className="text-amber-400">cat</span>{" "}
                <span className="text-gray-400">index.html</span>
                {"\n"}
                <span className="text-gray-500">&lt;form</span>{" "}
                <span className="text-emerald-400">action</span>
                <span className="text-gray-300">=</span>
                <span className="text-amber-400">&quot;https://formaroo.yearn05.top/f/YOUR_FORM_ID&quot;</span>{" "}
                <span className="text-emerald-400">method</span>
                <span className="text-gray-300">=</span>
                <span className="text-amber-400">&quot;POST&quot;</span>
                <span className="text-gray-500">&gt;</span>
                {"\n  "}
                <span className="text-gray-500">&lt;input</span>{" "}
                <span className="text-emerald-400">name</span>
                <span className="text-gray-300">=</span>
                <span className="text-amber-400">&quot;email&quot;</span>{" "}
                <span className="text-emerald-400">type</span>
                <span className="text-gray-300">=</span>
                <span className="text-amber-400">&quot;email&quot;</span>{" "}
                <span className="text-emerald-400">required</span>
                <span className="text-gray-500">/&gt;</span>
                {"\n  "}
                <span className="text-gray-500">&lt;button</span>{" "}
                <span className="text-emerald-400">type</span>
                <span className="text-gray-300">=</span>
                <span className="text-amber-400">&quot;submit&quot;</span>
                <span className="text-gray-500">&gt;</span>
                <span className="text-gray-300">Subscribe</span>
                <span className="text-gray-500">&lt;/button&gt;</span>
                {"\n"}
                <span className="text-gray-500">&lt;/form&gt;</span>
                {"\n\n"}
                <span className="text-gray-600"># ✅ submission received →</span>{" "}
                <span className="text-emerald-400">your dashboard</span>
              </code>
            </pre>
          </div>
          <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500 flex-wrap font-mono">
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> {t.features.f1.t}</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> {t.features.f2.t}</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> {t.features.f3.t}</span>
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> {t.features.f4.t}</span>
          </div>
        </div>
      </section>

      {/* 功能:终端化编号列表 */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-mono font-bold text-center mb-4">
          <span className="text-amber-400">$</span> {t.features.title}
        </h2>
        <p className="text-center text-gray-500 font-mono text-sm mb-14"># what you get, no backend required</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { n: "01", icon: "⚡", t: t.features.f1.t, d: t.features.f1.d },
            { n: "02", icon: "🛡️", t: t.features.f2.t, d: t.features.f2.d },
            { n: "03", icon: "🔗", t: t.features.f3.t, d: t.features.f3.d },
            { n: "04", icon: "↩️", t: t.features.f4.t, d: t.features.f4.d },
            { n: "05", icon: "📊", t: t.features.f5.t, d: t.features.f5.d },
            { n: "06", icon: "🎁", t: t.features.f6.t, d: t.features.f6.d },
          ].map((f, i) => (
            <div
              key={f.n}
              className="term-panel rounded-lg p-5 hover:border-amber-700/60 transition group fade-in-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-gray-600 group-hover:text-amber-400 transition">{f.n}</span>
                <span className="text-2xl group-hover:scale-110 transition">{f.icon}</span>
              </div>
              <h3 className="font-mono font-semibold mb-2">{f.t}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 定价:终端表格风 */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-mono font-bold text-center mb-4">
          <span className="text-amber-400">$</span> {t.pricingSection.title}
        </h2>
        <p className="text-center text-gray-500 font-mono text-sm mb-14">{t.pricingSection.subtitle}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { ...t.pricingSection.free, highlight: false },
            { ...t.pricingSection.pro, highlight: true },
            { ...t.pricingSection.scale, highlight: false },
          ].map((p, i) => (
            <div
              key={p.name}
              className={`term-panel rounded-lg p-7 border transition fade-in-up ${
                p.highlight ? "border-amber-700/70 shadow-lg shadow-amber-900/20 bg-[#141a26]" : ""
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-mono font-semibold">{p.name}</h3>
                {p.highlight && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-600 text-[#1a1206] font-mono font-bold">
                    ★ {t.pricingSection.perMonth === "/月" ? "推荐" : "POPULAR"}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-mono font-bold">{p.price}</span>
                <span className="text-gray-500 text-sm font-mono">{t.pricingSection.perMonth}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{p.desc}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300 font-mono text-xs">
                    <span className="text-amber-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className={`mt-8 block text-center py-3 rounded-md font-mono transition ${
                  p.highlight ? "btn-accent" : "bg-[#1a2230] hover:bg-[#223047] text-gray-300"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-mono font-bold mb-6">
          {t.cta.title} <span className="kangaroo-hop inline-block">🦘</span>
        </h2>
        <Link
          href="/login?mode=signup"
          className="inline-block px-10 py-4 rounded-md btn-accent font-mono text-lg transition"
        >
          $ {t.cta.button}
        </Link>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-gray-800/60 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 font-mono">🦘 {t.footer.rights}</div>
          <div className="flex gap-6 text-sm text-gray-600 font-mono">
            <span>{t.footer.privacy}</span>
            <span>{t.footer.terms}</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {t.footer.status}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
