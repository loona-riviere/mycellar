'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { BottleSchema, type BottleFormInput } from './_schema'

export type ActionState = { error: string | null }

export async function markConsumed(formData: FormData) {
    const id = formData.get('id') as string
    const ratingStr = formData.get('rating') as string | null
    const notes = formData.get('notes') as string | null
    const rating =
        ratingStr && ratingStr !== '' ? Math.max(0, Math.min(5, Number(ratingStr))) : null

    const supabase = await createClient()
    const { error } = await supabase
        .from('bottles')
        .update({
            consumed: true,
            rating,
            notes,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) console.error(error)

    revalidatePath('/cave/bottles')
}

export async function createBottle(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Non authentifié' }

    const raw = Object.fromEntries(formData.entries())
    const parsed = BottleSchema.safeParse(raw)
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Formulaire invalide' }

    const d: BottleFormInput = parsed.data

    const { data, error } = await supabase
        .from('bottles')
        .insert({
            user_id: user.id,
            name: d.cuvee,
            estate: d.estate ?? null,
            producer: d.producer ?? null,
            region: d.region ?? null,
            color: d.color ?? null,
            grapes: d.grapes ?? null,
            year: d.year ?? null,
            max_year: d.max_year ?? null,
            min_year: d.min_year ?? null,
            price: d.price ?? null,
            comm: d.comm ?? null,
            consumed: d.consumed ?? false,
            rating: d.rating ?? null,
            notes: d.notes ?? null,
        })
        .select('id')
        .single()

    if (error || !data) return { error: error?.message ?? 'Erreur à l’insertion' }
    const bottleId = data.id

    // Upload image côté serveur (JPEG/PNG)
    const file = formData.get('image') as File | null
    if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop() ?? 'jpg'
        const fileName = `${bottleId}.${fileExt}`
        const filePath = `bottles/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('bottles_img')
            .upload(filePath, file, { upsert: true })

        if (!uploadError) {
            const { data } = supabase.storage.from('bottles_img').getPublicUrl(filePath)
            await supabase.from('bottles').update({ image_url: data.publicUrl }).eq('id', bottleId)
        }
    }

    redirect('/cave/bottles')
}

export async function updateBottle(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Non authentifié' }

    const raw = Object.fromEntries(formData.entries())
    const parsed = BottleSchema.safeParse(raw)
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Formulaire invalide' }

    const d: BottleFormInput = parsed.data

    let imageUrl = null
    const file = formData.get('image') as File | null
    if (file && file.size > 0) {
        const fileName = `${id}-${file.name}`
        const filePath = `bottles/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('bottles_img')
            .upload(filePath, file, { upsert: true })
        if (uploadError) return { error: uploadError.message }

        const { data } = supabase.storage.from('bottles_img').getPublicUrl(filePath)
        imageUrl = data.publicUrl
    }

    const { error } = await supabase.from('bottles').update({
        user_id: user.id,
        cuvee: d.cuvee,
        appellation: d.appellation,
        classification: d.classification,
        estate: d.estate ?? null,
        producer: d.producer ?? null,
        region: d.region ?? null,
        color: d.color ?? null,
        grapes: d.grapes ?? null,
        comm: d.comm ?? null,
        year: d.year,
        max_year: d.max_year,
        min_year: d.min_year,
        price: d.price,
        consumed: d.consumed ?? false,
        rating: d.rating ?? null,
        updated_at: new Date().toISOString(),
        notes: d.notes ?? null,
        image_url: imageUrl ?? undefined,
    }).eq('id', id)

    if (error) return { error: error.message }
    redirect('/cave/bottles')
}

export async function deleteBottle(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { error } = await supabase.from('bottles').delete().eq('id', id)
    if (error) throw error
    redirect('/cave/bottles')
}
