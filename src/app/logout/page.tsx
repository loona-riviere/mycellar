'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { logout } from '@/app/logout/actions';

export default function LogoutPage() {
    const supabase = createClientComponentClient()
    const router = useRouter()

    useEffect(() => {
        logout()
    }, [supabase, router])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
            <p className="text-lg font-semibold">Déconnexion en cours…</p>
        </div>
    )
}
