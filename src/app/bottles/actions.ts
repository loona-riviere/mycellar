'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function markConsumed(formData: FormData) {
    const id = formData.get('id') as string
    const ratingStr = formData.get('rating') as string | null
    const rating =
        ratingStr && ratingStr !== '' ? Math.max(0, Math.min(5, Number(ratingStr))) : null

    const supabase = await createClient()
    const { error } = await supabase
        .from('bottles')
        .update({
            consumed: true,
            rating,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) {
        // tu peux lancer une erreur ou logger si besoin
        console.error(error)
    }

    // recharge la page liste
    revalidatePath('/bottles')
}
