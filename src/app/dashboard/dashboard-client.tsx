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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">{dict.loading}</div>
      </div>
    );
  }

  const usagePct = me ? Math.min(100, Math.round((me.user.submissions_used / me.quota) * 100)) : 0;

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white">Formaroo</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-400 border border-emerald-800">
              {me?.user.plan || "free"} {dict.planLabel}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-300">{dict.logout}</button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 用量 */}
        {me && (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{dict.usageTitle}</span>
              <span className="text-sm text-gray-300">
                {me.user.submissions_used} / {me.quota.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${usagePct > 90 ? "bg-red-500" : "bg-emerald-500"}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs">
              <span className="text-gray-500">{dict.remaining} {me.remaining.toLocaleString()}</span>
              {me.user.plan === "free" && (
                <Link href="/pricing" className="text-emerald-400 hover:underline">{dict.upgrade}</Link>
              )}
            </div>
          </div>
        )}

        {/* 表单列表 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{dict.myForms}</h2>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition"
          >
            + {dict.newForm}
          </button>
        </div>

        {showCreate && (
          <form onSubmit={createForm} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 mb-6 flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={dict.formName}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium disabled:opacity-50"
            >
              {creating ? dict.creating : dict.create}
            </button>
          </form>
        )}

        {forms && forms.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl border border-dashed border-gray-700 p-12 text-center">
            <p className="text-gray-400 mb-2">{dict.noFormsTitle}</p>
            <p className="text-sm text-gray-600 mb-6">{dict.noFormsDesc}</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
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
                className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-emerald-700 transition flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-white group-hover:text-emerald-400 transition">
                      {form.name}
                    </h3>
                    {!form.enabled && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">{dict.disabled}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 font-mono">
                    /f/{form.id}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">{form.submissions_count}</div>
                  <div className="text-xs text-gray-500">{dict.submissions}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
