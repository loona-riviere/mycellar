'use client'

import { Skeleton } from "@heroui/skeleton"

export default function LoadingFinishedBottles() {
    return (
        <main className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-48 rounded" /> {/* titre */}
                <Skeleton className="h-8 w-32 rounded-md" /> {/* bouton retour */}
            </div>

            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-2"
                >
                    <Skeleton className="h-6 w-2/3 rounded" /> {/* nom bouteille */}
                    <Skeleton className="h-4 w-1/2 rounded" /> {/* producteur / région */}
                    <Skeleton className="h-4 w-24 rounded" /> {/* étoiles */}
                    <Skeleton className="h-4 w-32 rounded" /> {/* prix + date */}
                </div>
            ))}
        </main>
    )
}
