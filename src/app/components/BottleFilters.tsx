"use client"

import { Search, Filter } from "lucide-react"
import { Bottle } from "@/app/lib/definitions"

interface BottleFiltersProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    selectedRegion: string
    setSelectedRegion: (region: string) => void
    selectedColor: string
    setSelectedColor: (color: string) => void
    sortBy: SortKey
    setSortBy: (val: SortKey) => void
    bottles: Bottle[]
}

export type SortKey = "name" | "year" | "price" | "ready_asc"

export function BottleFilters({
                                  searchTerm,
                                  setSearchTerm,
                                  selectedRegion,
                                  setSelectedRegion,
                                  selectedColor,
                                  setSelectedColor,
                                  sortBy,
                                  setSortBy,
                                  bottles,
                              }: Readonly<BottleFiltersProps>) {

    // Générer dynamiquement les options de région et cuvée depuis tes bouteilles
    const regions = Array.from(new Set(bottles.map(b => b.region).filter(Boolean)))
    const colors = ["Rouge", "Blanc", "Rosé","Pétillant"];


    const sortOptions = [
        { value: "name", label: "Nom" },
        { value: "year", label: "Année" },
        { value: "price", label: "Prix" },
        { value: "ready_asc", label: "À boire bientôt" }
    ]

    const clearFilters = () => {
        setSearchTerm("")
        setSelectedRegion("")
        setSelectedColor("")
        setSortBy("name")
    }

    // Calcul du nombre de filtres actifs
    const activeFilters = [
        searchTerm || null,
        selectedRegion || null,
        selectedColor || null,
    ].filter(Boolean);

    const activeFiltersCount = activeFilters.length;


    return (
        <div className="space-y-4 p-4 bg-white shadow rounded-lg">
            {/* Filtres principaux */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Rechercher un vin, producteur ou raisin..."
                        className="pl-10 pr-3 py-2 w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-red-800 cursor-pointer"
                    />
                </div>

                {/* Région */}
                <select
                    value={selectedRegion}
                    onChange={e => setSelectedRegion(e.target.value)}
                    className="w-full sm:w-40 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-800 cursor-pointer"
                >
                    <option value="">Toutes régions</option>
                    {regions.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                {/* Cuvée */}
                <select
                    value={selectedColor}
                    onChange={e => setSelectedColor(e.target.value)}
                    className="w-full sm:w-40 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-800 cursor-pointer"
                >
                    <option value="">Toues les types</option>
                    {colors.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortKey)}
                    className="w-full sm:w-40 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-800 cursor-pointer"
                >
                    {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 text-sm">Filtres actifs:</span>
                    {searchTerm && (
                        <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded">{searchTerm}</span>
                    )}
                    {selectedRegion && (
                        <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded">{selectedRegion}</span>
                    )}
                    {selectedColor && (
                        <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded">{selectedColor}</span>
                    )}
                    <button
                        onClick={clearFilters}
                        className="ml-auto text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                        Effacer
                    </button>
                </div>
            )}


        </div>
    )
}
