"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Form {
  id: string;
  name: string;
  redirect_url: string | null;
  webhook_url: string | null;
  honeypot_field: string;
  enabled: boolean;
  submissions_count: number;
}

interface Submission {
  id: string;
  data: Record<string, unknown>;
  ip: string | null;
  created_at: string;
}

export default function FormDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/forms/${id}`);
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    if (res.status === 404) {
      router.push("/dashboard");
      return;
    }
    const data = await res.json();
    setForm(data.form);
    setSubmissions(data.submissions || []);
    setName(data.form.name);
    setRedirectUrl(data.form.redirect_url || "");
    setWebhookUrl(data.form.webhook_url || "");
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/forms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        redirect_url: redirectUrl || null,
        webhook_url: webhookUrl || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.form) {
      setForm(data.form);
      setEditing(false);
      load();
    }
  }

  async function toggleEnabled() {
    if (!form) return;
    const res = await fetch(`/api/forms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !form.enabled }),
    });
    const data = await res.json();
    if (data.form) setForm(data.form);
  }

  async function deleteForm() {
    if (!confirm("确定删除这个表单?所有提交记录将一并删除。")) return;
    await fetch(`/api/forms/${id}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  async function copyEndpoint() {
    const url = `https://formaroo.com/f/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  const htmlSnippet = `<form action="https://formaroo.com/f/${id}" method="POST">
  <input type="text" name="name" placeholder="你的名字" required />
  <input type="email" name="email" placeholder="邮箱" required />
  <input type="text" name="company_website" style="display:none" />
  <button type="submit">提交</button>
</form>`;

  const jsSnippet = `await fetch("https://formaroo.com/f/${id}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", email: "alice@example.com" }),
});
// → { "success": true, "submission_id": "..." }`;

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-300 text-sm">← 返回</Link>
            <span className="text-xl font-bold text-white">{form?.name}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleEnabled}
              className={`text-sm px-3 py-1.5 rounded-lg border transition ${
                form?.enabled
                  ? "border-gray-700 text-gray-300 hover:border-red-700 hover:text-red-400"
                  : "border-emerald-700 text-emerald-400 hover:bg-emerald-900/30"
              }`}
            >
              {form?.enabled ? "停用" : "启用"}
            </button>
            <button
              onClick={deleteForm}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-800 text-gray-500 hover:text-red-400 hover:border-red-800 transition"
            >
              删除
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* 接入代码 */}
        <section className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">接入你的表单</h2>
            <button
              onClick={copyEndpoint}
              className="text-sm px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
            >
              {copied ? "✓ 已复制" : "复制端点"}
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            端点地址:<code className="text-emerald-400 bg-gray-800 px-2 py-0.5 rounded font-mono">https://formaroo.com/f/{id}</code>
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">HTML 表单(最简单)</p>
              <pre className="text-xs bg-gray-950 rounded-xl p-4 overflow-x-auto text-gray-300 leading-relaxed">
                <code>{htmlSnippet}</code>
              </pre>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">JavaScript (fetch)</p>
              <pre className="text-xs bg-gray-950 rounded-xl p-4 overflow-x-auto text-gray-300 leading-relaxed">
                <code>{jsSnippet}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 设置 */}
        <section className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">设置</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-sm px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
              >
                编辑
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={saveSettings} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">表单名称</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">提交后跳转 URL(可选)</label>
                <input
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://your-site.com/thanks"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Webhook URL(可选)</label>
                <input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-site.com/hook"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-600 mt-1">每次提交后收到 JSON POST 通知</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium disabled:opacity-50"
                >
                  {saving ? "保存中..." : "保存"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm"
                >
                  取消
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">重定向</dt>
                <dd className="text-gray-300 mt-1">{form?.redirect_url || "未设置"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Webhook</dt>
                <dd className="text-gray-300 mt-1 truncate">{form?.webhook_url || "未设置"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">蜜罐字段</dt>
                <dd className="text-gray-300 mt-1 font-mono">{form?.honeypot_field}</dd>
              </div>
            </dl>
          )}
        </section>

        {/* 提交记录 */}
        <section className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              提交记录 <span className="text-gray-500 text-sm font-normal">({submissions?.length ?? 0})</span>
            </h2>
            <span className="text-xs text-gray-500">最近 100 条</span>
          </div>

          {submissions && submissions.length === 0 ? (
            <div className="text-center py-10 text-gray-600 text-sm">
              还没有提交。把上面的代码加到你的网站,收到第一条提交后就会显示在这里。
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {submissions?.map((s) => (
                <div key={s.id} className="bg-gray-950 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-gray-500">
                      {new Date(s.created_at).toLocaleString()}
                    </span>
                    <span className="text-gray-600 font-mono">{s.ip || "—"}</span>
                  </div>
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap break-all font-mono">
                    {JSON.stringify(s.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
