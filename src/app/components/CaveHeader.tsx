"use client"

import { Plus } from "lucide-react"
import LoadingLink from "./ui/LoadingLink"
import CaveMenu from "./CaveMenu"
import Link from "next/link"

interface Props {
    caveName?: string
}

export default function CaveHeader({ caveName }: Readonly<Props>) {
    return (
        <div className="w-full flex flex-row justify-between items-start md:items-center gap-4">
            {/* Titre */}
            <div>
                <Link href="/">
                    <h2 className="text-3xl font-playfair font-bold cursor-pointer">🍷 Ma Cave</h2>
                </Link>
                {caveName && <p className="text-muted-foreground ml-10">{caveName}</p>}
            </div>

            {/* Menu / Nouvelle bouteille alignés à droite */}
            <div className="flex items-center gap-2 flex-wrap md:justify-end">
                <LoadingLink
                    href="/cave/bottles/new"
                    prefetch
                    className="inline-flex items-center rounded-md bg-red-800 text-white p-2 sm:px-4 sm:py-2 hover:bg-red-900 transition focus:outline-none"
                    aria-label="Nouvelle bouteille"
                    loadingText="Ouverture…"
                >
                    <Plus className="h-5 w-5" aria-hidden="true" />
                    <span className="ml-2 hidden sm:inline">Nouvelle bouteille</span>
                </LoadingLink>

                <CaveMenu />
            </div>
        </div>
    )
}
