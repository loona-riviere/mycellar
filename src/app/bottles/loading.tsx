// app/bottles/loading.tsx
'use client'

import { Skeleton } from '@heroui/skeleton';

export default function LoadingBottles() {
    return (
        <main className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="flex items-center border-gray-200 p-4 justify-between">
                <Skeleton className="h-7 w-40 rounded" />
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-32 rounded-md" />
                    <Skeleton className="h-10 w-40 rounded-md" />
                </div>
            </div>

            {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-xl border-gray-200 p-4">
                    <Skeleton className="h-6 w-2/3 rounded" />
                    <div className="mt-2 space-y-2">
                        <Skeleton className="h-4 w-1/2 rounded" />
                        <Skeleton className="h-4 w-1/3 rounded" />
                    </div>
                </div>
            ))}
        </main>
    )
}
