"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Truck, UtensilsCrossed, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { listenToOrder, type OrderData } from "@/lib/orders"

const orderStatuses = [
  { key: "preparing", label: "Preparing", icon: UtensilsCrossed },
  { key: "on-the-way", label: "On the Way", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
] as const

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadError("")

    const unsubscribe = listenToOrder(
      orderId,
      (order) => {
        setOrderData(order)
        setIsLoading(false)
      },
      (error) => {
        console.error("Failed to load order", error)
        setLoadError("Could not load order. Check your MongoDB connection.")
        setIsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [orderId])

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading order details...</p>
        </div>
      </main>
    )
  }

  if (!orderId || !orderData) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
              <p className="text-muted-foreground mb-6">{loadError || "We could not find an order with this ID."}</p>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const currentStatusIndex = Math.max(
    0,
    orderStatuses.findIndex((status) => status.key === orderData.status),
  )
  const grandTotal = orderData.grandTotal ?? orderData.totalPrice + 3.99
  const deliveryFee = orderData.deliveryFee ?? 3.99

  return (
    <main className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">Order ID: {orderData.orderId}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {orderStatuses.map((status, index) => {
                      const Icon = status.icon
                      const isCompleted = index <= currentStatusIndex
                      const isCurrent = index === currentStatusIndex

                      return (
                        <div key={status.key} className="relative flex items-start gap-4 pb-8 last:pb-0">
                          {index < orderStatuses.length - 1 && (
                            <div
                              className={`absolute left-5 top-12 w-0.5 h-full -ml-px ${
                                isCompleted ? "bg-primary" : "bg-muted"
                              }`}
                            />
                          )}

                          <div
                            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                              isCompleted
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted bg-background text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="flex-1 pt-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className={`font-semibold ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {status.label}
                              </h3>
                              {isCurrent && <Badge>In Progress</Badge>}
                              {isCompleted && index < currentStatusIndex && (
                                <Badge variant="secondary">Completed</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {status.key === "preparing" && "Your food is being prepared by our kitchen team"}
                              {status.key === "on-the-way" && "Your order is on its way to your delivery address"}
                              {status.key === "delivered" && "Your order has been delivered successfully"}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderData.items.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${orderData.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2">
                      <span>Total</span>
                      <span className="text-primary">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Customer</p>
                    <p className="text-sm text-muted-foreground">{orderData.customerInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Contact</p>
                    <p className="text-sm text-muted-foreground">{orderData.customerInfo.phone}</p>
                    <p className="text-sm text-muted-foreground">{orderData.customerInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Address</p>
                    <p className="text-sm text-muted-foreground">{orderData.customerInfo.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {orderData.customerInfo.city}, {orderData.customerInfo.zipCode}
                    </p>
                  </div>
                  {orderData.customerInfo.notes && (
                    <div>
                      <p className="text-sm font-medium mb-1">Delivery Notes</p>
                      <p className="text-sm text-muted-foreground">{orderData.customerInfo.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Estimated Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-1">25-35 min</p>
                  <p className="text-sm text-muted-foreground">Your order status updates from MongoDB</p>
                </CardContent>
              </Card>

              <Link href="/" className="block">
                <Button className="w-full bg-transparent" variant="outline">
                  Order More Food
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen">
          <Header />
          <div className="container mx-auto px-4 py-12 text-center">
            <p>Loading order details...</p>
          </div>
        </main>
      }
    >
      <TrackOrderContent />
    </Suspense>
  )
}
