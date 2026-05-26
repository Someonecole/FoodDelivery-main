"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/lib/cart-context"
import { createOrder, deliveryFee } from "@/lib/orders"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user, profile, updateUserProfile } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orderError, setOrderError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!profile && !user) {
      return
    }

    setFormData((currentFormData) => ({
      fullName: currentFormData.fullName || profile?.fullName || user?.displayName || "",
      email: currentFormData.email || profile?.email || user?.email || "",
      phone: currentFormData.phone || profile?.phone || "",
      address: currentFormData.address || profile?.address || "",
      city: currentFormData.city || profile?.city || "",
      zipCode: currentFormData.zipCode || profile?.zipCode || "",
      notes: currentFormData.notes,
    }))
  }, [profile, user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be at least 10 digits"
    }
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOrderError("")

    if (items.length === 0 || isSubmitting) {
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const orderId = `ORD-${Date.now()}`
      const orderItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }))
      const orderData = {
        orderId,
        userId: user?.uid ?? null,
        userEmail: user?.email ?? formData.email,
        items: orderItems,
        totalPrice,
        deliveryFee,
        grandTotal: totalPrice + deliveryFee,
        customerInfo: formData,
        orderDate: new Date().toISOString(),
        status: "preparing" as const,
      }

      if (user) {
        await updateUserProfile({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        })
      }

      await createOrder(orderData)
      clearCart()
      router.push(`/track-order?orderId=${orderId}`)
    } catch (error) {
      console.error("Failed to place order", error)
      setOrderError("Could not place order. Check your MongoDB connection and try again.")
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some items to your cart before checking out.</p>
              <Link href="/">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Delivery Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street, Apt 4B"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">
                        ZIP Code <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className={errors.zipCode ? "border-destructive" : ""}
                      />
                      {errors.zipCode && <p className="text-xs text-destructive">{errors.zipCode}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions for delivery..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {orderError && <p className="text-sm text-destructive">{orderError}</p>}

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Placing Order..." : `Place Order - $${totalPrice.toFixed(2)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-tight">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">${(totalPrice + deliveryFee).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
