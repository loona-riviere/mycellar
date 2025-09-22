import Link from 'next/link'
import LoadingLink from '@/app/components/ui/LoadingLink'
import { createClient } from '@/utils/supabase/server'
import { Pencil, Star } from 'lucide-react'
import { labelColors } from '@/app/lib/definitions';
import BottleList from '@/app/components/BottleList';

export default async function FinishedBottlesPage() {
    const supabase = await createClient()

    const { data: bottles, error } = await supabase
        .from('bottles')
        .select(
            'id, name, estate, year, max_year, price, color, producer, region, grapes, created_at, comm, consumed, rating, updated_at'
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
                <LoadingLink
                    href="/bottles"
                    className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                    loadingText="Retour…"
                    aria-label="Retour à la cave"
                >
                    ←
                    <span className="ml-2 hidden sm:inline">Retour à la cave</span>
                </LoadingLink>
            </div>

            {(!bottles || bottles.length === 0) ? (
                <p className="text-gray-500">Aucune bouteille bue pour l’instant.</p>
            ) : (
                <BottleList bottles={bottles} variant="finished" />
            )}
        </main>
    )
}
