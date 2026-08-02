// ============================================================
// Formaroo 多语言字典
// 主语言:en(英文,面向欧美开发者,SEO 默认)
// 第二语言:zh(中文,面向中文用户)
// ============================================================

export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export interface Dictionary {
  nav: {
    features: string;
    pricing: string;
    docs: string;
    login: string;
    signup: string;
    dashboard: string;
    logout: string;
    back: string;
    status: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    ctaStart: string;
    ctaDocs: string;
    freeNote: string;
  };
  code: {
    htmlLabel: string;
  };
  features: {
    title: string;
    f1: { t: string; d: string };
    f2: { t: string; d: string };
    f3: { t: string; d: string };
    f4: { t: string; d: string };
    f5: { t: string; d: string };
    f6: { t: string; d: string };
  };
  pricingSection: {
    title: string;
    subtitle: string;
    free: { name: string; price: string; desc: string; features: string[]; cta: string };
    pro: { name: string; price: string; desc: string; features: string[]; cta: string };
    scale: { name: string; price: string; desc: string; features: string[]; cta: string };
    perMonth: string;
  };
  cta: {
    title: string;
    button: string;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
    status: string;
    builtBy: string;
  };
  auth: {
    welcomeBack: string;
    createAccount: string;
    subtitle: string;
    email: string;
    password: string;
    login: string;
    signup: string;
    processing: string;
    noAccount: string;
    haveAccount: string;
    freeSignup: string;
    goLogin: string;
    successSignup: string;
    passHint: string;
    otpTitle: string;
    otpSubtitle: string;
    otpSend: string;
    otpVerify: string;
    otpSent: string;
    otpSwitch: string;
    passwordSwitch: string;
    otpPlaceholder: string;
  };
  dashboard: {
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
  };
  formDetail: {
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
  };
  pricing: {
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
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      docs: "Docs",
      login: "Log in",
      signup: "Get started",
      dashboard: "Dashboard",
      logout: "Log out",
      back: "Back",
      status: "plan",
    },
    hero: {
      badge: "No backend needed · Set up in 3 lines of code",
      title1: "Form backend",
      title2: "for developers",
      subtitle:
        "Formaroo is a simple form submission API. Point your HTML form action at Formaroo and submissions are stored, secured, and forwarded automatically — no backend code required.",
      ctaStart: "Create free account",
      ctaDocs: "View docs",
      freeNote: "Free plan: 100 submissions/month · No credit card required",
    },
    code: {
      htmlLabel: "index.html",
    },
    features: {
      title: "Why Formaroo",
      f1: {
        t: "Zero-backend setup",
        d: "HTML action or one fetch call. No server, no CORS handling, no database to maintain.",
      },
      f2: {
        t: "Built-in spam protection",
        d: "Honeypot field + IP rate limiting. Spam submissions are blocked before they touch your data.",
      },
      f3: {
        t: "Webhook forwarding",
        d: "Every submission is POSTed to your server in real time. Integrate with Slack, CRM, or anything.",
      },
      f4: {
        t: "Post-submit redirect",
        d: "Redirect users to a thank-you page after submission for a seamless experience.",
      },
      f5: {
        t: "Submission dashboard",
        d: "View all submissions online. No database client required — everything at a glance.",
      },
      f6: {
        t: "Free to start",
        d: "100 submissions/month free. Upgrade when you grow — pay as you go.",
      },
    },
    pricingSection: {
      title: "Simple, transparent pricing",
      subtitle: "Start free, pay by submissions",
      free: {
        name: "Free",
        price: "$0",
        desc: "Validate ideas, personal projects",
        features: ["100 submissions/month", "1 form", "Webhook forwarding", "Submission dashboard"],
        cta: "Start free",
      },
      pro: {
        name: "Pro",
        price: "$9",
        desc: "Production sites, real workloads",
        features: ["10,000 submissions/month", "Unlimited forms", "Webhooks + redirects", "Priority support"],
        cta: "Upgrade to Pro",
      },
      scale: {
        name: "Scale",
        price: "$29",
        desc: "High traffic, teams",
        features: ["100,000 submissions/month", "Unlimited forms", "Everything in Pro", "Dedicated support"],
        cta: "Upgrade to Scale",
      },
      perMonth: "/month",
    },
    cta: {
      title: "Set up your form backend in 30 seconds",
      button: "Create free account",
    },
    footer: {
      rights: "© 2026 Formaroo. All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
      status: "Status",
      builtBy: "Built by Yearn05",
    },
    auth: {
      welcomeBack: "Welcome back",
      createAccount: "Create your account",
      subtitle: "Formaroo · Form backend in 3 lines",
      email: "Email",
      password: "Password",
      login: "Log in",
      signup: "Sign up",
      processing: "Processing...",
      noAccount: "No account?",
      haveAccount: "Already have an account?",
      freeSignup: "Sign up free",
      goLogin: "Log in",
      successSignup: "Success! Check your email to confirm your account, then log in.",
      passHint: "At least 6 characters",
      otpTitle: "Email code login",
      otpSubtitle: "We'll email you a 6-digit code. No password needed.",
      otpSend: "Send code",
      otpVerify: "Verify & log in",
      otpSent: "Code sent! Check your email.",
      otpSwitch: "Use email code instead",
      passwordSwitch: "Use password instead",
      otpPlaceholder: "6-digit code",
    },
    dashboard: {
      loading: "Loading...",
      planLabel: "plan",
      usageTitle: "Submissions this month",
      remaining: "remaining",
      upgrade: "Upgrade plan →",
      myForms: "My Forms",
      newForm: "New form",
      formName: "Form name, e.g. Newsletter signup",
      creating: "Creating...",
      create: "Create",
      noFormsTitle: "No forms yet",
      noFormsDesc: "Create a form and get your own submission endpoint instantly",
      createFirst: "Create your first form",
      submissions: "submissions",
      disabled: "Disabled",
      logout: "Log out",
    },
    formDetail: {
      loading: "Loading...",
      enable: "Enable",
      disable: "Disable",
      delete: "Delete",
      confirmDelete: "Delete this form? All submissions will be permanently removed.",
      integrate: "Integrate your form",
      copyEndpoint: "Copy endpoint",
      copied: "Copied ✓",
      endpoint: "Endpoint",
      htmlLabel: "HTML form (simplest)",
      jsLabel: "JavaScript (fetch)",
      settings: "Settings",
      edit: "Edit",
      formName: "Form name",
      redirectUrl: "Redirect URL (optional)",
      webhookUrl: "Webhook URL (optional)",
      webhookHint: "Receives a JSON POST on every submission",
      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
      notSet: "Not set",
      honeypot: "Honeypot field",
      submissionsTitle: "Submissions",
      recent: "Latest 100",
      noSubmissions: "No submissions yet. Add the code above to your site and the first submission will appear here.",
    },
    pricing: {
      title: "Pricing",
      subtitle: "Start free, upgrade when you grow",
      perMonth: "/month",
      mostPopular: "Most popular",
      buyNow: "Upgrade now",
      goPay: "Redirecting to payment...",
      activateTitle: "Already have a license key?",
      activateDesc: "After paying on Gumroad, the license key is emailed to you. Paste it here to activate your plan.",
      placeholder: "Paste your Gumroad license key",
      activate: "Activate",
      verifying: "Verifying...",
      success: "🎉 Activated! Upgraded to",
      error: "Activation failed. Check your license key.",
      networkError: "Network error, please try again later",
      freeStart: "Start free",
    },
  },
  zh: {
    nav: {
      features: "功能",
      pricing: "定价",
      docs: "文档",
      login: "登录",
      signup: "免费开始",
      dashboard: "仪表盘",
      logout: "退出",
      back: "返回",
      status: "计划",
    },
    hero: {
      badge: "无需后端 · 三行代码接入表单",
      title1: "给开发者的",
      title2: "表单后端",
      subtitle:
        "Formaroo 是简单的表单提交 API。把 HTML 表单的 action 指向 Formaroo,提交自动存储、安全防护、转发——不用写一行后端代码。",
      ctaStart: "免费创建账号",
      ctaDocs: "查看文档",
      freeNote: "免费计划每月 100 次提交 · 无需信用卡",
    },
    code: {
      htmlLabel: "index.html",
    },
    features: {
      title: "为什么选 Formaroo",
      f1: {
        t: "零后端接入",
        d: "HTML action 或一行 fetch。不需要服务器、不需要处理跨域、不需要维护数据库。",
      },
      f2: {
        t: "内置反垃圾",
        d: "蜜罐字段 + IP 频率限制,垃圾提交自动拦截,不脏你的数据。",
      },
      f3: {
        t: "Webhook 转发",
        d: "每次提交实时 POST 到你的服务器,和 Slack、CRM 或任何系统集成。",
      },
      f4: {
        t: "提交后重定向",
        d: "表单提交后自动跳转到感谢页,用户体验无缝衔接。",
      },
      f5: {
        t: "提交管理仪表盘",
        d: "在线查看所有提交,无需数据库客户端,数据一目了然。",
      },
      f6: {
        t: "免费开始",
        d: "每月 100 次提交完全免费。流量大了再升级,按需付费。",
      },
    },
    pricingSection: {
      title: "简单透明的定价",
      subtitle: "免费开始,按提交量付费",
      free: {
        name: "Free",
        price: "$0",
        desc: "验证想法、个人项目",
        features: ["100 次提交/月", "1 个表单", "Webhook 转发", "提交管理面板"],
        cta: "免费开始",
      },
      pro: {
        name: "Pro",
        price: "$9",
        desc: "正式网站、生产环境",
        features: ["10,000 次提交/月", "无限表单", "Webhook + 重定向", "优先支持"],
        cta: "升级 Pro",
      },
      scale: {
        name: "Scale",
        price: "$29",
        desc: "高流量、团队使用",
        features: ["100,000 次提交/月", "无限表单", "全部 Pro 功能", "专属支持"],
        cta: "升级 Scale",
      },
      perMonth: "/月",
    },
    cta: {
      title: "30 秒搞定你的表单后端",
      button: "免费创建账号",
    },
    footer: {
      rights: "© 2026 Formaroo. 保留所有权利。",
      privacy: "隐私",
      terms: "条款",
      status: "状态",
      builtBy: "Built by Yearn05",
    },
    auth: {
      welcomeBack: "欢迎回来",
      createAccount: "创建账号",
      subtitle: "Formaroo · 表单后端,三行代码接入",
      email: "邮箱",
      password: "密码",
      login: "登录",
      signup: "注册",
      processing: "处理中...",
      noAccount: "没有账号?",
      haveAccount: "已有账号?",
      freeSignup: "免费注册",
      goLogin: "去登录",
      successSignup: "注册成功!请查收邮件点击确认链接后登录。",
      passHint: "至少 6 位",
      otpTitle: "邮箱验证码登录",
      otpSubtitle: "我们会向您的邮箱发送 6 位验证码,无需密码。",
      otpSend: "发送验证码",
      otpVerify: "验证并登录",
      otpSent: "验证码已发送!请查收邮件。",
      otpSwitch: "改用邮箱验证码登录",
      passwordSwitch: "改用密码登录",
      otpPlaceholder: "6 位验证码",
    },
    dashboard: {
      loading: "加载中...",
      planLabel: "计划",
      usageTitle: "本月提交用量",
      remaining: "剩余",
      upgrade: "升级计划 →",
      myForms: "我的表单",
      newForm: "新建表单",
      formName: "表单名称,如:Newsletter 订阅",
      creating: "创建中...",
      create: "创建",
      noFormsTitle: "还没有表单",
      noFormsDesc: "创建一个表单,马上获得专属提交端点",
      createFirst: "创建第一个表单",
      submissions: "条提交",
      disabled: "已停用",
      logout: "退出",
    },
    formDetail: {
      loading: "加载中...",
      enable: "启用",
      disable: "停用",
      delete: "删除",
      confirmDelete: "确定删除这个表单?所有提交记录将一并删除。",
      integrate: "接入你的表单",
      copyEndpoint: "复制端点",
      copied: "✓ 已复制",
      endpoint: "端点地址",
      htmlLabel: "HTML 表单(最简单)",
      jsLabel: "JavaScript (fetch)",
      settings: "设置",
      edit: "编辑",
      formName: "表单名称",
      redirectUrl: "提交后跳转 URL(可选)",
      webhookUrl: "Webhook URL(可选)",
      webhookHint: "每次提交后收到 JSON POST 通知",
      save: "保存",
      saving: "保存中...",
      cancel: "取消",
      notSet: "未设置",
      honeypot: "蜜罐字段",
      submissionsTitle: "提交记录",
      recent: "最近 100 条",
      noSubmissions: "还没有提交。把上面的代码加到你的网站,收到第一条提交后就会显示在这里。",
    },
    pricing: {
      title: "定价",
      subtitle: "免费开始,流量大了再升级",
      perMonth: "/月",
      mostPopular: "最受欢迎",
      buyNow: "升级",
      goPay: "跳转支付...",
      activateTitle: "已有 License Key?",
      activateDesc: "在 Gumroad 付款后,我们会把 license key 发到你的邮箱。粘贴到这里即可激活对应计划。",
      placeholder: "粘贴 Gumroad license key",
      activate: "激活",
      verifying: "验证中...",
      success: "🎉 激活成功!已升级到",
      error: "激活失败,请检查 license key",
      networkError: "网络错误,请稍后再试",
      freeStart: "免费开始",
    },
  },
};

export function getDictionary(locale: string): Dictionary {
  return dictionaries[(locale as Locale) in dictionaries ? (locale as Locale) : defaultLocale];
}
