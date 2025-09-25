// src/app/cave/layout.tsx
import CaveHeader from "@/app/components/CaveHeader"
import CaveMenu from "@/app/components/CaveMenu"
import { createClient } from "@/utils/supabase/server"

export default async function CaveLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const supabase = await createClient()

    // Récupérer l'utilisateur
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return (
            <main className="p-6 text-red-600">
                Utilisateur non connecté
            </main>
        )
    }

    // Récupérer la cave de l'utilisateur
    const { data: caveLink } = await supabase
        .from("cave_users")
        .select("cave_id")
        .eq("user_id", user.id)
        .limit(1)
        .single()

    if (!caveLink) {
        return (
            <main className="p-6 text-red-600">
                Cave introuvable
            </main>
        )
    }

    // Récupérer les infos de la cave
    const { data: caveData } = await supabase
        .from("caves")
        .select("*")
        .eq("id", caveLink.cave_id)
        .single()

    if (!caveData) {
        return (
            <main className="p-6 text-red-600">
                Erreur lors de la récupération de la cave
            </main>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header avec le nom de la cave */}
                <CaveHeader caveName={caveData.name} />
            {/* Contenu des pages */}
            {children}
        </div>
    )
}
