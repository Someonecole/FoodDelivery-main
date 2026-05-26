import { deliveryFee, type OrderData, type OrderStatus } from "@/lib/order-types"

export { deliveryFee }
export type { OrderData, OrderStatus }

type Unsubscribe = () => void

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function createOrder(orderData: OrderData) {
  await fetchJson<{ ok: boolean; orderId: string }>("/api/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  })
}

function poll(callback: () => Promise<void>, onError?: (error: Error) => void): Unsubscribe {
  let active = true

  const run = async () => {
    if (!active) return

    try {
      await callback()
    } catch (error) {
      onError?.(error as Error)
    }
  }

  void run()
  const intervalId = window.setInterval(run, 5000)

  return () => {
    active = false
    window.clearInterval(intervalId)
  }
}

export function listenToOrder(
  orderId: string,
  onOrder: (order: OrderData | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return poll(async () => {
    try {
      const order = await fetchJson<OrderData>(`/api/orders/${encodeURIComponent(orderId)}`)
      onOrder(order)
    } catch (error) {
      if ((error as Error).message.includes("404")) {
        onOrder(null)
        return
      }

      throw error
    }
  }, onError)
}

export function listenToRecentOrders(
  onOrders: (orders: OrderData[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return poll(async () => {
    const orders = await fetchJson<OrderData[]>("/api/orders")
    onOrders(orders)
  }, onError)
}

export function listenToUserOrders(
  userId: string,
  onOrders: (orders: OrderData[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return poll(async () => {
    const orders = await fetchJson<OrderData[]>(`/api/orders?userId=${encodeURIComponent(userId)}`)
    onOrders(orders)
  }, onError)
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await fetchJson<{ ok: boolean }>(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}
