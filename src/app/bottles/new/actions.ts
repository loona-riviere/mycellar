'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { ActionState } from '@/app/lib/definitions';

const Schema = z.object({
    name: z.string().min(1),
    estate: z.string().optional(),
    producer: z.string().optional(),
    region: z.string().optional(),
    color: z.string().optional(),
    grapes: z.string().optional(),
    year: z.union([z.string(), z.number()]).optional()
        .transform(v => v === '' || v == null ? null : Number(v)),
    max_year: z.union([z.string(), z.number()]).optional()
        .transform(v => v === '' || v == null ? null : Number(v))
        .refine(v => v == null || Number.isInteger(v), 'Année max invalide'),
    price: z.union([z.string(), z.number()]).optional()
        .transform(v => v === '' || v == null ? null : Math.round(Number(v) * 100) / 100),
    comm: z.string().optional(),
    consumed: z
        .union([z.string(), z.boolean()])
        .optional()
        .transform(v => v === 'on' || v === true ? true : false),   // checkbox HTML

    rating: z.union([z.string(), z.number()]).optional()
        .transform(v => v === '' || v == null ? null : Number(v))
        .refine(v => v == null || (Number.isInteger(v) && v >= 0 && v <= 5), 'Note 0..5'),
})

export async function createBottle(_: ActionState, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Non authentifié' }

    const raw = Object.fromEntries(formData.entries())
    const data = Schema.parse(raw)

    const { error } = await supabase.from('bottles').insert({
        user_id: user.id,
        name: data.name,
        estate: data.estate,
        producer: data.producer ?? null,
        region: data.region ?? null,
        color: data.color ?? null,
        grapes: data.grapes ?? null,
        year: data.year ?? null,
        max_year: data.max_year ?? null,
        price: data.price ?? null,
        comm: data.comm ?? null,
        consumed: data.consumed,
        rating: data.rating ?? null,
    })
    if (error) return { error: error.message }
    redirect('/bottles')
}