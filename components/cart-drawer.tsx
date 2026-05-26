"use client"

import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    onOpenChange(false)
    router.push("/checkout")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({items.length} {items.length === 1 ? "item" : "items"})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">Add some delicious food to get started!</p>
            <Button onClick={() => onOpenChange(false)}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-tight mb-1">{item.name}</h4>
                      <p className="text-sm text-primary font-semibold mb-2">${item.price.toFixed(2)}</p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col gap-4 border-t pt-4">
              <div className="flex items-center justify-between w-full text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
