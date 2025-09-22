import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",   // ← pour occuper tout l’écran sur iOS (Dynamic Island, etc.)
    themeColor: "#111111",
};

export const metadata: Metadata = {
    title: "My wine cellar",
    description: "By Loona & Julien",
    manifest: "/manifest.json",
    icons: {
        icon: "/wine.svg",
        apple: "/apple-touch-icon.png",
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "My wine cellar",
    },
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
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
            >
                {session && (
                    <header className="flex items-center justify-between border-b px-6 py-3 bg-white shadow-sm">
                        <h1 className="text-lg font-semibold"><a href="/bottles">🍷 Ma Cave</a></h1>
                        <form action={logout}>
                            <button
                                type="submit"
                                className="flex items-center cursor-pointer gap-1 text-sm text-gray-600 hover:text-black"
                                title="Se déconnecter"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </form>
                        <meta name="apple-mobile-web-app-capable" content="yes" />

                    </header>
                )}

                <main className="flex-1">{children}</main>

                <footer className="border-t px-6 py-4 text-center text-sm text-gray-500 bg-gray-50">
                    Fait avec ❤️ par Loona
                </footer>
            </body>
        </html>
    );
}
