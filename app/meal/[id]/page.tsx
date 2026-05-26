"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Clock, Flame, Minus, Plus, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { foodProducts } from "@/lib/food-data"
import { useCart } from "@/lib/cart-context"

const dietaryLabels: Record<string, { label: string; color: string }> = {
  vegetarian: { label: "Vegetarian", color: "bg-green-100 text-green-800 border-green-200" },
  vegan: { label: "Vegan", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  "gluten-free": { label: "Gluten-Free", color: "bg-amber-100 text-amber-800 border-amber-200" },
  "dairy-free": { label: "Dairy-Free", color: "bg-blue-100 text-blue-800 border-blue-200" },
  halal: { label: "Halal", color: "bg-purple-100 text-purple-800 border-purple-200" },
  spicy: { label: "Spicy", color: "bg-red-100 text-red-800 border-red-200" },
}

export default function MealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  const product = foodProducts.find((p) => p.id === params.id)

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Meal not found</h1>
          <Button asChild>
            <Link href="/">Back to Menu</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.dietary.includes("spicy") && (
                <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-sm px-3 py-1">
                  <Flame className="h-4 w-4 mr-1" />
                  Spicy
                </Badge>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="flex-1">
              <p className="text-sm text-primary font-medium mb-2">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{product.prepTime} min prep time</span>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{product.longDescription}</p>

              {/* Dietary Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.dietary.map((diet) => (
                  <Badge
                    key={diet}
                    variant="outline"
                    className={`text-sm px-3 py-1 ${dietaryLabels[diet]?.color || ""}`}
                  >
                    {dietaryLabels[diet]?.label || diet}
                  </Badge>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Ingredients */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient) => (
                    <Badge key={ingredient} variant="secondary" className="text-sm px-3 py-1">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Nutrition Info */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Nutrition Information</h2>
                <div className="grid grid-cols-4 gap-3">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{product.nutritionInfo.calories}</p>
                      <p className="text-sm text-muted-foreground">Calories</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{product.nutritionInfo.protein}g</p>
                      <p className="text-sm text-muted-foreground">Protein</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{product.nutritionInfo.carbs}g</p>
                      <p className="text-sm text-muted-foreground">Carbs</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{product.nutritionInfo.fat}g</p>
                      <p className="text-sm text-muted-foreground">Fat</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <Card className="sticky bottom-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button className="w-full h-12 text-lg" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
