import type { Metadata } from "next";
import "../globals.css";
import { UnifiedNav } from "@/components/unified-nav";

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
            <UnifiedNav />
            {/* Responsive padding based on nav position */}
            <main className="pt-16 pb-20 md:pb-0 md:pt-16">
                {children}
            </main>
        </div>
    );
}