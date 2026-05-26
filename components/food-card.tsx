"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Flame, Eye } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { FoodProduct } from "@/lib/food-data"
import { useCart } from "@/lib/cart-context"

interface FoodCardProps {
  product: FoodProduct
}

export function FoodCard({ product }: FoodCardProps) {
  const { addToCart } = useCart()

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        {product.dietary.includes("spicy") && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            <Flame className="h-3 w-3 mr-1" />
            Spicy
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight mb-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
          </div>
          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span>({product.reviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{product.prepTime} min</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {product.dietary.slice(0, 3).map((diet) => (
            <Badge key={diet} variant="outline" className="text-xs px-2 py-0">
              {diet === "gluten-free"
                ? "GF"
                : diet === "dairy-free"
                  ? "DF"
                  : diet === "vegetarian"
                    ? "V"
                    : diet === "vegan"
                      ? "VG"
                      : diet === "halal"
                        ? "H"
                        : diet}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1 bg-transparent" asChild>
          <Link href={`/meal/${product.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
        <Button className="flex-1" onClick={() => addToCart(product)}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
