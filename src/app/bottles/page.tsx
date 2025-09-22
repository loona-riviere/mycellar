import Link from 'next/link'
import LoadingLink from '@/app/components/ui/LoadingLink'
import { createClient } from '@/utils/supabase/server'
import { MessageCircle, Pencil, Plus } from 'lucide-react'
import MarkConsumedButton from '@/app/components/MarkConsumedButton'
import { Bottle, labelColors } from '@/app/lib/definitions'
import SortSelect from '@/app/components/SortSelect';
import StockSummary from '../components/StockSummary'
import BottleList from '../components/BottleList'


// --- logique de tri ---
type SortKey =
    | 'year_desc' | 'year_asc'
    | 'price_desc' | 'price_asc'
    | 'name_asc' | 'name_desc'
    | 'maxyear_asc'
    | 'created_desc'

function buildOrder(sort: SortKey): { column: string; ascending: boolean; nullsFirst?: boolean } {
    switch (sort) {
        case 'year_asc': return { column: 'year', ascending: true }
        case 'year_desc': return { column: 'year', ascending: false }
        case 'price_asc': return { column: 'price', ascending: true }
        case 'price_desc': return { column: 'price', ascending: false }
        case 'name_asc': return { column: 'name', ascending: true }
        case 'name_desc': return { column: 'name', ascending: false }
        case 'maxyear_asc': return { column: 'max_year', ascending: true, nullsFirst: false }
        case 'created_desc': return { column: 'created_at', ascending: false }
        default: return { column: 'year', ascending: false }
    }
}

export default async function BottlesPage({
    searchParams,
}: Readonly<{
    searchParams?: { sort?: string }
}>) {
    const sort: SortKey = (searchParams?.sort as SortKey) ?? 'year_desc'
    const order = buildOrder(sort)

    const supabase = await createClient()
    let query = supabase
        .from('bottles')
        .select(
            'id, name, estate, year, max_year, price, color, producer, region, grapes, created_at, comm, consumed, rating'
        )
        .eq('consumed', false)

    query = query.order(order.column, {
        ascending: order.ascending,
        nullsFirst: order.nullsFirst,
    })

    const { data: bottles, error } = await query

    if (error) {
        return <main className="p-6">Erreur : {error.message}</main>
    }

    const counts = (bottles ?? []).reduce(
        (acc, b) => {
            if (!b.color) return acc
            acc[b.color] = (acc[b.color] || 0) + 1
            return acc
        },
        {} as Record<string, number>
    )

    return (
        <main className="max-w-3xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">🍷 Ma cave</h1>
                <div className="flex items-center gap-3">
                    <SortSelect />
                    <LoadingLink
                        href="/bottles/new"
                        prefetch
                        className="inline-flex items-center rounded-md bg-black text-white
                p-2 sm:px-4 sm:py-2 hover:bg-gray-800 transition
                focus:outline-none focus:ring-2 focus:ring-black/50"
                        aria-label="Nouvelle bouteille"
                        loadingText="Ouverture…">
                        <Plus className="h-5 w-5" aria-hidden="true" />

                        <span className="ml-2 hidden sm:inline">Nouvelle bouteille</span>
                    </LoadingLink>
                </div>
            </div>

            {(!bottles || bottles.length === 0) && (
                <p className="text-gray-500">Aucune bouteille pour l’instant.</p>
            )}

            {bottles && bottles.length > 0 && (
                <div className="mt-2">
                    <StockSummary counts={counts} total={bottles.length} />
                </div>
            )}

            <BottleList bottles={bottles ?? []} variant="active" />

            <Link
                href="/bottles/finished"
                className="text-sm underline text-gray-600 flex justify-center mt-8"
            >
                Voir les terminées
            </Link>
        </main>
    )
}
