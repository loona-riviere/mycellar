import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { MessageCircle, Pencil, Plus } from 'lucide-react'
import MarkConsumedButton from '@/app/components/MarkConsumedButton'
import { Bottle, labelColors } from '@/app/lib/definitions'
import SortSelect from '@/app/components/SortSelect';
import StockSummary from '../components/StockSummary'

function pluralize(count: number, singular: string, plural?: string) {
    if (!count) return `0 ${plural ?? singular + 's'}`
    if (count === 1) return `1 ${singular}`
    return `${count} ${plural ?? singular + 's'}`
}

function getColorExpirationDate(b: Bottle): string {
    if (!b.max_year) return ''
    const currentYear = new Date().getFullYear()
    const yearsLeft = b.max_year - currentYear
    if (yearsLeft > 3) return 'bg-green-100 text-green-800'
    if (yearsLeft >= 1) return 'bg-orange-100 text-orange-800'
    if (yearsLeft >= 0) return 'bg-red-100 text-red-700'
    return 'bg-gray-200 text-gray-500 line-through'
}

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
                    <Link
                        href="/bottles/new"
                        prefetch
                        className="inline-flex items-center rounded-md bg-black text-white
                 p-2 sm:px-4 sm:py-2 hover:bg-gray-800 transition
                 focus:outline-none focus:ring-2 focus:ring-black/50"
                        aria-label="Nouvelle bouteille"
                        title="Nouvelle bouteille">
                        <Plus className="h-5 w-5" aria-hidden="true" />

                        <span className="ml-2 hidden sm:inline">Nouvelle bouteille</span>
                    </Link>
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

            <ul className="mt-4 space-y-4">
                {bottles?.map((b) => (
                    <li
                        key={b.id}
                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-medium">
                                    {b.estate ? `${b.estate} — ${b.name}` : b.name}
                                    {b.year && <span className="text-gray-500"> ({b.year})</span>}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {b.producer && <span>{b.producer} · </span>}
                                    {b.region && <span>{b.region} · </span>}
                                    {b.color && <span>{labelColors[b.color]} · </span>}
                                    {b.grapes && <span>{b.grapes}</span>}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                                    {b.price != null ? `${Number(b.price).toFixed(2)} €` : '—'}
                                </span>
                                <MarkConsumedButton bottleId={b.id} />
                                <Link
                                    href={`/bottles/${b.id}/edit`}
                                    className="text-gray-500 hover:text-black"
                                    title="Modifier"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {b.comm && (
                            <div className="mt-1 flex items-center gap-2">
                                <MessageCircle className="h-3 w-3" />
                                <p className="text-sm text-gray-600 italic">Commentaires : {b.comm}</p>
                            </div>
                        )}

                        <p className="mt-1 text-xs text-gray-400">
                            Ajouté le {new Date(b.created_at).toLocaleDateString('fr-FR')}
                        </p>

                        {b.max_year && (
                            <p className="mt-1 text-xs text-gray-500">
                                <span
                                    className={`inline-flex items-center rounded px-2 py-0.5 ${getColorExpirationDate(b)}`}
                                    title="Année conseillée pour boire"
                                >
                                    À boire avant {b.max_year}
                                </span>
                            </p>
                        )}
                    </li>
                ))}
            </ul>

            <Link
                href="/bottles/finished"
                className="text-sm underline text-gray-600 flex justify-center mt-8"
            >
                Voir les terminées
            </Link>
        </main>
    )
}
