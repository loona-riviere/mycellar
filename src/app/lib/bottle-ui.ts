import type { Bottle } from '@/app/lib/definitions'

export function formatPrice(v: number | null | undefined) {
  if (v == null) return '— €'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(Number(v))
}


export function getColorChip(color?: Bottle['color']): { className: string; label: string } | null {
  switch (color) {
    case 'red': return { className: 'bg-rose-100 text-rose-800', label: 'Rouge' }
    case 'white': return { className: 'bg-amber-100 text-amber-800', label: 'Blanc' }
    case 'rose': return { className: 'bg-pink-100 text-pink-800', label: 'Rosé' }
    case 'sparkling': return { className: 'bg-cyan-100 text-cyan-800', label: 'Pétillant' }
    default: return null
  }
}


export function getMaturityChip(min_year: number, max_year: number): { className: string; text: string } {
  const currentYear = new Date().getFullYear();
  let color, text;

  if (currentYear < min_year) {
    color = "bg-blue-100 text-blue-900";
    const yearsLeft = min_year - currentYear;
    text = `Mature dans ${yearsLeft} an${yearsLeft > 1 ? 's' : ''} (${min_year}–${max_year})`;
  } else if (currentYear >= min_year && currentYear <= max_year) {
    if (currentYear >= max_year - 1) {
      color = "bg-red-100 text-red-800"; // Urgent
      text = `Déclin dans 1 an (${min_year}–${max_year})`;
    } else if (currentYear >= max_year - 2) {
      color = "bg-orange-100 text-orange-800"; // Bientôt urgent
      text = `Trop jeune (${min_year}–${max_year})`;
    } else {
      color = "bg-green-100 text-green-800"; // Prêt
      text = `Mature (${min_year}–${max_year})`;
    }
  } else {
    color = "bg-gray-100 text-gray-800";
    text = `Déclin (${min_year}–${max_year})`;
  }

  return { className: color, text };
}
