"use client"
import { useState, useMemo } from "react"
import NotificationsPanel from "@/app/components/NotificationsPanel"
import BottleList from "@/app/components/bottle/BottleList"
import { Bottle } from "@/app/lib/definitions"
import { BottleFilters, SortKey } from '@/app/components/BottleFilters'
import Link from "next/link"
import { Plus } from "lucide-react"
import StockSummary from '@/app/components/StockSummary';
import LoadingLink from '@/app/components/ui/LoadingLink';

interface Props {
    initialBottles: Bottle[]
}

export default function ClientBottlesPage({ initialBottles }: Readonly<Props>) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRegion, setSelectedRegion] = useState("")
    const [selectedCuvee, setSelectedCuvee] = useState("")
    const [sortBy, setSortBy] = useState<SortKey>("ready_asc")

    const filteredBottles = useMemo(() => {
        return initialBottles
            .filter(b => {
                const matchesSearch =
                    b.estate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (b.cuvee?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                    (b.region?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
                const matchesRegion = selectedRegion === "" || b.region === selectedRegion
                const matchesCuvee = selectedCuvee === "" || b.cuvee === selectedCuvee
                return matchesSearch && matchesRegion && matchesCuvee
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "year": return (b.year || 0) - (a.year || 0)
                    case "price": return (b.price || 0) - (a.price || 0)
                    case "name": return a.estate.localeCompare(b.estate)
                    default: return 0
                }
            })
    }, [initialBottles, searchTerm, selectedRegion, selectedCuvee, sortBy])


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
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-playfair font-bold">🍷 Ma Cave</h2>
                    <p className="text-muted-foreground">Découvrez et gérez votre collection</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <LoadingLink
                        href="/bottles/new"
                        prefetch
                        className="inline-flex items-center rounded-md bg-red-800 text-white p-2 sm:px-4 sm:py-2 hover:bg-red-900 transition focus:outline-none"
                        aria-label="Nouvelle bouteille"
                        loadingText="Ouverture…">
                        <Plus className="h-5 w-5" aria-hidden="true" />
                        <span className="ml-2 hidden sm:inline">Nouvelle bouteille</span>
                    </LoadingLink>
                </div>
            </div>

            {/* Notifications */}
            <NotificationsPanel bottles={filteredBottles} />

            {/* Stock Summary */}
            <StockSummary counts={counts} total={initialBottles.length} />

            {/* Filtres */}
            <BottleFilters
                bottles={initialBottles}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                selectedCuvee={selectedCuvee}
                setSelectedCuvee={setSelectedCuvee}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />


            {/* Liste des bouteilles */}
            <BottleList bottles={filteredBottles} variant="active" />

            {/* Lien vers les terminées */}
            <div className="text-center mt-6">
                <Link href="/bottles/finished" className="text-sm underline text-gray-600">
                    Voir les terminées
                </Link>
            </div>
        </main>
    )
}
