import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import EditBottleClient from './EditBottleClient'

// Server Component to fetch data server-side and pass as props to the client component
export default async function EditBottlePage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: bottle, error } = await supabase
        .from('bottles')
        .select('id, name, estate, year, max_year, price, color, producer, region, grapes, comm, consumed, rating')
        .eq('id', params.id)
        .single()

    if (error || !bottle) {
        return (
            <main className="max-w-2xl mx-auto p-6">
                <p className="text-red-600">Bouteille introuvable.</p>
                <Link href="/bottles" className="underline text-sm">← Retour</Link>
            </main>
        )
    }

    // Pass data to client component
    return <EditBottleClient id={params.id} bottle={bottle} />
}
