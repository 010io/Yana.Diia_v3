import type { Metadata } from "next";
import "./globals.css";
import { DevPanel } from "@/components/dev-panel";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "Yana.Diia | AI-Асистент для Державних Послуг",
  description: "Provider-agnostic AI платформа для автоматизації дизайну цифрових послуг Дія",
  generator: "Be-Transparent Team",
  authors: [{ name: "Volodymyr Seferov" }, { name: "Igor Omelchenko" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-['Inter'] antialiased" suppressHydrationWarning>
        {children}
        <DevPanel />
        <DarkModeToggle />
        <MobileNav />
      </body>
    </html>
  );
}
