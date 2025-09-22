'use client'

type Props = {
  counts: Partial<Record<'red'|'white'|'rose'|'sparkling', number>>
  total: number
}

const COLORS: {key: 'red'|'white'|'rose'|'sparkling'; label: string; emoji: string; bg: string; dot: string}[] = [
  { key: 'red',       label: 'Rouges',     emoji: '🍷', bg: 'bg-rose-50',      dot: 'bg-rose-500' },
  { key: 'white',     label: 'Blancs',     emoji: '🥂', bg: 'bg-yellow-50',    dot: 'bg-yellow-500' },
  { key: 'rose',      label: 'Rosés',      emoji: '🌸', bg: 'bg-pink-50',      dot: 'bg-pink-500' },
  { key: 'sparkling', label: 'Pétillants', emoji: '🍾', bg: 'bg-cyan-50',      dot: 'bg-cyan-500' },
]

export default function StockSummary({ counts, total }: Props) {
  const safe = (k: 'red'|'white'|'rose'|'sparkling') => counts[k] ?? 0
  const segments = COLORS
    .map(c => ({ ...c, value: safe(c.key) }))
    .filter(s => s.value > 0)

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
