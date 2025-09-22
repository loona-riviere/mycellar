'use client'

type Props = {
    counts: Partial<Record<'red' | 'white' | 'rose' | 'sparkling', number>>
    total: number
}

const COLORS: { key: 'red' | 'white' | 'rose' | 'sparkling'; label: string; emoji: string; bg: string; }[] = [
    { key: 'red', label: 'Rouge(s)', emoji: '🍷', bg: 'bg-red-50' },
    { key: 'white', label: 'Blanc(s)', emoji: '🥂', bg: 'bg-yellow-50' },
    { key: 'rose', label: 'Rosé(s)', emoji: '🌸', bg: 'bg-pink-50' },
    { key: 'sparkling', label: 'Pétillant(s)', emoji: '🍾', bg: 'bg-cyan-50' },
]

export default function StockSummary({ counts, total }: Props) {
    const safe = (k: 'red' | 'white' | 'rose' | 'sparkling') => counts[k] ?? 0

    return (
        <section className="rounded-xl border bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">En stock</p>
                    <p className="text-2xl font-semibold leading-tight">{total}</p>
                </div>
            </div>

            {/* Pastilles par couleur */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {COLORS.map(c => (
                    <div key={c.key} className={`flex items-center justify-between rounded-lg px-3 py-2 ${c.bg}`}>
                        <div className="flex items-center gap-2">
                            <span className="text-base">{c.emoji}</span>
                            <span className="text-sm text-gray-700">{c.label}</span>
                        </div>
                        <span className="text-sm font-medium tabular-nums">{safe(c.key)}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}
