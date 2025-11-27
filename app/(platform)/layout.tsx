import type { Metadata } from "next";
import "../globals.css";
import { SmartNav } from "@/components/smart-nav";

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
            <SmartNav />
            <main className="pt-16 pb-20 md:pb-0">
                {children}
            </main>
        </div>
    );
}