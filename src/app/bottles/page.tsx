import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { MessageCircle, Pencil } from 'lucide-react'
import MarkConsumedButton from './MarkConsumedButton'
import { Bottle, labelColors } from '@/app/lib/definitions';

function pluralize(count: number, singular: string, plural?: string) {
    if (count <= 1) return `${count} ${singular}`
    return `${count} ${plural ?? singular + 's'}`
}

function getColorExpirationDate(b: Bottle): string {
    if (!b.max_year) return ''

    const currentYear = new Date().getFullYear()
    const yearsLeft = b.max_year - currentYear

    if (yearsLeft > 3) {
        return 'bg-green-100 text-green-800'
    } else if (yearsLeft >= 1) {
        return 'bg-orange-100 text-orange-800'
    } else if (yearsLeft >= 0) {
        return 'bg-red-100 text-red-700'
    } else {
        return 'bg-gray-200 text-gray-500 line-through'
    }
}


export default async function BottlesPage() {
    const supabase = await createClient()

    const { data: bottles, error } = await supabase
        .from('bottles')
        .select('id, name, estate, year, max_year, price, color, producer, region, grapes, created_at, comm, consumed, rating')
        .eq('consumed', false)
        .order('year', { ascending: false })

    if (error) {
        return <main className="p-6">Erreur : {error.message}</main>
    }

    const counts = bottles?.reduce(
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
                <Link
                    href="/bottles/new"
                    className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 transition"
                >
                    + Nouvelle bouteille
                </Link>
            </div>

            {(!bottles || bottles.length === 0) && (
                <p className="text-gray-500">Aucune bouteille pour l’instant.</p>
            )}

            {(!bottles || bottles.length > 0) && (
                <div className="mt-2 text-sm text-gray-600">
                    En stock :
                    {counts.red > 0 && (
                        <span className="ml-2">
                            🍷 {pluralize(counts.red, "rouge", "rouges")}
                        </span>
                    )}
                    {counts.white > 0 && (
                        <span className="ml-2">
                            🥂 {pluralize(counts.white, "blanc", "blancs")}
                        </span>
                    )}
                    {counts.rose > 0 && (
                        <span className="ml-2">
                            🌸 {pluralize(counts.rose, "rosé", "rosés")}
                        </span>
                    )}
                    {counts.sparkling > 0 && (
                        <span className="ml-2">
                            🍾 {pluralize(counts.sparkling, "pétillant", "pétillants")}
                        </span>
                    )}
                </div>
            )}

            <ul className="space-y-4">
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
                                <MarkConsumedButton bottleId={b.id}/>

                                <Link
                                    href={`/bottles/${b.id}/edit`}
                                    className="text-gray-500 hover:text-black"
                                    title="Modifier"
                                >
                                    <Pencil className="h-4 w-4"/>
                                </Link>
                            </div>
                        </div>
                        {b.comm &&
                            <div className="flex items-center gap-2">
                            <MessageCircle className="h-3 w-3"/>
                                <p className="text-sm text-gray-600 italic">Commentaires : {b.comm}</p>
                            </div>
                        }

                        <p className="mt-1 text-xs text-gray-400">
                            Ajouté le {new Date(b.created_at).toLocaleDateString('fr-FR')}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            {b.max_year && (
                                <span
                                    className={`inline-flex items-center rounded px-2 py-0.5 ${
                                        (getColorExpirationDate(b))
                                    }`}
                                    title="Année conseillée pour boire"
                                >
                                    À boire avant {b.max_year}
                                </span>
                            )}
                        </p>
                    </li>
                ))}
            </ul>

            <Link href="/bottles/finished" className="text-sm underline text-gray-600 flex justify-center mt-8">
                Voir les terminées
            </Link>

        </main>
    )
}
