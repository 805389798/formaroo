import Link from "next/link";

export default function HomePage() {
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
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition">功能</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition">定价</a>
            <a href="#docs" className="text-sm text-gray-400 hover:text-white transition">文档</a>
            <Link href="/login" className="text-sm text-gray-300 hover:text-white transition">登录</Link>
            <Link
              href="/login?mode=signup"
              className="text-sm px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-medium transition"
            >
              免费开始
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-900 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          无需后端 · 三行代码接入表单
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight max-w-3xl mx-auto">
          给开发者的
          <span className="text-emerald-400">表单后端</span>
          <br />
          免费开始,一分钟接入
        </h1>
        <p className="text-lg text-gray-400 mt-6 max-w-2xl mx-auto">
          Formaroo 是简单的表单提交 API。把 HTML 表单的 action 指向 Formaroo,
          提交自动存储、通知、转发——不用写一行后端代码。
        </p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link
            href="/login?mode=signup"
            className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-lg transition shadow-lg shadow-emerald-900/40"
          >
            免费创建账号
          </Link>
          <a
            href="#docs"
            className="px-8 py-3.5 rounded-xl bg-gray-900 border border-gray-700 hover:border-gray-500 font-medium text-lg transition"
          >
            查看文档
          </a>
        </div>
        <p className="text-sm text-gray-600 mt-6">免费计划每月 100 次提交 · 无需信用卡</p>
      </section>

      {/* 代码示例 */}
      <section id="docs" className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-800 bg-gray-950/50">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            <span className="text-xs text-gray-500 ml-3 font-mono">index.html</span>
          </div>
          <pre className="p-6 text-sm leading-relaxed overflow-x-auto font-mono">
            <code>
              <span className="text-gray-500">&lt;form</span>{" "}
              <span className="text-emerald-400">action</span>
              <span className="text-gray-300">=</span>
              <span className="text-amber-400">&quot;https://formaroo.com/f/YOUR_FORM_ID&quot;</span>{" "}
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
              <span className="text-amber-400">&quot;你的邮箱&quot;</span>{" "}
              <span className="text-emerald-400">required</span>
              <span className="text-gray-500">/&gt;</span>
              {"\n  "}
              <span className="text-gray-500">&lt;button</span>{" "}
              <span className="text-emerald-400">type</span>
              <span className="text-gray-300">=</span>
              <span className="text-amber-400">&quot;submit&quot;</span>
              <span className="text-gray-500">&gt;</span>
              <span className="text-gray-300">订阅</span>
              <span className="text-gray-500">&lt;/button&gt;</span>
              {"\n"}
              <span className="text-gray-500">&lt;/form&gt;</span>
            </code>
          </pre>
        </div>
        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
          <span>✅ 自动存储</span>
          <span>✅ 反垃圾</span>
          <span>✅ Webhook 转发</span>
          <span>✅ 提交重定向</span>
        </div>
      </section>

      {/* 功能 */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-14">为什么选 Formaroo</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "零后端接入",
              desc: "HTML action 或一行 fetch。不需要服务器、不需要处理跨域、不需要维护数据库。",
              icon: "⚡",
            },
            {
              title: "内置反垃圾",
              desc: "蜜罐字段 + IP 频率限制,垃圾提交自动拦截,不脏你的数据。",
              icon: "🛡️",
            },
            {
              title: "Webhook 转发",
              desc: "每次提交实时 POST 到你的服务器,和 Slack、CRM 或任何系统集成。",
              icon: "🔗",
            },
            {
              title: "提交后重定向",
              desc: "表单提交后自动跳转到感谢页,用户体验无缝衔接。",
              icon: "↩️",
            },
            {
              title: "提交管理仪表盘",
              desc: "在线查看所有提交,无需数据库客户端,数据一目了然。",
              icon: "📊",
            },
            {
              title: "免费开始",
              desc: "每月 100 次提交完全免费。流量大了再升级,按需付费。",
              icon: "🎁",
            },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 定价 */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">简单透明的定价</h2>
        <p className="text-center text-gray-500 mb-14">免费开始,按提交量付费</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Free",
              price: "$0",
              desc: "验证想法、个人项目",
              features: ["100 次提交/月", "1 个表单", "Webhook 转发", "提交管理面板"],
              cta: "免费开始",
              highlight: false,
            },
            {
              name: "Pro",
              price: "$9",
              desc: "正式网站、生产环境",
              features: ["10,000 次提交/月", "无限表单", "Webhook + 重定向", "优先支持"],
              cta: "升级 Pro",
              highlight: true,
            },
            {
              name: "Scale",
              price: "$29",
              desc: "高流量、团队使用",
              features: ["100,000 次提交/月", "无限表单", "全部 Pro 功能", "专属支持"],
              cta: "升级 Scale",
              highlight: false,
            },
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
                <span className="text-gray-500 text-sm">/月</span>
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
                  p.highlight
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-gray-800 hover:bg-gray-700"
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
        <h2 className="text-4xl font-bold mb-6">30 秒搞定你的表单后端</h2>
        <Link
          href="/login?mode=signup"
          className="inline-block px-10 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-lg transition shadow-lg shadow-emerald-900/40"
        >
          免费创建账号
        </Link>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-gray-800/60 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">© 2026 Formaroo · Built by Yearn05</div>
          <div className="flex gap-6 text-sm text-gray-600">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
