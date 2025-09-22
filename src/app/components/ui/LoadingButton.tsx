'use client'

import React from 'react'
import { useFormStatus } from 'react-dom'

type Props = {
    children: React.ReactNode
    className?: string
    type?: 'button' | 'submit' | 'reset'
    pendingText?: string
    // Next.js server action bound to this button
    formAction?: (formData: FormData) => void | Promise<void>
}

export default function LoadingButton({ children, className, type = 'submit', pendingText = 'En cours…', formAction }: Props) {
    const { pending } = useFormStatus()
    return (
        <button type={type} className={className} disabled={pending} aria-busy={pending} aria-live="polite" formAction={formAction}>
            {pending ? pendingText : children}
        </button>
    )
}


