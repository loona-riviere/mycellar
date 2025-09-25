// app/bottles/page.tsx (Server Component)
import { createClient } from "@/utils/supabase/server"
import ClientBottlesPage from "./ClientBottlesPage"
import { Bottle } from '@/app/lib/definitions';

export default async function BottlesPage() {
    const supabase = await createClient()
    const { data: bottles = [], error } = await supabase
        .from("bottles")
        .select("*")
        .eq("consumed", false)

    if (error) {
        return <main className="p-6 text-red-600">Erreur : {error.message}</main>
    }

    return <ClientBottlesPage initialBottles={bottles as Bottle[]} />
}
