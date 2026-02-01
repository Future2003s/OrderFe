import { apiClient } from "@/lib/api-client"

export interface BackendOrder {
  _id: string
  orderNumber: string
  items: Array<{
    product?: string
    name: string
    sku: string
    quantity: number
    price: number
    image?: string
  }>
  shippingAddress: {
    firstName: string
    lastName: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    phone?: string
  }
  payment: {
    method: string
    status: string
  }
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"
  statusHistory: Array<{
    status: string
    updatedAt: string
    note?: string
  }>
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  customerNotes?: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  code: string
  status: "pending" | "confirmed" | "shipping" | "delivered"
  customerName: string
  phone: string
  address: string
  note?: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  total: number
  createdAt: string
  updatedAt: string
}

function mapBackendOrderToFrontend(backendOrder: BackendOrder): Order {
  // Map status
  const statusMap: Record<string, "pending" | "confirmed" | "shipping" | "delivered"> = {
    pending: "pending",
    confirmed: "confirmed",
    processing: "confirmed",
    shipped: "shipping",
    delivered: "delivered",
    cancelled: "pending",
    returned: "pending",
  }

  const mappedStatus = statusMap[backendOrder.status] || "pending"

  // Combine address
  const address = `${backendOrder.shippingAddress.street}, ${backendOrder.shippingAddress.city}, ${backendOrder.shippingAddress.state}`

  return {
    code: backendOrder.orderNumber,
    status: mappedStatus,
    customerName: `${backendOrder.shippingAddress.firstName} ${backendOrder.shippingAddress.lastName}`.trim(),
    phone: backendOrder.shippingAddress.phone || "",
    address,
    note: backendOrder.customerNotes,
    items: backendOrder.items.map((item) => ({
      productId: item.product || "",
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    total: backendOrder.total,
    createdAt: backendOrder.createdAt,
    updatedAt: backendOrder.updatedAt,
  }
}

export async function createOrder(data: {
  customerName: string
  phone: string
  address: string
  note?: string
  paymentMethod: string
  items: Array<{
    productId: string
    quantity: number
  }>
}): Promise<{ code: string }> {
  try {
    // Parse address into shipping address format
    const addressParts = data.address.split(",").map((s) => s.trim())
    const street = addressParts[0] || data.address
    const city = addressParts[1] || "Hải Phòng"
    const state = addressParts[2] || "Hải Phòng"

    // Split customer name
    const nameParts = data.customerName.trim().split(" ")
    const firstName = nameParts[0] || "Customer"
    const lastName = nameParts.slice(1).join(" ") || ""

    const orderData = {
      items: data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      customer: {
        fullName: data.customerName,
        phone: data.phone,
        address: data.address,
        note: data.note,
      },
      shippingAddress: {
        firstName,
        lastName,
        street,
        city,
        state,
        zipCode: "000000",
        country: "Việt Nam",
        phone: data.phone,
      },
      paymentMethod: data.paymentMethod === "cod" ? "cash_on_delivery" : data.paymentMethod,
      notes: data.note,
    }

    const response = await apiClient.post<BackendOrder>("/orders/guest", orderData)

    if (response.data) {
      return { code: response.data.orderNumber }
    }

    throw new Error("Failed to create order")
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function getOrderByCode(code: string): Promise<Order | null> {
  try {
    // Backend uses orderNumber, try to search by it
    // First try direct lookup by orderNumber
    const response = await apiClient.get<BackendOrder>(`/orders/${code}`)
    if (response.data) {
      return mapBackendOrderToFrontend(response.data)
    }
    
    // If not found, try to search in orders (might need to implement search endpoint)
    // For now, return null and let the UI handle it
    return null
  } catch (error) {
    console.error("Error fetching order:", error)
    // Fallback: check localStorage for mock orders
    if (typeof window !== "undefined") {
      const orders = JSON.parse(localStorage.getItem("mock-orders") || "[]") as Order[]
      return orders.find((o) => o.code === code) || null
    }
    return null
  }
}

export async function getOrderTracking(code: string): Promise<Order | null> {
  try {
    // Try to get order by orderNumber
    const response = await apiClient.get<BackendOrder>(`/orders/${code}/tracking`)
    if (response.data) {
      return mapBackendOrderToFrontend(response.data)
    }
    return null
  } catch (error) {
    // Fallback: try to get order directly
    return getOrderByCode(code)
  }
}
