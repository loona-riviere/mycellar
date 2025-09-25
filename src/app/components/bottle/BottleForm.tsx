'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import type { BottleFormInput } from '@/app/cave/bottles/_schema'
import type { ActionState } from '@/app/cave/bottles/actions'
import LoadingButton from '../ui/LoadingButton'
import LoadingLink from '../ui/LoadingLink'
import Image from 'next/image'
import heic2any from 'heic2any'
import { RatingStars } from '@/app/components/RatingStars';
import { InputField } from '@/app/components/ui/InputField';

type Props = {
    mode: 'create' | 'edit'
    initial: Partial<BottleFormInput>
    onSubmit: (prev: ActionState, formData: FormData) => Promise<ActionState>
    onDelete?: () => Promise<void>
}

const initialState: ActionState = { error: null }

export default function BottleForm({ mode, initial, onSubmit, onDelete }: Readonly<Props>) {
    const [state, formAction] = useActionState(onSubmit, initialState)
    const [deleting, setDeleting] = useState(false)
    const [consumed, setConsumed] = useState<boolean>(!!initial.consumed)
    const [preview, setPreview] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [rating, setRating] = useState<number | ''>(initial.rating ?? '')

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

    const getBottleImage = () => {
        if (preview) return { src: preview, alt: "Aperçu de la bouteille" }
        if (initial.image_url) return { src: initial.image_url, alt: "Bouteille actuelle" }
        return null
    }

    const bottleImage = getBottleImage()

    return (
        <main className="max-w-2xl mx-auto p-6">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <h1 className="text-3xl font-playfair font-semibold text-red-700">
                    {mode === 'create' ? 'Ajouter une bouteille' : 'Modifier la bouteille'}
                </h1>
                <Link
                    href="/cave/bottles"
                    className="inline-block rounded-xl border border-red-300 px-4 py-2 text-red-700 hover:bg-red-50 transition text-sm"
                    prefetch
                >
                    ← Retour
                </Link>

            </div>

            <form action={formAction} className="grid grid-cols-1 gap-6 bg-[#fdf7f7] p-6 rounded-2xl border border-red-300 shadow-lg">
                {/* Domaine / Cuvée */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Domaine / Château *"
                        required
                        id="estate"
                        value={initial.estate ?? ''}
                        placeholder="Château La Tour Carnet..."
                        className="rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-800"
                    />
                    <InputField
                        label="Cuvée"
                        id="cuvee"
                        value={initial.cuvee ?? ''}
                        placeholder="Vieilles Vignes..."
                        className="rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-800"
                    />
                </div>

                {/* Appellation / Classification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Appellation"
                        id="appellation"
                        value={initial.appellation ?? ''}
                        placeholder="Beaujolais-Villages..."
                        className="rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-800"
                    />
                    <InputField
                        label="Classification"
                        id="classification"
                        value={initial.classification ?? ''}
                        placeholder="Premier Cru..."
                        className="rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-800"
                    />
                </div>

                {/* Millésime / Prix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        required
                        label="Millésime *"
                        id="year"
                        type="number"
                        step={1}
                        min={1900}
                        max={2100}
                        value={initial.year ?? ''}
                        className="rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-800"
                    />
                    <InputField
                        label="Prix (€)"
                        id="price"
                        type="number"
                        step={0.01}
                        min={0}
                        value={initial.price ?? ''}
                        className="rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-800"
                    />
                </div>

                {/* À boire entre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="À boire entre le"
                        type="number"
                        id="min_year"
                        step={1}
                        min={1900}
                        max={2100}
                        value={initial.min_year ?? ''}
                        placeholder="2024"
                        className="rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-800"
                    />
                    <InputField
                        label="et le"
                        type="number"
                        id="max_year"
                        step={1}
                        min={1900}
                        max={2100}
                        value={initial.max_year ?? ''}
                        placeholder="2028"
                        className="rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-800"
                    />
                </div>

                {/* Couleur / Producteur */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="color" className="block text-sm font-medium">Couleur *</label>
                        <select
                            id="color"
                            name="color"
                            required
                            defaultValue={initial.color ?? ''}
                            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-800"
                        >
                            <option value="">—</option>
                            <option value="red">Rouge</option>
                            <option value="white">Blanc</option>
                            <option value="rose">Rosé</option>
                            <option value="sparkling">Pétillant</option>
                        </select>
                    </div>
                    <InputField
                        label="Producteur"
                        id="producer"
                        value={initial.producer ?? ''}
                        placeholder="Bernard Magres..."
                        className="rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-800"
                    />
                </div>

                {/* Région / Cépages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Région"
                        id="region"
                        value={initial.region ?? ''}
                        placeholder="Bourgogne..."
                        className="rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-800"
                    />
                    <InputField
                        label="Cépages"
                        id="grapes"
                        value={initial.grapes ?? ''}
                        placeholder="Pinot Noir, Gamay..."
                        className="rounded-xl border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-800"
                    />
                </div>

                {/* Upload image */}
                <div>
                    <label htmlFor="image" className="block text-sm font-medium mb-1">
                        Photo de la bouteille
                    </label>
                    <div className="flex items-center gap-4">
                        {bottleImage ? (
                            <div className="w-32 h-32 bg-white rounded-xl border border-gray-300 shadow-sm flex items-center justify-center overflow-hidden hover:shadow-lg transition-shadow">
                                <Image
                                    loading="lazy"
                                    src={bottleImage.src}
                                    alt={bottleImage.alt}
                                    className="w-full h-full object-contain"
                                    width={200}
                                    height={200}
                                />
                            </div>
                        ) : (
                            <div className="w-32 h-32 border-2 border-dashed border-red-300 rounded-xl flex items-center justify-center text-gray-400 text-sm italic">
                                Pas d`image
                            </div>
                        )}

                        <label
                            htmlFor="image"
                            className="cursor-pointer rounded-xl border px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm transition"
                        >
                            Choisir un fichier
                        </label>
                        <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file) await handleFileChange(file)
                            }}
                        />
                    </div>
                    {isProcessing && <p className="text-sm text-gray-500 mt-1">Conversion HEIC…</p>}
                </div>

                {/* Commentaires */}
                <div>
                    <label htmlFor="comm" className="block text-sm font-medium">
                        Commentaires
                    </label>
                    <textarea
                        id="comm"
                        name="comm"
                        rows={2}
                        defaultValue={initial.comm ?? ''}
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-800"
                        placeholder="Infos supplémentaires…"
                    />
                </div>

                {/* Consommée */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="consumed"
                        name="consumed"
                        defaultChecked={initial.consumed ?? false}
                        className="h-4 w-4"
                        onChange={(e) => setConsumed(e.target.checked)}
                    />
                    <label htmlFor="consumed" className="text-sm font-medium">
                        Bouteille consommée
                    </label>
                </div>

                {consumed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <RatingStars rating={rating} setRating={setRating}/>
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium">
                                Mon avis
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={1}
                                defaultValue={initial.notes ?? ''}
                                className="mt-1 w-full rounded-xl border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-800"
                                placeholder="Infos supplémentaires…"
                            />
                        </div>
                    </div>
                )}

                {state.error && <p className="text-sm text-red-600">{state.error}</p>}

                {/* Boutons */}
                <div className="flex flex-col md:flex-row gap-3 mt-4">
                    <LoadingButton
                        className="rounded-xl bg-red-700 px-6 py-2 text-white font-medium hover:bg-red-600 transition"
                        pendingText={mode === 'create' ? 'Enregistrement…' : 'Mise à jour…'}
                    >
                        {mode === 'create' ? 'Enregistrer' : 'Mettre à jour'}
                    </LoadingButton>
                    <LoadingLink
                        href="/cave/bottles"
                        className="rounded-xl border-red-300 px-6 py-2 hover:bg-red-50 transition text-red-700"
                        loadingText="Retour…"
                    >
                        Annuler
                    </LoadingLink>
                </div>
            </form>

            {mode === 'edit' && onDelete && (
                <form
                    action={async () => {
                        try {
                            setDeleting(true)
                            await onDelete()
                        } finally {
                            setDeleting(false)
                        }
                    }}
                    className="mt-4 flex justify-end"
                >
                    <LoadingButton
                        className="cursor-pointer rounded-xl border border-red-300 px-4 py-2 text-red-700 hover:bg-red-50">
                        {deleting ? 'Suppression…' : 'Supprimer'}
                    </LoadingButton>
                </form>
            )}
        </main>
    )
}
