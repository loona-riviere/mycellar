'use client'

import Link, { LinkProps } from 'next/link'
import React, { useState } from 'react'

type Props = LinkProps & {
    className?: string
    children: React.ReactNode
    loadingText?: string
}

export default function LoadingLink({ className, children, loadingText = 'Ouverture…', ...props }: Props) {
    const [loading, setLoading] = useState(false)
    return (
        <Link
            {...props}
            className={className}
            onClick={(e) => {
                if (loading) return
                setLoading(true)
                // let Next.js handle the navigation
            }}
            aria-busy={loading}
            aria-live="polite"
        >
            {loading ? loadingText : children}
        </Link>
    )
}


