import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
    title: "Ma cave",
    description: "By Loona & Julien",
    manifest: "/manifest.json",
    icons: {
        icon: [
            { url: "/wine.svg", type: "image/svg+xml" },
            { url: "/favicon.ico" }
        ],
        apple: "/apple-touch-icon.png",
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Ma cave",
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
                <main className="flex-1">{children}</main>

                <footer className="border-t px-6 py-4 text-center text-sm text-gray-500 bg-gray-50">
                    Fait avec ❤️ par Loona
                </footer>
            </body>
        </html>
    );
}
