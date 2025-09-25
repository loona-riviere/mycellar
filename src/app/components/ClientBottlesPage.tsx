"use client"
import { useState, useMemo } from "react"
import NotificationsPanel from "@/app/components/NotificationsPanel"
import BottleList from "@/app/components/bottle/BottleList"
import { Bottle, labelColors } from "@/app/lib/definitions"
import { BottleFilters, SortKey } from '@/app/components/BottleFilters'
import Link from "next/link"
import StockSummary from '@/app/components/StockSummary';

interface Props {
    initialBottles: Bottle[]
    caveName?: string
}

export default function ClientBottlesPage({ initialBottles }: Readonly<Props>) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRegion, setSelectedRegion] = useState("")
    const [selectedColor, setSelectedColor] = useState("")
    const [sortBy, setSortBy] = useState<SortKey>("ready_asc")

    const filteredBottles = useMemo(() => {
        return initialBottles
            .filter(b => {
                const matchesSearch =
                    b.estate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (b.cuvee?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                    (b.region?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
                const matchesRegion = selectedRegion === "" || b.region === selectedRegion
                const matchesColor = selectedColor === "" || labelColors[b.color] === selectedColor
                return matchesSearch && matchesRegion && matchesColor
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "year": return (b.year || 0) - (a.year || 0)
                    case "price": return (b.price ?? 0) - (a.price ?? 0)
                    case "name": return a.estate.localeCompare(b.estate)
                    default: return 0
                }
            })
    }, [initialBottles, searchTerm, selectedRegion, selectedColor, sortBy])


    const counts = (initialBottles ?? []).reduce(
        (acc, b) => {
            if (!b.color) return acc
            acc[b.color] = (acc[b.color] || 0) + 1
            return acc
        },
        {} as Record<string, number>
    )

    return (
        <main className="container mx-auto px-4 py-8 space-y-6">
            {/* Notifications */}
            <NotificationsPanel bottles={initialBottles} />

            {/* Stock Summary */}
            <StockSummary counts={counts} total={initialBottles.length} />

            {/* Filtres */}
            <BottleFilters
                bottles={initialBottles}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />


            {/* Liste des bouteilles */}
            {initialBottles.length == 0 ?
                (<p className = "mt-4 text-center text-gray-500 italic" >
                    Vous n`avez aucune bouteille à déguster 🍷
                </p>) :
                <BottleList bottles={filteredBottles} variant="active"/>
            }

{/* Lien vers les terminées */
}
<div className="text-center mt-6">
    <Link href="/cave/bottles/finished" className="text-sm underline text-gray-600">
                    Voir les terminées
                </Link>
            </div>
        </main>
    )
}
