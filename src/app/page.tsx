import Link from "next/link";
import LanguageSwitcher from "@/components/language-switcher";
import { getServerDictionary } from "@/lib/locale";

export default async function HomePage() {
  const t = await getServerDictionary();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 导航 */}
      <nav className="border-b border-gray-800/60 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Formaroo</span>
            <span className="text-xs text-gray-600">🦘</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition hidden md:block">{t.nav.features}</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition hidden md:block">{t.nav.pricing}</a>
            <a href="#docs" className="text-sm text-gray-400 hover:text-white transition hidden md:block">{t.nav.docs}</a>
            <LanguageSwitcher />
            <Link href="/login" className="text-sm text-gray-300 hover:text-white transition hidden sm:block">{t.nav.login}</Link>
            <Link
              href="/login?mode=signup"
              className="text-sm px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-medium transition"
            >
              {t.nav.signup}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-900 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          {t.hero.badge}
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight max-w-3xl mx-auto">
          {t.hero.title1}
          <span className="text-emerald-400">{t.hero.title2}</span>
        </h1>
        <p className="text-lg text-gray-400 mt-6 max-w-2xl mx-auto">
          {t.hero.subtitle}
        </p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link
            href="/login?mode=signup"
            className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-lg transition shadow-lg shadow-emerald-900/40"
          >
            {t.hero.ctaStart}
          </Link>
          <a
            href="#docs"
            className="px-8 py-3.5 rounded-xl bg-gray-900 border border-gray-700 hover:border-gray-500 font-medium text-lg transition"
          >
            {t.hero.ctaDocs}
          </a>
        </div>
        <p className="text-sm text-gray-600 mt-6">{t.hero.freeNote}</p>
      </section>

      {/* 代码示例 */}
      <section id="docs" className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-800 bg-gray-950/50">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            <span className="text-xs text-gray-500 ml-3 font-mono">{t.code.htmlLabel}</span>
          </div>
          <pre className="p-6 text-sm leading-relaxed overflow-x-auto font-mono">
            <code>
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
              <span className="text-emerald-400">placeholder</span>
              <span className="text-gray-300">=</span>
              <span className="text-amber-400">&quot;your@email.com&quot;</span>{" "}
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
            </code>
          </pre>
        </div>
        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500 flex-wrap">
          <span>✅ {t.features.f1.t}</span>
          <span>✅ {t.features.f2.t}</span>
          <span>✅ {t.features.f3.t}</span>
          <span>✅ {t.features.f4.t}</span>
        </div>
      </section>

      {/* 功能 */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-14">{t.features.title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "⚡", t: t.features.f1.t, d: t.features.f1.d },
            { icon: "🛡️", t: t.features.f2.t, d: t.features.f2.d },
            { icon: "🔗", t: t.features.f3.t, d: t.features.f3.d },
            { icon: "↩️", t: t.features.f4.t, d: t.features.f4.d },
            { icon: "📊", t: t.features.f5.t, d: t.features.f5.d },
            { icon: "🎁", t: t.features.f6.t, d: t.features.f6.d },
          ].map((f) => (
            <div key={f.t} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.t}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 定价 */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">{t.pricingSection.title}</h2>
        <p className="text-center text-gray-500 mb-14">{t.pricingSection.subtitle}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { ...t.pricingSection.free, highlight: false },
            { ...t.pricingSection.pro, highlight: true },
            { ...t.pricingSection.scale, highlight: false },
          ].map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-8 border transition ${
                p.highlight
                  ? "bg-emerald-950/40 border-emerald-700 shadow-xl shadow-emerald-900/30"
                  : "bg-gray-900 border-gray-800"
              }`}
            >
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-gray-500 text-sm">{t.pricingSection.perMonth}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{p.desc}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300">
                    <span className="text-emerald-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login?mode=signup"
                className={`mt-8 block text-center py-3 rounded-xl font-medium transition ${
                  p.highlight ? "bg-emerald-600 hover:bg-emerald-500" : "bg-gray-800 hover:bg-gray-700"
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
        <h2 className="text-4xl font-bold mb-6">{t.cta.title}</h2>
        <Link
          href="/login?mode=signup"
          className="inline-block px-10 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-lg transition shadow-lg shadow-emerald-900/40"
        >
          {t.cta.button}
        </Link>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-gray-800/60 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">{t.footer.rights}</div>
          <div className="flex gap-6 text-sm text-gray-600">
            <span>{t.footer.privacy}</span>
            <span>{t.footer.terms}</span>
            <span>{t.footer.status}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
