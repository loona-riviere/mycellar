import { createBottle } from '@/app/cave/bottles/actions';
import BottleForm from '@/app/components/bottle/BottleForm';

export default async function BottleFormPage() {
        return (
            <BottleForm
                mode="create"
                initial={{}}
                onSubmit={createBottle}
            />
        )
}
