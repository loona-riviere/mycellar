import { createClient } from '@/utils/supabase/server'
import BottleForm from '@/app/components/BottleForm'
import { deleteBottle, updateBottle } from '@/app/bottles/actions';

export default async function EditBottlePage({
                                                 params,
                                             }: {
    params: { id: string }
}) {
    const id = params.id
    const supabase = await createClient()
    const { data: bottle, error } = await supabase
        .from('bottles')
        .select('id, name, estate, year, max_year, price, color, producer, region, grapes, comm, consumed, rating')
        .eq('id', id)
        .single()

    if (error || !bottle) {
        return <main className="max-w-2xl mx-auto p-6">Bouteille introuvable.</main>
    }

    const onSubmit = updateBottle.bind(null, id)
    const onDelete = deleteBottle.bind(null, id)

    return (
        <BottleForm
            mode="edit"
            initial={bottle}
            onSubmit={onSubmit}
            onDelete={onDelete}
        />
    )
}
