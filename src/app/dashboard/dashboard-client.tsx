"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/language-switcher";

interface Form {
  id: string;
  name: string;
  submissions_count: number;
  created_at: string;
  enabled: boolean;
}

interface MeData {
  user: { plan: string; ls_status: string | null; submissions_used: number };
  quota: number;
  remaining: number;
}

interface DashboardDict {
  loading: string;
  planLabel: string;
  usageTitle: string;
  remaining: string;
  upgrade: string;
  myForms: string;
  newForm: string;
  formName: string;
  creating: string;
  create: string;
  noFormsTitle: string;
  noFormsDesc: string;
  createFirst: string;
  submissions: string;
  disabled: string;
  logout: string;
}

export default function DashboardClient({ dict }: { dict: DashboardDict }) {
  const [forms, setForms] = useState<Form[] | null>(null);
  const [me, setMe] = useState<MeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const load = useCallback(async () => {
    const [formsRes, meRes] = await Promise.all([
      fetch("/api/forms"),
      fetch("/api/me"),
    ]);
    if (formsRes.status === 401 || meRes.status === 401) {
      router.push("/login");
      return;
    }
    const formsData = await formsRes.json();
    const meData = await meRes.json();
    setForms(formsData.forms || []);
    setMe(meData);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 异步数据加载,标准模式
    load();
  }, [load]);

  async function createForm(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName || "My Form" }),
    });
    const data = await res.json();
    setCreating(false);
    if (data.form) {
      router.push(`/dashboard/${data.form.id}`);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center">
        <div className="text-gray-400 font-mono animate-pulse">{dict.loading}</div>
      </div>
    );
  }

  const usagePct = me ? Math.min(100, Math.round((me.user.submissions_used / me.quota) * 100)) : 0;

  return (
    <div className="min-h-screen bg-[#0a0e14] bg-grid">
      <nav className="border-b border-gray-800 bg-[#0a0e14]/85 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* logo = 链接,点击回首页 */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="kangaroo-hop text-xl" aria-hidden>🦘</span>
            <span className="font-mono text-lg font-bold text-white group-hover:text-amber-400 transition">Formaroo</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#141a26] border border-amber-900/60 text-amber-400 font-mono">
              {me?.user.plan || "free"}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button onClick={logout} className="text-sm font-mono text-gray-500 hover:text-gray-300">
              $ exit
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 fade-in-up">
        {/* 用量 */}
        {me && (
          <div className="term-panel rounded-lg p-5 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400 font-mono">$ quota --status</span>
              <span className="text-sm text-gray-300 font-mono">
                {me.user.submissions_used} / {me.quota.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-[#1a2230] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${usagePct > 90 ? "bg-red-500" : "bg-amber-500"}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs font-mono">
              <span className="text-gray-500">{dict.remaining} {me.remaining.toLocaleString()}</span>
              {me.user.plan === "free" && (
                <Link href="/pricing" className="text-amber-400 term-link">{dict.upgrade}</Link>
              )}
            </div>
          </div>
        )}

        {/* 表单列表 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono font-semibold text-white">
            <span className="text-amber-400">$</span> {dict.myForms}
          </h2>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 rounded-md btn-accent font-mono text-sm transition"
          >
            + {dict.newForm}
          </button>
        </div>

        {showCreate && (
          <form onSubmit={createForm} className="term-panel rounded-lg p-5 mb-6 flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={dict.formName}
              className="flex-1 px-4 py-2.5 rounded-md bg-[#0d121b] border border-[#232b3a] text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 rounded-md btn-accent font-mono text-sm disabled:opacity-50"
            >
              {creating ? "…" + dict.creating : dict.create}
            </button>
          </form>
        )}

        {forms && forms.length === 0 ? (
          <div className="term-panel rounded-lg border-dashed p-12 text-center">
            <p className="text-gray-400 mb-2 font-mono">{dict.noFormsTitle}</p>
            <p className="text-sm text-gray-600 mb-6 font-mono">{dict.noFormsDesc}</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 rounded-md btn-accent font-mono text-sm"
            >
              {dict.createFirst}
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {forms?.map((form) => (
              <Link
                key={form.id}
                href={`/dashboard/${form.id}`}
                className="term-panel rounded-lg p-5 hover:border-amber-700/60 transition flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-mono text-white group-hover:text-amber-400 transition">
                      {form.name}
                    </h3>
                    {!form.enabled && (
                      <span className="text-xs px-2 py-0.5 rounded bg-[#1a2230] text-gray-500 font-mono">{dict.disabled}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 font-mono">
                    <span className="text-amber-400">~/f/</span>{form.id}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-semibold text-white">{form.submissions_count}</div>
                  <div className="text-xs text-gray-500 font-mono">{dict.submissions}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
