import type { Bottle } from '@/app/lib/definitions'

export function formatPrice(v: number | null | undefined) {
  if (v == null) return '— €'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(Number(v))
}

export function getColorExpirationBadge(b: Bottle): { className: string; text: string } | null {
  if (!b.max_year) return null
  const y = new Date().getFullYear()
  const left = b.max_year - y
  if (left > 3) return { className: 'bg-green-100 text-green-800', text: `À boire < ${b.max_year}` }
  if (left >= 1) return { className: 'bg-orange-100 text-orange-800', text: `À boire < ${b.max_year}` }
  if (left >= 0) return { className: 'bg-red-100 text-red-700', text: `Dernière année` }
  return { className: 'bg-gray-200 text-gray-500 line-through', text: `Après ${b.max_year}` }
}

export function getColorChip(color?: Bottle['color']): { className: string; label: string } | null {
  switch (color) {
    case 'red':       return { className: 'bg-rose-100 text-rose-800',   label: 'Rouge' }
    case 'white':     return { className: 'bg-amber-100 text-amber-800', label: 'Blanc' }
    case 'rose':      return { className: 'bg-pink-100 text-pink-800',   label: 'Rosé' }
    case 'sparkling': return { className: 'bg-cyan-100 text-cyan-800',   label: 'Pétillant' }
    default:          return null
  }
}
