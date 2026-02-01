import { apiClient } from "@/lib/api-client"

export interface BackendCartItem {
  product: string | {
    _id: string
    name: string
    price: number
    images: Array<{ url: string }>
  }
  quantity: number
  price: number
}

export interface BackendCart {
  _id: string
  items: BackendCartItem[]
  totalItems: number
  totalPrice: number
  currency: string
}

// Note: Cart is managed by Zustand store in Frontend
// This API integration is optional - can sync with backend if needed
// For now, we keep using Zustand store for simplicity

export async function syncCartToBackend(items: Array<{ productId: string; quantity: number }>): Promise<void> {
  try {
    // Get or create session ID
    let sessionId = typeof window !== "undefined" ? localStorage.getItem("sessionId") : null
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      if (typeof window !== "undefined") {
        localStorage.setItem("sessionId", sessionId)
      }
    }

    // Sync each item to backend cart
    for (const item of items) {
      await apiClient.post("/cart/items", {
        productId: item.productId,
        quantity: item.quantity,
      })
    }
  } catch (error) {
    console.error("Error syncing cart to backend:", error)
    // Silently fail - cart still works locally
  }
}

export async function getBackendCart(): Promise<BackendCart | null> {
  try {
    const sessionId = typeof window !== "undefined" ? localStorage.getItem("sessionId") : null
    if (!sessionId) return null

    const response = await apiClient.get<BackendCart>("/cart")

    return response.data || null
  } catch (error) {
    console.error("Error fetching backend cart:", error)
    return null
  }
}

