import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Yana.Diia - Lego Constructor",
    description: "AI-Powered Service Builder",
};

export default function BuilderLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <main className="h-screen w-full">
                {children}
            </main>
        </div>
    );
}
