'use client'

import { useState } from 'react'
import { CheckCircle, Star } from 'lucide-react'
import { markConsumed } from '@/app/cave/bottles/actions'

export default function MarkConsumedButton({
    bottleId,
    disabled,
}: {
    bottleId: string
    disabled?: boolean
}) {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState<number | ''>('')
    const [notes, setNotes] = useState('')

    const stars = [1, 2, 3, 4, 5]

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                disabled={disabled}
                className="cursor-pointer text-green-500 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Marquer comme bue"
            >
                <CheckCircle className="h-4 w-4" />
            </button>

            {open && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
                    <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
                        <h3 className="text-lg font-medium">Noter la bouteille</h3>

                        <form
                            action={async (fd) => {
                                await markConsumed(fd)
                                setOpen(false)
                            }}
                            className="mt-4 space-y-4"
                        >
                            <input type="hidden" name="id" value={bottleId} />
                            <input type="hidden" name="rating" value={rating === '' ? '' : rating} />

                            {/* Étoiles interactives */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Note (0–5)</label>
                                <div className="flex items-center gap-1">
                                    {stars.map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(rating === star ? 0 : star)}
                                            className="transition-transform hover:scale-125 focus:outline-none"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${star <= (rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm text-gray-500">
                                        {rating ? `${rating} / 5` : 'Pas de note'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Mon avis</label>
                                <textarea
                                    name="notes"
                                    rows={2}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                                    placeholder="Notes personnelles…"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="rounded-md border px-3 py-2 text-sm"
                                >
                                    Annuler
                                </button>
                                <button className="rounded-md bg-black px-3 py-2 text-sm text-white">
                                    Valider
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
