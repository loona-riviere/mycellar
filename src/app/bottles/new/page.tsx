import { createBottle } from '@/app/bottles/actions';
import BottleForm from '@/app/bottles/form/BottleForm';

export default async function BottleFormPage() {
        return (
            <BottleForm
                mode="create"
                initial={{}}
                onSubmit={createBottle}
            />
        )
}
