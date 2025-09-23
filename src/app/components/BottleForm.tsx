'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import type { BottleFormInput } from '../bottles/_schema'
import { ActionState } from '@/app/bottles/actions'
import LoadingButton from './ui/LoadingButton'
import LoadingLink from './ui/LoadingLink'
import Image from 'next/image'
import heic2any from 'heic2any'

type Props = {
    mode: 'create' | 'edit'
    initial: Partial<BottleFormInput>
    onSubmit: (prev: ActionState, formData: FormData) => Promise<ActionState>
    onDelete?: () => Promise<void>
}

const initialState: ActionState = { error: null }

export default function BottleForm({ mode, initial, onSubmit, onDelete }: Props) {
    const [state, formAction] = useActionState(onSubmit, initialState)
    const [deleting, setDeleting] = useState(false)
    const [consumed, setConsumed] = useState<boolean>(!!initial.consumed)
    const [preview, setPreview] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleFileChange = async (file: File) => {
        if (!file) return
        try {
            setIsProcessing(true)
            if (file.type === 'image/heic') {
                const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })
                const jpegFile = new File([blob as Blob], `${file.name}.jpeg`, { type: 'image/jpeg' })
                setPreview(URL.createObjectURL(jpegFile))
            } else {
                setPreview(URL.createObjectURL(file))
            }
        } catch (e) {
            console.error('Erreur conversion HEIC → JPEG', e)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <main className="max-w-2xl mx-auto p-6">
            <div className="mb-4 flex items-center gap-3">
                <h1 className="text-2xl font-semibold">
                    {mode === 'create' ? 'Ajouter une bouteille' : 'Modifier la bouteille'}
                </h1>
                <Link href="/bottles" className="text-sm underline text-gray-600">← Retour</Link>
            </div>

            <form action={formAction} className="grid grid-cols-1 gap-4 bg-white p-5 rounded-lg border shadow-sm">
                {/* Domaine / Cuvée */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Domaine / Château *</label>
                        <input name="estate" required defaultValue={initial.estate ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Château Margaux…" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Cuvée</label>
                        <input name="cuvee" defaultValue={initial.cuvee ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Vieilles Vignes…" />
                    </div>
                </div>

                {/* Appellation / Classification */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Appellation</label>
                        <input name="appellation" defaultValue={initial.appellation ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Beaujolais-Villages…" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Classification</label>
                        <input name="classification" defaultValue={initial.classification ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Premier Cru…" />
                    </div>
                </div>

                {/* Millésime / Prix */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Millésime *</label>
                        <input type="number" name="year" step={1} min={1900} max={2100} required defaultValue={initial.year ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Prix (€)</label>
                        <input type="number" name="price" step="0.01" min="0" defaultValue={initial.price ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
                    </div>
                </div>

                {/* À boire entre */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">À boire entre le</label>
                        <input type="number" name="min_year" step={1} min={1900} max={2100} defaultValue={initial.min_year ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="2024" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">et le</label>
                        <input type="number" name="max_year" step={1} min={1900} max={2100} defaultValue={initial.max_year ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="2028" />
                    </div>
                </div>

                {/* Couleur / Producteur */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Couleur *</label>
                        <select name="color" required defaultValue={initial.color ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
                            <option value="">—</option>
                            <option value="red">Rouge</option>
                            <option value="white">Blanc</option>
                            <option value="rose">Rosé</option>
                            <option value="sparkling">Pétillant</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Producteur</label>
                        <input name="producer" defaultValue={initial.producer ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Maison Passot…" />
                    </div>
                </div>

                {/* Région / Cépages */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Région</label>
                        <input name="region" defaultValue={initial.region ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Bourgogne…" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Cépages</label>
                        <input name="grapes" defaultValue={initial.grapes ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Pinot Noir, Gamay…" />
                    </div>
                </div>

                {/* Upload image */}
                <div>
                    <label className="block text-sm font-medium mb-1">Photo de la bouteille</label>
                    <div className="flex items-center gap-4">
                        {preview ? (
                            <Image src={preview} alt="Aperçu de la bouteille" className="w-32 h-32 object-contain rounded-md border" width={200} height={200} />
                        ) : initial.image_url ? (
                            <Image src={initial.image_url} alt="Bouteille actuelle" className="w-32 h-32 object-contain rounded-md border" width={200} height={200} />
                        ) : (
                            <div className="w-32 h-32 border rounded-md flex items-center justify-center text-gray-400 text-sm">
                                Pas d`image
                            </div>
                        )}

                        <label className="cursor-pointer rounded-md border px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100">
                            Choisir un fichier
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (file) await handleFileChange(file)
                                }}
                            />
                        </label>
                    </div>
                    {isProcessing && <p className="text-sm text-gray-500 mt-1">Conversion HEIC…</p>}
                </div>

                {/* Commentaires */}
                <div>
                    <label className="block text-sm font-medium">Commentaires</label>
                    <textarea name="comm" rows={2} defaultValue={initial.comm ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Infos supplémentaires…" />
                </div>

                {/* Consommée */}
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="consumed" name="consumed" defaultChecked={initial.consumed ?? false} className="h-4 w-4"
                        onChange={(e) => setConsumed(e.target.checked)} />
                    <label htmlFor="consumed" className="text-sm font-medium">Bouteille consommée</label>
                </div>

                {consumed && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Note (0–5)</label>
                            <input type="number" name="rating" min={0} max={5} step={1} defaultValue={initial.rating ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Mon avis</label>
                            <textarea name="notes" rows={1} defaultValue={initial.notes ?? ''} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" placeholder="Infos supplémentaires…" />
                        </div>
                    </div>
                )}

                {state.error && <p className="text-sm text-red-600">{state.error}</p>}

                <div className="flex items-center gap-3">
                    <LoadingButton className="rounded-md bg-black px-4 py-2 text-white" pendingText={mode === 'create' ? 'Enregistrement…' : 'Mise à jour…'}>
                        {mode === 'create' ? 'Enregistrer' : 'Mettre à jour'}
                    </LoadingButton>
                    <LoadingLink href="/bottles" className="rounded-md border px-4 py-2" loadingText="Retour…">Annuler</LoadingLink>
                </div>
            </form>

            {mode === 'edit' && onDelete && (
                <form
                    action={async () => {
                        try { setDeleting(true); await onDelete() } finally { setDeleting(false) }
                    }}
                    className="mt-4 flex justify-end"
                >
                    <LoadingButton
                        className="cursor-pointer rounded-md border border-red-300 px-4 py-2 text-red-700 hover:bg-red-50"
                    >
                        {deleting ? 'Suppression…' : 'Supprimer'}
                    </LoadingButton>
                </form>
            )}
        </main>
    )
}
