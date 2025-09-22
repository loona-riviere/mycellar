'use client'

import { Skeleton } from "@heroui/skeleton"

export default function LoadingEditBottle() {
    return (
        <main className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-64 rounded" /> 
                <Skeleton className="h-4 w-24 rounded" />
            </div>

            <div className="grid grid-cols-1 gap-4 bg-white p-5 rounded-lg border shadow-sm">
                {/* Domaine / Nom */}
                <div className="grid grid-cols-2 gap-4">
                    {[0, 1].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-28 rounded" />
                            <Skeleton className="h-9 w-full rounded" />
                        </div>
                    ))}
                </div>

                {/* Millésime / Prix */}
                <div className="grid grid-cols-2 gap-4">
                    {[0, 1].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-9 w-full rounded" />
                        </div>
                    ))}
                </div>

                {/* À boire avant */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-9 w-full rounded" />
                </div>

                {/* Couleur / Producteur */}
                <div className="grid grid-cols-2 gap-4">
                    {[0, 1].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-9 w-full rounded" />
                        </div>
                    ))}
                </div>

                {/* Région / Cépages */}
                <div className="grid grid-cols-2 gap-4">
                    {[0, 1].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-9 w-full rounded" />
                        </div>
                    ))}
                </div>

                {/* Consommée / Note */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32 rounded" />
                        <Skeleton className="h-5 w-24 rounded" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-9 w-full rounded" />
                    </div>
                </div>

                {/* Commentaires */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-24 w-full rounded" />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-36 rounded-md" />
                    <Skeleton className="h-10 w-28 rounded-md" />
                </div>
            </div>
        </main>
    )
}
