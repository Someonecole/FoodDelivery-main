"use client"

import { useState, useMemo } from "react"
import { FoodCard } from "@/components/food-card"
import { FilterBar } from "@/components/filter-bar"
import { foodProducts, type DietaryFilter, type SortOption } from "@/lib/food-data"

export function FoodMenu() {
  const [dietaryFilters, setDietaryFilters] = useState<DietaryFilter[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("popular")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = foodProducts

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply dietary filters
    if (dietaryFilters.length > 0) {
      filtered = filtered.filter((product) => dietaryFilters.every((filter) => product.dietary.includes(filter)))
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "popular":
        default:
          return b.reviews - a.reviews
      }
    })

    return sorted
  }, [dietaryFilters, sortBy, searchQuery])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-balance">Delicious Meals Delivered to Your Door</h1>
        <p className="text-muted-foreground text-lg">Browse our menu and find your perfect meal</p>
      </div>

      <FilterBar
        dietaryFilters={dietaryFilters}
        onDietaryFiltersChange={setDietaryFilters}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {filteredAndSortedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-2xl font-semibold mb-2">No meals found</p>
          <p className="text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <FoodCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
