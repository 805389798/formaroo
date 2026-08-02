"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formEndpoint } from "@/lib/site";
import LanguageSwitcher from "@/components/language-switcher";

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

interface FormDetailDict {
  loading: string;
  enable: string;
  disable: string;
  delete: string;
  confirmDelete: string;
  integrate: string;
  copyEndpoint: string;
  copied: string;
  endpoint: string;
  htmlLabel: string;
  jsLabel: string;
  settings: string;
  edit: string;
  formName: string;
  redirectUrl: string;
  webhookUrl: string;
  webhookHint: string;
  save: string;
  saving: string;
  cancel: string;
  notSet: string;
  honeypot: string;
  submissionsTitle: string;
  recent: string;
  noSubmissions: string;
}

export default function FormDetailClient({
  formId,
  dict,
}: {
  formId: string;
  dict: FormDetailDict;
}) {
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
    const res = await fetch(`/api/forms/${formId}`);
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
  }, [formId, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 异步数据加载,标准模式
    load();
  }, [load]);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/forms/${formId}`, {
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
    const res = await fetch(`/api/forms/${formId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !form.enabled }),
    });
    const data = await res.json();
    if (data.form) setForm(data.form);
  }

  async function deleteForm() {
    if (!confirm(dict.confirmDelete)) return;
    await fetch(`/api/forms/${formId}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  async function copyEndpoint() {
    const url = formEndpoint(formId);
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
        <div className="text-gray-400">{dict.loading}</div>
      </div>
    );
  }

  const htmlSnippet = `<form action="${formEndpoint(formId)}" method="POST">
  <input type="text" name="name" placeholder="Your name" required />
  <input type="email" name="email" placeholder="Email" required />
  <input type="text" name="company_website" style="display:none" />
  <button type="submit">Submit</button>
</form>`;

  const jsSnippet = `await fetch("${formEndpoint(formId)}", {
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
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-300 text-sm font-mono">← ~/back</Link>
            <span className="font-mono font-bold text-white">
              <span className="text-amber-400">~/f/</span>{form?.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={toggleEnabled}
              className={`text-sm px-3 py-1.5 rounded-md border font-mono transition ${
                form?.enabled
                  ? "border-gray-700 text-gray-300 hover:border-red-700 hover:text-red-400"
                  : "border-amber-700 text-amber-400 hover:bg-amber-900/30"
              }`}
            >
              {form?.enabled ? dict.disable : dict.enable}
            </button>
            <button
              onClick={deleteForm}
              className="text-sm px-3 py-1.5 rounded-md border border-gray-800 text-gray-500 hover:text-red-400 hover:border-red-800 transition font-mono"
            >
              {dict.delete}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 fade-in-up">
        {/* 接入代码 */}
        <section className="term-panel rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono font-semibold text-white"><span className="text-amber-400">$</span> {dict.integrate}</h2>
            <button
              onClick={copyEndpoint}
              className="text-sm px-3 py-1.5 rounded-md bg-[#1a2230] hover:bg-[#223047] text-gray-300 transition font-mono"
            >
              {copied ? dict.copied : dict.copyEndpoint}
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-3 font-mono">
            {dict.endpoint}: <code className="text-amber-400 bg-[#0d121b] px-2 py-0.5 rounded font-mono border border-[#232b3a]">{formEndpoint(formId)}</code>
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2 font-mono">{dict.htmlLabel}</p>
              <pre className="text-xs bg-[#0d121b] rounded-lg p-4 overflow-x-auto text-gray-300 leading-relaxed border border-[#1a2230]">
                <code>{htmlSnippet}</code>
              </pre>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2 font-mono">{dict.jsLabel}</p>
              <pre className="text-xs bg-[#0d121b] rounded-lg p-4 overflow-x-auto text-gray-300 leading-relaxed border border-[#1a2230]">
                <code>{jsSnippet}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 设置 */}
        <section className="term-panel rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono font-semibold text-white"><span className="text-amber-400">$</span> {dict.settings}</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-sm px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
              >
                {dict.edit}
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={saveSettings} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1 font-mono">{dict.formName}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md bg-[#0d121b] border border-[#232b3a] text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1 font-mono">{dict.redirectUrl}</label>
                <input
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://your-site.com/thanks"
                  className="w-full px-4 py-2.5 rounded-md bg-[#0d121b] border border-[#232b3a] text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1 font-mono">{dict.webhookUrl}</label>
                <input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-site.com/hook"
                  className="w-full px-4 py-2.5 rounded-md bg-[#0d121b] border border-[#232b3a] text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <p className="text-xs text-gray-600 mt-1 font-mono">{dict.webhookHint}</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium disabled:opacity-50"
                >
                  {saving ? dict.saving : dict.save}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm"
                >
                  {dict.cancel}
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Redirect</dt>
                <dd className="text-gray-300 mt-1">{form?.redirect_url || dict.notSet}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Webhook</dt>
                <dd className="text-gray-300 mt-1 truncate">{form?.webhook_url || dict.notSet}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{dict.honeypot}</dt>
                <dd className="text-gray-300 mt-1 font-mono">{form?.honeypot_field}</dd>
              </div>
            </dl>
          )}
        </section>

        {/* 提交记录 */}
        <section className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {dict.submissionsTitle} <span className="text-gray-500 text-sm font-normal">({submissions?.length ?? 0})</span>
            </h2>
            <span className="text-xs text-gray-500">{dict.recent}</span>
          </div>

          {submissions && submissions.length === 0 ? (
            <div className="text-center py-10 text-gray-600 text-sm">
              {dict.noSubmissions}
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
