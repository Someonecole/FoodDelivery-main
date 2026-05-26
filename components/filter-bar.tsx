"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { DietaryFilter, SortOption } from "@/lib/food-data"

const dietaryOptions: { value: DietaryFilter; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten Free" },
  { value: "dairy-free", label: "Dairy Free" },
  { value: "spicy", label: "Spicy" },
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
]

interface FilterBarProps {
  dietaryFilters: DietaryFilter[]
  onDietaryFiltersChange: (filters: DietaryFilter[]) => void
  sortBy: SortOption
  onSortByChange: (sort: SortOption) => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
}

export function FilterBar({
  dietaryFilters,
  onDietaryFiltersChange,
  sortBy,
  onSortByChange,
  searchQuery,
  onSearchQueryChange,
}: FilterBarProps) {
  const toggleDietaryFilter = (filter: DietaryFilter) => {
    if (dietaryFilters.includes(filter)) {
      onDietaryFiltersChange(dietaryFilters.filter((f) => f !== filter))
    } else {
      onDietaryFiltersChange([...dietaryFilters, filter])
    }
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for meals..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {dietaryFilters.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {dietaryFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Dietary Preferences</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {dietaryOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={dietaryFilters.includes(option.value)}
                  onCheckedChange={() => toggleDietaryFilter(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => onSortByChange(value as SortOption)}>
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {dietaryFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {dietaryFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => toggleDietaryFilter(filter)}
            >
              {dietaryOptions.find((o) => o.value === filter)?.label}
              <span className="ml-1">×</span>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => onDietaryFiltersChange([])}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
