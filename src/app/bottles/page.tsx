import Link from 'next/link'
import LoadingLink from '@/app/components/ui/LoadingLink'
import { createClient } from '@/utils/supabase/server'
import { Plus } from 'lucide-react'
import SortSelect from '@/app/components/SortSelect'
import StockSummary from '../components/StockSummary'
import BottleList from '../components/BottleList'
import NotificationsPanel from '../components/NotificationsPanel'

type SortKey =
    | 'year_desc' | 'year_asc'
    | 'price_desc' | 'price_asc'
    | 'name_asc' | 'name_desc'
    | 'ready_asc'
    | 'created_desc'

type Order = { column: string; ascending: boolean; nullsFirst?: boolean }
type MultiOrder = { orders: Order[] }
type SortConfig = Order | MultiOrder

function buildOrder(sort: SortKey): SortConfig {
    switch (sort) {
        case 'year_asc': return { column: 'year', ascending: true }
        case 'year_desc': return { column: 'year', ascending: false }
        case 'price_asc': return { column: 'price', ascending: true }
        case 'price_desc': return { column: 'price', ascending: false }
        case 'name_asc': return { column: 'name', ascending: true }
        case 'name_desc': return { column: 'name', ascending: false }
        case 'ready_asc':
            return {
                orders: [
                    { column: 'min_year', ascending: true, nullsFirst: false },
                    { column: 'max_year', ascending: true, nullsFirst: false }
                ]
            }
        case 'created_desc': return { column: 'created_at', ascending: false }
        default: return { column: 'year', ascending: false }
    }
}

export default async function BottlesPage({
    searchParams,
}: Readonly<{
    searchParams?: { sort?: string }
}>) {
    const sort: SortKey = (searchParams?.sort as SortKey) ?? 'ready_asc'
    const order = buildOrder(sort)
    const supabase = await createClient()

    let query = supabase
        .from('bottles')
        .select('id, estate, cuvee, appellation, classification, year, max_year, min_year, price, color, producer, region, grapes, created_at, comm, consumed, rating, notes, updated_at, image_url')
        .eq('consumed', false)

    if ('orders' in order) {
        order.orders.forEach(({ column, ascending, nullsFirst }) => {
            query = query.order(column, { ascending, nullsFirst })
        })
    } else {
        query = query.order(order.column, { ascending: order.ascending, nullsFirst: order.nullsFirst })
    }

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
                <div className="flex items-center gap-3">
                    <SortSelect />
                    <LoadingLink
                        href="/bottles/new"
                        prefetch
                        className="inline-flex items-center rounded-md bg-black text-white p-2 sm:px-4 sm:py-2 hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-black/50"
                        aria-label="Nouvelle bouteille"
                        loadingText="Ouverture…">
                        <Plus className="h-5 w-5" aria-hidden="true" />
                        <span className="ml-2 hidden sm:inline">Nouvelle bouteille</span>
                    </LoadingLink>
                </div>
            </div>
            {!bottles || bottles.length === 0 ? (
                <p className="text-gray-500">Aucune bouteille pour l’instant.</p>
            ) : (
                <>
                    <div className="mt-2">
                        <NotificationsPanel bottles={bottles} />
                        <StockSummary counts={counts} total={bottles.length} />
                    </div>
                    <BottleList bottles={bottles} variant="active" />
                </>
            )}
            <Link
                href="/bottles/finished"
                className="text-sm underline text-gray-600 flex justify-center mt-8"
            >
                Voir les terminées
            </Link>
        </main>
    )
}
