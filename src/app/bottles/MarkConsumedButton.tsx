'use client'

import { useState } from 'react'
import { markConsumed } from './actions'
import { CheckCircle } from 'lucide-react'

export default function MarkConsumedButton({
    bottleId,
    disabled,
}: {
    bottleId: string
    disabled?: boolean
}) {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState<number | ''>('')

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

                            <div>
                                <label className="block text-sm font-medium">Note (0–5)</label>
                                <input
                                    name="rating"
                                    type="number"
                                    min={0}
                                    max={5}
                                    step={1}
                                    value={rating}
                                    onChange={(e) =>
                                        setRating(e.target.value === '' ? '' : Number(e.target.value))
                                    }
                                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                                    placeholder="Laisser vide si pas de note"
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
