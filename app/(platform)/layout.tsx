import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Yana.Diia.AI - Platform",
    description: "AI для Цифрових Архітекторів України",
};

export default function PlatformLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="antialiased">{children}</div>;
}
