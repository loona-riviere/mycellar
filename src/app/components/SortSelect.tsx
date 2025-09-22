'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export default function SortSelect() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const current = searchParams.get('sort') ?? 'year_desc'

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const params = new URLSearchParams(searchParams)
        params.set('sort', e.target.value)
        startTransition(() => router.push(`?${params.toString()}`))
    }

    return (
        <select
            value={current}
            onChange={handleChange}
            disabled={isPending}
            className="rounded-md border px-2 py-1 text-sm"
        >
            <option value="maxyear_asc">À boire bientôt</option>
            <option value="year_desc">Année ↓</option>
            <option value="year_asc">Année ↑</option>
            <option value="price_desc">Prix ↓</option>
            <option value="price_asc">Prix ↑</option>
            <option value="created_desc">Ajout récent</option>
        </select>
    )
}
