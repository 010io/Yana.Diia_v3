import type { Metadata } from "next";
import "../globals.css";
import { GlobalNav } from "@/components/global-nav";

export const metadata: Metadata = {
    title: "Yana.Diia.AI - Platform",
    description: "AI для Цифрових Архітекторів України",
};

export default function PlatformLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-black text-white">
            <GlobalNav />
            {/* Responsive padding based on nav position */}
            <main className="pt-16 pb-20 md:pb-0 md:pt-16">
                {children}
            </main>
        </div>
    );
}