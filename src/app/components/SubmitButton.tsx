// app/components/SubmitButton.tsx
'use client'
import {useFormStatus} from 'react-dom'
import {Loader2} from 'lucide-react'

export default function SubmitButton({children, className=""}: {children: React.ReactNode; className?: string}) {
    const {pending} = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 transition disabled:opacity-60 ${className}`}
        >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{pending ? 'Chargement…' : children}</span>
        </button>
    )
}
