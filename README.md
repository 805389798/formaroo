# Formaroo 🦘

给开发者的表单后端 API。把 HTML 表单的 `action` 指向 Formaroo,提交自动存储、反垃圾、Webhook 转发——不用写一行后端代码。

**作者:Yearn05** · 技术栈:Next.js 16 + Supabase + LemonSqueezy · 部署:Vercel

## 功能

- ⚡ 三行代码接入:`<form action="https://formaroo.yearn05.top/f/{FORM_ID}" method="POST">`
- 📥 提交自动入库(Supabase Postgres)
- 🛡️ 内置反垃圾:蜜罐字段 + IP 频率限制
- 🔗 Webhook 转发:提交后实时 POST 到你的服务器
- ↩️ 提交后重定向到感谢页
- 📊 仪表盘:查看/管理提交
- 💳 订阅计费:LemonSqueezy(MoR,全球税务平台代缴)

## 项目结构

```
form-api/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 落地页
│   │   ├── login/page.tsx        # 登录/注册
│   │   ├── pricing/page.tsx      # 定价页(触发 LS Checkout)
│   │   ├── dashboard/page.tsx    # 仪表盘:表单列表
│   │   ├── dashboard/[id]/page.tsx  # 表单详情:提交记录+设置
│   │   ├── f/[formId]/route.ts   # ⭐ 核心:公开表单提交端点
│   │   └── api/
│   │       ├── forms/route.ts    # 表单 CRUD
│   │       ├── forms/[id]/route.ts
│   │       ├── checkout/route.ts # 发起 LS Checkout
│   │       ├── lemon-webhook/route.ts # LS 订阅 webhook
│   │       └── me/route.ts       # 用户信息+用量
│   ├── lib/
│   │   ├── form.ts               # 提交处理核心(反垃圾/入库/Webhook)
│   │   ├── lemon.ts              # LemonSqueezy API 封装
│   │   └── supabase/             # Supabase 客户端(server/client/admin)
│   └── proxy.ts                  # 认证守卫(Next 16 proxy)
├── supabase/migrations/0001_init.sql  # 数据库结构
└── .env.example                  # 环境变量模板
```

## 本地开发

```bash
npm install
cp .env.example .env.local   # 填入 Supabase / LemonSqueezy 凭据
npm run dev
```

## 数据库

在 Supabase 创建项目后,执行 `supabase/migrations/0001_init.sql`(SQL Editor 粘贴运行)。
包含:profiles / forms / submissions / notifications 四张表 + RLS + 新用户自动建档触发器。

## 部署

见 `docs/部署指南.md`。
