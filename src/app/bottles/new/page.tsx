'use client'

import Link from 'next/link'
import { createBottle } from './actions'
import { useActionState } from 'react'

const initialState = { error: null as string | null }

export default function NewBottlePage() {
    const [state, formAction] = useActionState(createBottle, initialState)

    return (
        <main className="max-w-2xl mx-auto p-6">
            <div className="mb-4 flex items-center gap-3">
                <h1 className="text-2xl font-semibold">Ajouter une bouteille</h1>
                <Link href="/bottles" className="text-sm underline text-gray-600">Retour</Link>
            </div>

            <form
                action={formAction}
                className="grid grid-cols-1 gap-4 bg-white p-5 rounded-lg border shadow-sm"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Domaine / Château</label>
                        <input name="estate" className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                               placeholder="Château La Tour Carnet"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Cuvée / Nom du vin *</label>
                        <input name="name" required className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                               placeholder="Grand Cru Classé, Vieilles Vignes…" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Millésime *</label>
                        <input
                            required
                            type="number"
                            name="year"
                            step={1}
                            min={1900}
                            max={2100}
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
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">À boire avant (année)</label>
                    <input
                        type="number"
                        name="max_year"
                        step={1}
                        min={1900}
                        max={2100}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="2028"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Couleur *</label>
                        <select
                            name="color"
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
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                            placeholder="Bourgogne, Bordeaux…"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Cépages</label>
                        <input
                            name="grapes"
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                            placeholder="Pinot noir, Chardonnay…"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="consumed"
                        name="consumed"
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
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Commentaires</label>
                    <textarea
                        name="comm"
                        rows={3}
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Notes personnelles…"
                    />
                </div>

                {state.error && <p className="text-sm text-red-600">{state.error}</p>}

                <div className="flex items-center gap-3">
                    <button className="rounded-md bg-black px-4 py-2 text-white">Enregistrer</button>
                    <Link href="/bottles" className="rounded-md border px-4 py-2">
                        Annuler
                    </Link>
                </div>
            </form>
        </main>
    )
}
