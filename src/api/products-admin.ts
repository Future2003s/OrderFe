/**
 * Products Admin API
 * CRUD operations for product management
 */

import { apiClient } from "@/lib/api-client"
import { apiConfig } from "@/config/api"

export interface AdminProduct {
  _id: string
  name: string
  slug?: string
  price: number
  currency?: string
  sku: string
  category: string | { _id: string; name: string }
  description?: string
  shortDescription?: string
  ingredients?: string
  nutrition?: {
    energyKcal?: number
    proteinG?: number
    fatG?: number
    totalSugarG?: number
    sugarRangeG?: string
    sodiumMg?: number
  }
  volumeMl?: number
  supervisedBy?: string
  claims?: string[]
  images?: Array<{
    url: string
    alt?: string
    isMain: boolean
    order: number
  }>
  tags?: string[]
  status?: "draft" | "active" | "archived"
  isVisible?: boolean
  isFeatured?: boolean
  quantity?: number
  trackQuantity?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateProductData {
  name: string
  slug?: string
  price: number
  currency?: string
  sku: string
  category: string
  description?: string
  shortDescription?: string
  ingredients?: string
  nutrition?: {
    energyKcal?: number
    proteinG?: number
    fatG?: number
    totalSugarG?: number
    sugarRangeG?: string
    sodiumMg?: number
  }
  volumeMl?: number
  supervisedBy?: string
  claims?: string[]
  images?: Array<{
    url: string
    alt?: string
    isMain: boolean
    order: number
  }>
  tags?: string[]
  status?: "draft" | "active" | "archived"
  isVisible?: boolean
  isFeatured?: boolean
  quantity?: number
  trackQuantity?: boolean
}

/**
 * Get all products with filters and pagination
 */
export async function getAdminProducts(params?: {
  page?: number
  limit?: number
  search?: string
  category?: string
  brand?: string
  status?: string
  isVisible?: boolean
}): Promise<{ products: AdminProduct[]; pagination?: any }> {
  try {
    const queryParams: Record<string, any> = {
      ...params,
    }
    
    // Remove undefined values
    Object.keys(queryParams).forEach(
      (key) => queryParams[key] === undefined && delete queryParams[key]
    )
    
    const response = await fetch(
      `${apiConfig.endpoints.productsAdmin.list}?${new URLSearchParams(queryParams as any).toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      if (Array.isArray(data.data)) {
        return {
          products: data.data,
        }
      }
      if (data.data && "products" in data.data) {
        return {
          products: data.data.products,
          pagination: data.data.pagination,
        }
      }
    }

    return { products: [] }
  } catch (error) {
    console.error("Error fetching admin products:", error)
    return { products: [] }
  }
}

/**
 * Get single product by ID or slug
 */
export async function getAdminProductById(id: string, token?: string): Promise<AdminProduct | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(apiConfig.endpoints.productsAdmin.getById(id), {
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    return null
  } catch (error) {
    console.error("Error fetching admin product:", error)
    return null
  }
}

/**
 * Create new product
 */
export async function createAdminProduct(
  productData: CreateProductData,
  token: string
): Promise<AdminProduct | null> {
  try {
    const response = await fetch(apiConfig.endpoints.productsAdmin.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create product")
    }

    const data = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    return null
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

/**
 * Update product
 */
export async function updateAdminProduct(
  productId: string,
  productData: Partial<CreateProductData>,
  token: string
): Promise<AdminProduct | null> {
  try {
    const response = await fetch(apiConfig.endpoints.productsAdmin.update(productId), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update product")
    }

    const data = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    return null
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

/**
 * Delete product
 */
export async function deleteAdminProduct(
  productId: string,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(apiConfig.endpoints.productsAdmin.delete(productId), {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete product")
    }

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

/**
 * Upload product image
 * @param file - File object from input
 * @param token - Authentication token
 * @returns Uploaded image URL and public_id
 */
export async function uploadProductImage(
  file: File,
  token: string
): Promise<{ url: string; public_id: string }> {
  try {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch(apiConfig.endpoints.productsAdmin.uploadImage, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to upload image")
    }

    const data = await response.json()
    
    if (data.success && data.data) {
      return {
        url: data.data.url,
        public_id: data.data.public_id,
      }
    }
    
    throw new Error("Invalid response from upload endpoint")
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}
