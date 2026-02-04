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
    price?: number
    name?: string
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

    // Prepare items with required fields for validation
    // Backend will recalculate prices from products, but we include them for validation
    const itemsWithDetails = data.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price || 0, // Will be recalculated by backend
      name: item.name || "Product", // Will be replaced by backend
    }))

    const orderData = {
      items: itemsWithDetails,
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

    if (response.success && response.data) {
      return { code: response.data.orderNumber }
    }

    // Handle error response
    const errorMessage = response.message || "Failed to create order"
    throw new Error(errorMessage)
  } catch (error: any) {
    console.error("Error creating order:", error)
    
    // Extract error message from API response
    let errorMessage = "Đặt hàng thất bại. Vui lòng thử lại."
    
    if (error.message) {
      errorMessage = error.message
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (typeof error === "string") {
      errorMessage = error
    }
    
    throw new Error(errorMessage)
  }
}

export async function getOrderByCode(code: string): Promise<Order | null> {
  try {
    if (!code || !code.trim()) {
      return null
    }

    // Backend uses orderNumber, try to search by it using public endpoint
    // First try the public endpoint for orderNumber lookup
    const orderNumber = code.toUpperCase().trim()
    
    try {
      const response = await apiClient.get<BackendOrder>(`/orders/number/${encodeURIComponent(orderNumber)}`)
      if (response.success && response.data) {
        return mapBackendOrderToFrontend(response.data)
      }
    } catch (numberError: any) {
      // If orderNumber endpoint fails (404), try by ID (might be ObjectId)
      // Check if code looks like ObjectId (24 hex characters)
      const objectIdPattern = /^[0-9a-fA-F]{24}$/
      if (objectIdPattern.test(code.trim())) {
        try {
          const response = await apiClient.get<BackendOrder>(`/orders/${code.trim()}`)
          if (response.success && response.data) {
            return mapBackendOrderToFrontend(response.data)
          }
        } catch (idError: any) {
          // If both fail, return null
          console.error("Error fetching order by ID:", idError)
        }
      } else {
        // Not an ObjectId and orderNumber lookup failed
        console.error("Error fetching order by number:", numberError)
      }
    }
    
    return null
  } catch (error: any) {
    console.error("Error fetching order:", error)
    // Fallback: check localStorage for mock orders
    if (typeof window !== "undefined") {
      try {
        const orders = JSON.parse(localStorage.getItem("mock-orders") || "[]") as Order[]
        return orders.find((o) => o.code === code.toUpperCase()) || null
      } catch (e) {
        // Ignore localStorage errors
      }
    }
    return null
  }
}

export async function getOrderTracking(code: string): Promise<Order | null> {
  try {
    // First try to get order by code (which uses the public endpoint)
    const order = await getOrderByCode(code)
    if (order) {
      return order
    }
    
    // If not found by code, try tracking endpoint (requires auth, might fail)
    try {
      const response = await apiClient.get<BackendOrder>(`/orders/${code}/tracking`)
      if (response.success && response.data) {
        return mapBackendOrderToFrontend(response.data)
      }
    } catch (trackingError) {
      // Tracking endpoint might require auth, fallback to null
      console.error("Error fetching order tracking:", trackingError)
    }
    
    return null
  } catch (error) {
    console.error("Error in getOrderTracking:", error)
    return null
  }
}
