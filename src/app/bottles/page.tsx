import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { BadgeCheck, Pencil } from 'lucide-react'
import MarkConsumedButton from './MarkConsumedButton'

export default async function BottlesPage() {
    const supabase = await createClient()

    const { data: bottles, error } = await supabase
        .from('bottles')
        .select('id, name, year, price, color, producer, region, grapes, created_at, comm, consumed, rating')
        .eq('consumed', false)
        .order('created_at', { ascending: false })

    if (error) {
        return <main className="p-6">Erreur : {error.message}</main>
    }

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

            <ul className="space-y-4">
                {bottles?.map((b) => (
                    <li
                        key={b.id}
                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-medium">
                                    {b.name} {b.year && <span className="text-gray-500">({b.year})</span>}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {b.producer && <span>{b.producer} · </span>}
                                    {b.region && <span>{b.region} · </span>}
                                    {b.color && <span>{b.color} · </span>}
                                    {b.grapes && <span>{b.grapes} · </span>}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700 font-medium">
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
                        <p className="text-sm text-gray-600 italic">{b.comm && <span> Commentaires : {b.comm}</span>}</p>

                        <p className="mt-1 text-xs text-gray-400">
                            Ajouté le {new Date(b.created_at).toLocaleDateString('fr-FR')}
                        </p>
                    </li>
                ))}
            </ul>

            <Link href="/bottles/finished" className="text-sm underline text-gray-600 flex justify-center">
                Voir les terminées
            </Link>

        </main>
    )
}
