import { z } from 'zod'

export const BottleSchema = z.object({
    estate: z.string().min(1, 'Domaine / Château requis'), // ex : Château Margaux, Maison Passot Rémy & Fils
    cuvee: z.string().optional(),                          // ex : Polaris, Cuvée Miss Armande
    appellation: z.string().optional(),                    // ex : Beaujolais-Villages, Monthelie
    classification: z.string().optional(),                 // ex : Grand Cru, Premier Cru, Village, Brut (Champagne)
    region: z.string().optional(),                         // ex : Bourgogne, Bordeaux, Champagne
    producer: z.string().optional(),                       // utile si différent de l’estate
    color: z.string().optional(),                          // Rouge, Blanc, Rosé, Pétillant…
    grapes: z.string().optional(),                         // Cépages (Pinot Noir, Gamay…)
    comm: z.string().optional(),

    year: z.union([z.string(), z.number()]).optional()
        .transform(v => v === '' || v == null ? null : Number(v))
        .refine(v => v == null || Number.isInteger(v!), 'Millésime invalide'),

    max_year: z.union([z.string(), z.number()]).optional()
        .transform(v => v === '' || v == null ? null : Number(v))
        .refine(v => v == null || Number.isInteger(v!), 'Année max invalide'),

    min_year: z.union([z.string(), z.number()]).optional()
        .transform(v => v === '' || v == null ? null : Number(v))
        .refine(v => v == null || Number.isInteger(v!), 'Année min invalide'),

    price: z.union([z.string(), z.number()]).optional()
        .transform(v => v === '' || v == null ? null : Math.round(Number(v) * 100) / 100)
        .refine(v => v == null || (typeof v === 'number' && v >= 0), 'Prix invalide'),

    image_url: z.string().optional(),

    consumed: z.union([z.string(), z.boolean()]).optional()
        .transform(v => v === 'on' || v === true),

    rating: z.union([z.string(), z.number()]).optional()
        .transform(v => v === '' || v == null ? null : Number(v))
        .refine(v => v == null || (Number.isInteger(v) && v >= 0 && v <= 5), 'Note 0..5'),

    notes: z.string().optional(),
})

export type BottleFormInput = z.infer<typeof BottleSchema>
