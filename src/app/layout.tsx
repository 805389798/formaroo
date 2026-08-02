import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // 英文主标题(目标用户是欧美开发者,Google 搜索 SEO)
  title: "Formaroo — Form Backend API for Developers | No Backend Code",
  description:
    "Formaroo is a simple form submission API. Point your HTML form action at Formaroo — submissions are stored, spam-filtered, and forwarded automatically. No backend code, 3 lines to integrate, free tier included.",
  keywords: [
    "form backend",
    "form api",
    "formspree alternative",
    "form backend service",
    "html form submission api",
    "form endpoint",
    "表单后端",
    "表单API",
  ],
  openGraph: {
    title: "Formaroo — Form Backend API for Developers",
    description:
      "3-line form backend. Automatic storage, spam protection, webhooks, redirects. Free tier, no credit card.",
    type: "website",
    siteName: "Formaroo",
    url: "https://formaroo.yearn05.top",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
