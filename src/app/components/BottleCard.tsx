'use client'

import Link from 'next/link'
import { Pencil, MessageCircle, Star } from 'lucide-react'
import MarkConsumedButton from '@/app/components/MarkConsumedButton'
import type { Bottle } from '@/app/lib/definitions'
import { formatPrice, getColorChip, getColorExpirationBadge, getColorReadyBadge } from '@/app/lib/bottle-ui'
import { useState } from 'react'
import Image from 'next/image'

type Props = {
    bottle: Bottle
    variant: 'active' | 'finished'
}

export default function BottleCard({ bottle: b, variant }: Props) {
    const colorChip = getColorChip(b.color)
    const expirationBadge = getColorExpirationBadge(b)
    const readyBadge = getColorReadyBadge(b)
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Image si présente */}
                {b.image_url && (
                    <div className="sm:w-32 sm:h-32 w-full h-40 flex-shrink-0 mb-3 sm:mb-0">
                        <Image
                            priority
                            src={b.image_url}
                            alt={b.name}
                            className="w-full h-full object-contain rounded-md bg-gray-50 cursor-pointer"
                            width={200}
                            height={200}
                            onClick={() => setIsModalOpen(true)}
                        />
                    </div>
                )}

                {/* Contenu texte */}
                <div className="flex-1 flex flex-col gap-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-medium">
                            {b.estate ? `${b.estate} — ${b.name}` : b.name}
                            {b.year && <span className="text-gray-500"> ({b.year})</span>}
                        </h2>

                        <span className="hidden sm:inline text-sm text-gray-700 font-medium whitespace-nowrap tabular-nums">
                            {formatPrice(b.price)}
                        </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        {b.producer && <span>{b.producer} · </span>}
                        {b.region && <span>{b.region}</span>}
                    </div>

                    {b.grapes && (
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs text-gray-400 italic">{b.grapes}</p>
                        </div>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        {colorChip && (
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${colorChip.className}`}>
                                {colorChip.label}
                            </span>
                        )}
                        {variant === 'active' && readyBadge && (
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${readyBadge.className}`}>
                                {readyBadge.text}
                            </span>
                        )}
                        {variant === 'active' && expirationBadge && (
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${expirationBadge.className}`}>
                                {expirationBadge.text}
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
                                : <>Bue le {new Date((b as Bottle).updated_at ?? b.created_at).toLocaleDateString('fr-FR')}</>}
                        </p>

                        <div className="flex items-center gap-2">
                            {/* Prix en mobile */}
                            <span className="sm:hidden text-sm text-gray-700 font-medium whitespace-nowrap tabular-nums mr-1">
                                {formatPrice(b.price)}
                            </span>

                            {variant === 'active' ? (
                                <MarkConsumedButton bottleId={b.id} />
                            ) : (
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
                </div>
            </div>
            {/* Modal */}
            {isModalOpen && b.image_url && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="relative max-w-full max-h-full" onClick={e => e.stopPropagation()}>
                        <button
                            className="absolute top-2 right-2 text-white p-1 rounded-full bg-black/50 hover:bg-black/70"
                            onClick={() => setIsModalOpen(false)}
                        >
                        </button>
                        <Image
                            priority
                            src={b.image_url}
                            alt={b.name}
                            className="max-w-full max-h-[90vh] object-contain rounded-md bg-gray-50"
                            width={400}
                            height={400}
                        />
                    </div>
                </div>
            )}
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
