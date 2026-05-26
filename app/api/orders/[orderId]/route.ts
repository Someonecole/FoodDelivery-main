import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import type { OrderData, OrderStatus } from "@/lib/order-types"

const allowedStatuses: OrderStatus[] = ["preparing", "on-the-way", "delivered"]

export async function GET(_request: Request, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params
  const db = await getDb()
  const order = await db.collection<OrderData>("orders").findOne({ orderId })

  if (!order) {
    return NextResponse.json(null, { status: 404 })
  }

  const { _id, ...cleanOrder } = order
  return NextResponse.json(cleanOrder)
}

export async function PATCH(request: Request, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params
  const { status } = await request.json()

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid order status" }, { status: 400 })
  }

  const db = await getDb()
  const result = await db.collection<OrderData>("orders").updateOne(
    { orderId },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
