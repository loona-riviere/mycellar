import BottleCard from '@/app/components/BottleCard'
import type { Bottle } from '@/app/lib/definitions'

export default function BottleList({ bottles, variant }: { bottles: Bottle[]; variant: 'active' | 'finished' }) {
    return (
        <ul className="mt-4 space-y-4">
            {bottles.map(b => <BottleCard key={b.id} bottle={b} variant={variant} />)}
        </ul>
    )
}
