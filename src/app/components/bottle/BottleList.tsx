import BottleCard from '@/app/components/bottle/BottleCard'
import type { Bottle } from '@/app/lib/definitions'

type Props = {
    bottles: Bottle[]
    variant: 'active' | 'finished'
}

export default function BottleList({ bottles, variant }: Readonly<Props>) {
    if (bottles.length === 0) {
        return (
            <p className="mt-4 text-center text-gray-500 italic">
                {variant === 'active' ? "Aucune bouteille ne correspond à vos critères" : "Vous n'avez aucune bouteille terminée."}
            </p>
        )
    }

    return (
        <ul className="mt-4 space-y-4">
            {bottles.map(b => (
                <BottleCard key={b.id} bottle={b} variant={variant} />
            ))}
        </ul>
    )
}
