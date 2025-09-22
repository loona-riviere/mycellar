'use client'

import Link, { LinkProps } from 'next/link'
import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    LinkProps & {
        className?: string
        children: React.ReactNode
        loadingText?: string
    }

export default function LoadingLink({ className, children, loadingText = 'Ouverture…', ...props }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    // We emulate Link behavior but trigger navigation via router to control pending state
    const { href, replace, scroll, prefetch, ...rest } = props

    return (
        <Link
            {...(rest as LinkProps)}
            href={href}
            prefetch={prefetch}
            className={className}
            onClick={(e) => {
                // Prevent the default link navigation to manage with router and set pending
                e.preventDefault()
                if (isPending) return
                startTransition(() => {
                    // Use router to navigate programmatically
                    if (replace) router.replace(href.toString())
                    else router.push(href.toString())
                    // Respect scroll option if provided
                    if (scroll === false) {
                        // Next.js router doesn't take scroll in push/replace in app router; fallback handled by Link normally.
                        // No-op here.
                    }
                })
            }}
            aria-busy={isPending}
            aria-live="polite"
        >
            {isPending ? loadingText : children}
        </Link>
    )
}


