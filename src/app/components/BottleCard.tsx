'use client'

import Link from 'next/link'
import { Pencil, MessageCircle, Star } from 'lucide-react'
import MarkConsumedButton from '@/app/components/MarkConsumedButton'
import type { Bottle } from '@/app/lib/definitions'
import { formatPrice, getColorChip, getColorExpirationBadge } from '@/app/lib/bottle-ui'

type Props = {
    bottle: Bottle
    variant: 'active' | 'finished'
}

export default function BottleCard({ bottle: b, variant }: Props) {
    const colorChip = getColorChip(b.color)
    const drinkBadge = getColorExpirationBadge(b)

    return (
        <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-medium">
                    {b.estate ? `${b.estate} — ${b.name}` : b.name}
                    {b.year && <span className="text-gray-500"> ({b.year})</span>}
                </h2>

                <span className="hidden sm:inline text-sm text-gray-700 font-medium whitespace-nowrap tabular-nums">
                    {formatPrice(b.price)}
                </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <p>
                    {b.producer && <span>{b.producer} · </span>}
                    {b.region && <span>{b.region} · </span>}
                    {b.grapes && <span>{b.grapes}</span>}
                </p>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                {colorChip && (
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${colorChip.className}`}>
                        {colorChip.label}
                    </span>
                )}

                {variant === 'active' && drinkBadge && (
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${drinkBadge.className}`}>
                        {drinkBadge.text}
                    </span>
                )}
            </div>

            {b.comm && (
                <div className="mt-2 flex items-center gap-2">
                    <MessageCircle className="h-3 w-3" />
                    <p className="text-sm text-gray-600 italic line-clamp-2">Commentaires : {b.comm}</p>
                </div>
            )}

            <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                    {variant === 'active'
                        ? <>Ajouté le {new Date(b.created_at).toLocaleDateString('fr-FR')}</>
                        : <>Bue le {new Date((b as any).updated_at ?? b.created_at).toLocaleDateString('fr-FR')}</>}
                </p>

                <div className="flex items-center gap-2">
                    {/* Prix en mobile */}
                    <span className="sm:hidden text-sm text-gray-700 font-medium whitespace-nowrap tabular-nums mr-1">
                        {formatPrice(b.price)}
                    </span>

                    {variant === 'active' ? (
                        <MarkConsumedButton bottleId={b.id} />
                    ) : (
                        // étoiles si finished
                        <Stars rating={b.rating} />
                    )}

                    <Link
                        href={`/bottles/${b.id}/edit`}
                        className="text-gray-500 hover:text-black rounded p-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        title="Modifier"
                        aria-label={`Modifier ${b.name}`}
                    >
                        <Pencil className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </li>
    )
}

function Stars({ rating }: { rating: number | null }) {
    if (!rating || rating <= 0) return null
    return (
        <div className="flex items-center gap-1" title={`${rating}/5`}>
            {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} className={`h-4 w-4 ${n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
        </div>
    )
}
