"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { listenToUserOrders, type OrderData, type OrderStatus } from "@/lib/orders"

const statusLabels: Record<OrderStatus, string> = {
  preparing: "Preparing",
  "on-the-way": "On the Way",
  delivered: "Delivered",
}

export default function AccountPage() {
  const { user, profile, loading, updateUserProfile, logOut } = useAuth()
  const [orders, setOrders] = useState<OrderData[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  })

  useEffect(() => {
    if (!profile && !user) {
      return
    }

    setFormData({
      fullName: profile?.fullName || user?.displayName || "",
      email: profile?.email || user?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      city: profile?.city || "",
      zipCode: profile?.zipCode || "",
    })
  }, [profile, user])

  useEffect(() => {
    if (!user) {
      setOrders([])
      return
    }

    setOrdersLoading(true)
    const unsubscribe = listenToUserOrders(
      user.uid,
      (userOrders) => {
        setOrders(userOrders)
        setOrdersLoading(false)
      },
      (loadError) => {
        console.error("Failed to load account orders", loadError)
        setError("Could not load your orders. Check your MongoDB connection.")
        setOrdersLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user])

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage("")
    setError("")

    if (!formData.fullName.trim()) {
      setError("Full name is required.")
      return
    }

    setIsSaving(true)

    try {
      await updateUserProfile({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        zipCode: formData.zipCode.trim(),
      })
      setMessage("Account saved.")
    } catch (saveError) {
      console.error("Failed to save account", saveError)
      setError("Could not save account. Check your MongoDB connection.")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">Loading account...</div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-muted/30">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent>
              <h1 className="text-2xl font-semibold mb-4">Sign in required</h1>
              <p className="text-muted-foreground mb-6">Sign in or create an account to save your delivery details.</p>
              <Link href="/login">
                <Button>Sign in</Button>
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Profile data is saved in MongoDB.</p>
          </div>
          <Button variant="outline" onClick={() => void logOut()}>
            Sign out
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Saved Delivery Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} disabled />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(event) => setFormData({ ...formData, city: event.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(event) => setFormData({ ...formData, zipCode: event.target.value })}
                      />
                    </div>
                  </div>

                  {message && <p className="text-sm text-primary">{message}</p>}
                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <p className="text-sm text-muted-foreground">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No saved account orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.orderId} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <p className="font-medium text-sm">{order.orderId}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge>{statusLabels[order.status]}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          ${(order.grandTotal ?? order.totalPrice + 3.99).toFixed(2)} • {order.items.length} item
                          {order.items.length === 1 ? "" : "s"}
                        </p>
                        <Link href={`/track-order?orderId=${order.orderId}`} className="text-sm text-primary hover:underline">
                          Track order
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
