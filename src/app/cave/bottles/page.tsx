import { createClient } from "@/utils/supabase/server"
import ClientBottlesPage from "../../components/ClientBottlesPage"
import { Bottle } from '@/app/lib/definitions'

export default async function BottlesPage() {
    const supabase = await createClient()

    // 1️⃣ Récupérer l'utilisateur connecté
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        return <main className="p-6 text-red-600">Utilisateur non connecté</main>
    }

    // 2️⃣ Récupérer la cave liée à cet utilisateur
    const { data: caveLink, error: caveLinkError } = await supabase
        .from("cave_users")
        .select("cave_id")
        .eq("user_id", user.id)
        .limit(1)
        .single()

    if (caveLinkError || !caveLink) {
        return <main className="p-6 text-red-600">Cave introuvable pour cet utilisateur</main>
    }

    const caveId = caveLink.cave_id

    // 3️⃣ Récupérer le nom de la cave
    const { data: caveData } = await supabase
        .from("caves")
        .select("name")
        .eq("id", caveId)
        .single()


    // 4️⃣ Récupérer les bouteilles de cette cave (liste vide si aucune)
    const { data: bottles = [], error: bottlesError } = await supabase
        .from("bottles")
        .select("*")
        .eq("cave_id", caveId)
        .eq("consumed", false)

    if (bottlesError) {
        return <main className="p-6 text-red-600">Erreur : {bottlesError.message}</main>
    }

    return (
        <ClientBottlesPage
            initialBottles={bottles as Bottle[]}
            caveName={caveData?.name}
        />
    )
}
