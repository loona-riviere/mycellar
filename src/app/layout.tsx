// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { logout } from "@/app/logout/actions";
import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "My wine cellar",
    description: "By Loona & Julien",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return (
        <html lang="fr">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {session && (
            <header className="flex items-center justify-between border-b px-6 py-3 bg-white shadow-sm">
                <h1 className="text-lg font-semibold">🍷 My Wine Cellar</h1>
                <form action={logout}>
                    <button
                        type="submit"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
                        title="Se déconnecter"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </button>
                </form>
            </header>
        )}
        <main>{children}</main>
        </body>
        </html>
    );
}
