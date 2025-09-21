import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Pencil, Star } from 'lucide-react'

export default async function FinishedBottlesPage() {
    const supabase = await createClient()

    const { data: bottles, error } = await supabase
        .from('bottles')
        .select(
            'id, name, year, price, color, producer, region, grapes, created_at, comm, consumed, rating, updated_at'
        )
        .eq('consumed', true)
        .order('updated_at', { ascending: false })

    if (error) {
        return <main className="p-6">Erreur : {error.message}</main>
    }

    const renderStars = (rating: number | null) => {
        if (rating === null || rating === 0) return null
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                    />
                ))}
                <span className="text-xs text-gray-500 ml-1">({rating}/5)</span>
            </div>
        )
    }

    return (
        <main className="max-w-3xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">🍷 Bouteilles bues</h1>
                <Link
                    href="/bottles"
                    className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                >
                    ← Retour à la cave
                </Link>
            </div>

            {(!bottles || bottles.length === 0) && (
                <p className="text-gray-500">Aucune bouteille bue pour l`instant.</p>
            )}

            <ul className="space-y-4">
                {bottles?.map((b) => (
                    <li
                        key={b.id}
                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h2 className="text-lg font-medium">
                                    {b.name} {b.year && <span className="text-gray-500">({b.year})</span>}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {b.producer && <span>{b.producer} · </span>}
                                    {b.region && <span>{b.region} · </span>}
                                    {b.color && <span>{b.color} ·  </span>}
                                    {b.grapes && <span>{b.grapes} </span>}
                                </p>
                                {renderStars(b.rating)}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700 font-medium">
                                    {b.price != null ? `${Number(b.price).toFixed(2)} €` : '—'}
                                </span>
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
                            Bue le {new Date(b.updated_at).toLocaleDateString('fr-FR')}
                        </p>
                    </li>
                ))}
            </ul>
        </main>
    )
}
