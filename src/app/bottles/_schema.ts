import { z } from 'zod'

export const BottleSchema = z.object({
    name: z.string().min(1, 'Nom requis'),
    estate: z.string().optional(),
    producer: z.string().optional(),
    region: z.string().optional(),
    color: z.string().optional(),
    grapes: z.string().optional(),
    comm: z.string().optional(),
    
    year: z.union([z.string(), z.number()]).optional()
    .transform(v => v === '' || v == null ? null : Number(v))
    .refine(v => v == null || Number.isInteger(v!), 'Millésime invalide'),
    
    max_year: z.union([z.string(), z.number()]).optional()
    .transform(v => v === '' || v == null ? null : Number(v))
    .refine(v => v == null || Number.isInteger(v!), 'Année max invalide'),
    
    price: z.union([z.string(), z.number()]).optional()
    .transform(v => v === '' || v == null ? null : Math.round(Number(v) * 100) / 100)
    .refine(v => v == null || (typeof v === 'number' && v >= 0), 'Prix invalide'),
    
    consumed: z.union([z.string(), z.boolean()]).optional()
    .transform(v => v === 'on' || v === true),
    
    rating: z.union([z.string(), z.number()]).optional()
    .transform(v => v === '' || v == null ? null : Number(v))
    .refine(v => v == null || (Number.isInteger(v) && v >= 0 && v <= 5), 'Note 0..5'),
    
    notes: z.string().optional(),
})

export type BottleFormInput = z.infer<typeof BottleSchema>
