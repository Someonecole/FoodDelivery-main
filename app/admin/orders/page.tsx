"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { listenToRecentOrders, updateOrderStatus, type OrderData, type OrderStatus } from "@/lib/orders"

const statusLabels: Record<OrderStatus, string> = {
  preparing: "Preparing",
  "on-the-way": "On the Way",
  delivered: "Delivered",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = listenToRecentOrders(
      (recentOrders) => {
        setOrders(recentOrders)
        setIsLoading(false)
      },
      (loadError) => {
        console.error("Failed to load orders", loadError)
        setError("Could not load orders. Check your MongoDB connection.")
        setIsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setSavingOrderId(orderId)
    setError("")

    try {
      await updateOrderStatus(orderId, status)
    } catch (updateError) {
      console.error("Failed to update order", updateError)
      setError("Could not update order status. Check your MongoDB connection.")
    } finally {
      setSavingOrderId(null)
    }
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Orders</h1>
            <p className="text-muted-foreground">Recent orders saved in MongoDB.</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Store</Button>
          </Link>
        </div>

        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">Loading orders...</CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">No orders found.</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.orderId}>
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle>{order.orderId}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.customerInfo.fullName} • {order.customerInfo.phone}
                      </p>
                    </div>
                    <Badge>{statusLabels[order.status]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">Delivery Address</p>
                      <p className="text-muted-foreground">{order.customerInfo.address}</p>
                      <p className="text-muted-foreground">
                        {order.customerInfo.city}, {order.customerInfo.zipCode}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Items</p>
                      <p className="text-muted-foreground">
                        {order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Total</p>
                      <p className="text-muted-foreground">${(order.grandTotal ?? order.totalPrice + 3.99).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t pt-4">
                    <Link href={`/track-order?orderId=${order.orderId}`} className="text-sm text-primary hover:underline">
                      Open tracking page
                    </Link>

                    <div className="flex items-center gap-2">
                      <label htmlFor={`status-${order.orderId}`} className="text-sm font-medium">
                        Status
                      </label>
                      <select
                        id={`status-${order.orderId}`}
                        value={order.status}
                        disabled={savingOrderId === order.orderId}
                        onChange={(event) => handleStatusChange(order.orderId, event.target.value as OrderStatus)}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="preparing">Preparing</option>
                        <option value="on-the-way">On the Way</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
