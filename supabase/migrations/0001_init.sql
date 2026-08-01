-- ============================================================
-- Formaroo · Database Schema (Supabase Postgres)
-- 作者: Yearn05 · 2026
-- ============================================================

-- ---------- 用户资料表(与 Supabase Auth 联动) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  -- 订阅计划:free | pro | scale
  plan text not null default 'free',
  -- LemonSqueezy 相关
  ls_customer_id bigint,
  ls_subscription_id bigint,
  ls_variant_id bigint,
  ls_status text,             -- active / on_trial / past_due / cancelled / expired
  -- 用量
  submissions_used integer not null default 0,   -- 当月已用提交数
  usage_month text not null default to_char(now(), 'YYYY-MM'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- 表单表 ----------
create table if not exists public.forms (
  id text primary key,                          -- formId,如 'abc123xyz' (9字符)
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'My Form',
  -- 配置
  redirect_url text,                            -- 提交后跳转地址(可选)
  webhook_url text,                             -- 提交后回调地址(可选)
  honeypot_field text default 'company_website',-- 蜜罐字段名(反垃圾)
  enabled boolean not null default true,
  submissions_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_forms_user on public.forms(user_id, created_at desc);

-- ---------- 提交记录表 ----------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  form_id text not null references public.forms(id) on delete cascade,
  data jsonb not null,                          -- 表单字段原文
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists idx_submissions_form on public.submissions(form_id, created_at desc);

-- ---------- 邮件通知队列(后续扩展用) ----------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  form_id text not null references public.forms(id) on delete cascade,
  kind text not null default 'email',           -- email | webhook
  payload jsonb,
  status text not null default 'pending',       -- pending | sent | failed
  attempts integer not null default 0,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.forms enable row level security;
alter table public.submissions enable row level security;
alter table public.notifications enable row level security;

-- profiles: 用户只能读写自己的
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- forms: 用户只能操作自己的表单
create policy "forms_select_own" on public.forms
  for select using (auth.uid() = user_id);
create policy "forms_insert_own" on public.forms
  for insert with check (auth.uid() = user_id);
create policy "forms_update_own" on public.forms
  for update using (auth.uid() = user_id);
create policy "forms_delete_own" on public.forms
  for delete using (auth.uid() = user_id);

-- submissions: 用户只能通过自己的表单看提交(通过 forms 关联)
create policy "submissions_select_own" on public.submissions
  for select using (
    exists (select 1 from public.forms f where f.id = submissions.form_id and f.user_id = auth.uid())
  );
-- 注意:提交写入走 service role(服务端),不走 RLS
-- create policy "submissions_insert_anon" ... (不需要,服务端用 service key)

-- notifications: 同 submissions
create policy "notifications_select_own" on public.notifications
  for select using (
    exists (select 1 from public.forms f where f.id = notifications.form_id and f.user_id = auth.uid())
  );

-- ============================================================
-- 自动更新时间
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists trg_forms_updated on public.forms;
create trigger trg_forms_updated before update on public.forms
  for each row execute function public.handle_updated_at();

-- 新用户注册时自动创建 profile
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
