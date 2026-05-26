import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import type { OrderData } from "@/lib/order-types"

export async function GET(request: Request) {
  const db = await getDb()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const filter = userId ? { userId } : {}

  const orders = await db
    .collection<OrderData>("orders")
    .find(filter)
    .sort({ createdAt: -1, orderDate: -1 })
    .limit(50)
    .toArray()

  return NextResponse.json(orders.map(({ _id, ...order }) => order))
}

export async function POST(request: Request) {
  const db = await getDb()
  const body = (await request.json()) as OrderData

  if (!body.orderId || !body.items?.length || !body.customerInfo) {
    return NextResponse.json({ error: "Invalid order data" }, { status: 400 })
  }

  const now = new Date()
  const order: OrderData = {
    orderId: body.orderId,
    userId: body.userId ?? null,
    userEmail: body.userEmail ?? body.customerInfo.email ?? null,
    items: body.items,
    totalPrice: Number(body.totalPrice),
    deliveryFee: Number(body.deliveryFee),
    grandTotal: Number(body.grandTotal),
    customerInfo: body.customerInfo,
    orderDate: body.orderDate || now.toISOString(),
    status: body.status || "preparing",
    updatedAt: now,
  }

  await db.collection<OrderData>("orders").updateOne(
    { orderId: body.orderId },
    {
      $set: order,
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  )

  return NextResponse.json({ ok: true, orderId: body.orderId })
}
