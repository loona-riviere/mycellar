'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { ActionState } from '@/app/lib/definitions';

const Schema = z.object({
    name: z.string().min(1, 'Nom requis'),
    producer: z.string().optional(),
    region: z.string().optional(),
    color: z.string().optional(),
    grapes: z.string().optional(),
    comm: z.string().optional(),
    year: z
        .union([z.string(), z.number()])
        .optional()
        .transform((v) => {
            if (v === undefined || v === null || v === '') return null
            const n = Number(v)
            if (!Number.isFinite(n) || !Number.isInteger(n)) throw new Error('Année invalide')
            return n
        }),
    max_year: z.union([z.string(), z.number()]).optional()
        .transform(v => v === '' || v == null ? null : Number(v))
        .refine(v => v == null || Number.isInteger(v), 'Année max invalide'),
    price: z
        .union([z.string(), z.number()])
        .optional()
        .transform((v) => {
            if (v === undefined || v === null || v === '') return null
            const n = Number(v)
            if (!Number.isFinite(n) || n < 0) throw new Error('Prix invalide')
            return Math.round(n * 100) / 100
        }),
    consumed: z.union([z.string(), z.boolean()]).optional()
        .transform(v => v === 'on' || v === true ? true : false),
    rating: z.union([z.string(), z.number()]).optional()
        .transform(v => v === '' || v == null ? null : Number(v))
        .refine(v => v == null || (Number.isInteger(v) && v >= 0 && v <= 5), 'Note 0..5'),
})

export async function updateBottle(id: string, _prevState: ActionState, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Non authentifié' }

    let parsed
    try {
        parsed = Schema.parse(Object.fromEntries(formData.entries()))
        // eslint-disable-next-line
    } catch (e: any) {
        return { error: e.message ?? 'Formulaire invalide' }
    }

    const payload = {
        name: parsed.name,
        producer: parsed.producer ?? null,
        region: parsed.region ?? null,
        color: parsed.color ?? null,
        grapes: parsed.grapes ?? null,
        comm: parsed.comm ?? null,
        year: parsed.year,
        max_year: parsed.max_year,
        price: parsed.price,
        updated_at: new Date().toISOString(),
        consumed: parsed.consumed,
        rating: parsed.rating,
    }

    const { error } = await supabase
        .from('bottles')
        .update(payload)
        .eq('id', id)

    if (error) return { error: error.message }

    redirect('/bottles')
}

export async function deleteBottle(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { error } = await supabase.from('bottles').delete().eq('id', id)
    if (error) throw error

    redirect('/bottles')
}
