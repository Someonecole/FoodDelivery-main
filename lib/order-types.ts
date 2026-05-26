export type OrderStatus = "preparing" | "on-the-way" | "delivered"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface CustomerInfo {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
  notes: string
}

export interface OrderData {
  orderId: string
  userId?: string | null
  userEmail?: string | null
  items: OrderItem[]
  totalPrice: number
  deliveryFee: number
  grandTotal: number
  customerInfo: CustomerInfo
  orderDate: string
  status: OrderStatus
  createdAt?: unknown
  updatedAt?: unknown
}

export const deliveryFee = 3.99
