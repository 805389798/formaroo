import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Formaroo — 给开发者的表单后端 API",
  description:
    "Formaroo 是简单的表单提交 API。把 HTML 表单 action 指向 Formaroo,提交自动存储、通知、转发,不用写一行后端代码。免费开始,三行代码接入。",
  keywords: ["form backend", "form api", "formspree alternative", "表单后端", "表单API", "form submission"],
  openGraph: {
    title: "Formaroo — 给开发者的表单后端 API",
    description: "三行代码接入表单后端。自动存储、反垃圾、Webhook 转发。",
    type: "website",
    siteName: "Formaroo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
