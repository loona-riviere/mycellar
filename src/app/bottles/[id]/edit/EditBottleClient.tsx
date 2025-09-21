'use client'

import Link from 'next/link'
import { useActionState, useEffect, useState } from 'react'
import { updateBottle, deleteBottle } from './actions'
import { Bottle } from '@/app/lib/definitions';

export default function EditBottleClient({ id, bottle }: { id: string; bottle: Bottle }) {
    const update = updateBottle.bind(null, id)
    const [state, formAction] = useActionState(update, { error: null as string | null })
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        if (state?.error) {
            console.error(state.error)
        }
    }, [state])

    return (
        <main className="max-w-2xl mx-auto p-6">
            <div className="mb-4 flex items-center gap-3">
                <h1 className="text-2xl font-semibold">Modifier la bouteille</h1>
                <Link href="/bottles" className="text-sm underline text-gray-600">
                    ← Retour
                </Link>
            </div>

            <form
                action={formAction}
                className="grid grid-cols-1 gap-4 bg-white p-5 rounded-lg border shadow-sm"
            >
                {/* Nom */}
                <div>
                    <label className="block text-sm font-medium">Nom *</label>
                    <input
                        name="name"
                        defaultValue={bottle.name ?? ''}
                        required
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    />
                </div>

                {/* Année + Prix */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Année</label>
                        <input
                            type="number"
                            name="year"
                            step={1}
                            min={1900}
                            max={2100}
                            defaultValue={bottle.year ?? ''}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Prix (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="price"
                            defaultValue={bottle.price ?? ''}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {/* Couleur + Producteur */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Couleur</label>
                        <select
                            name="color"
                            defaultValue={bottle.color ?? ''}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="">—</option>
                            <option value="red">Rouge</option>
                            <option value="white">Blanc</option>
                            <option value="rose">Rosé</option>
                            <option value="sparkling">Pétillant</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Producteur</label>
                        <input
                            name="producer"
                            defaultValue={bottle.producer ?? ''}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                            placeholder="Domaine…"
                        />
                    </div>
                </div>

                {/* Région + Cépages */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Région</label>
                        <input
                            name="region"
                            defaultValue={bottle.region ?? ''}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                            placeholder="Bourgogne, Bordeaux…"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Cépages</label>
                        <input
                            name="grapes"
                            defaultValue={bottle.grapes ?? ''}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                            placeholder="Pinot noir, Chardonnay…"
                        />
                    </div>
                </div>

                {/* Checkbox Consumed */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="consumed"
                        name="consumed"
                        defaultChecked={bottle.consumed ?? false}
                        className="h-4 w-4"
                    />
                    <label htmlFor="consumed" className="text-sm font-medium">
                        Bouteille consommée
                    </label>
                </div>

                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium">Note (0–5)</label>
                    <input
                        type="number"
                        name="rating"
                        min={0}
                        max={5}
                        step={1}
                        defaultValue={bottle.rating ?? ''}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    />
                </div>

                {/* Commentaires */}
                <div>
                    <label className="block text-sm font-medium">Commentaires</label>
                    <textarea
                        name="comm"
                        rows={3}
                        defaultValue={bottle.comm ?? ''}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Notes personnelles…"
                    />
                </div>

                {/* Error */}
                {state.error && <p className="text-sm text-red-600">{state.error}</p>}

                {/* Buttons */}
                <div className="flex items-center gap-3">
                    <button className="rounded-md bg-black px-4 py-2 text-white">Enregistrer</button>
                    <Link href="/bottles" className="rounded-md border px-4 py-2">
                        Annuler
                    </Link>
                </div>
            </form>

            {/* Delete form - separate from edit form */}
            <form
                action={async () => {
                    try {
                        setDeleting(true)
                        await deleteBottle(id)
                    } finally {
                        setDeleting(false)
                    }
                }}
                className="mt-4 flex justify-end"
            >
                <button
                    type="submit"
                    className="rounded-md border border-red-300 px-4 py-2 text-red-700 hover:bg-red-50"
                    disabled={deleting}
                >
                    {deleting ? 'Suppression…' : 'Supprimer'}
                </button>
            </form>
        </main>
    )
}
