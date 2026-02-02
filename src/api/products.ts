import { apiClient } from "@/lib/api-client"

export interface BackendProduct {
  _id: string
  name: string
  description?: string
  shortDescription?: string
  price: number
  comparePrice?: number
  images: Array<{
    url: string
    alt?: string
    isMain: boolean
    order: number
  }>
  tags: string[]
  quantity: number
  averageRating: number
  reviewCount: number
  status: string
  isVisible: boolean
  isFeatured: boolean
  onSale: boolean
  salePrice?: number
  sku: string
}

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAt?: number
  images: string[]
  shortDesc: string
  desc: string
  tags: string[]
  stock: number
  rating: number
  soldCount: number
}

function mapBackendProductToFrontend(backendProduct: BackendProduct): Product {
  // Generate slug from name
  const slug = backendProduct.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  // Get images, sorted by order, main image first
  const sortedImages = [...(backendProduct.images || [])].sort((a, b) => {
    if (a.isMain) return -1
    if (b.isMain) return 1
    return a.order - b.order
  })
  const images = sortedImages.length > 0
    ? sortedImages.map((img) => img.url)
    : ["https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop"]

  // Use salePrice if onSale, otherwise use price
  const finalPrice = backendProduct.onSale && backendProduct.salePrice
    ? backendProduct.salePrice
    : backendProduct.price

  return {
    id: backendProduct._id,
    name: backendProduct.name,
    slug,
    price: finalPrice,
    compareAt: backendProduct.comparePrice && backendProduct.comparePrice > finalPrice
      ? backendProduct.comparePrice
      : undefined,
    images,
    shortDesc: backendProduct.shortDescription || backendProduct.description?.slice(0, 100) || "",
    desc: backendProduct.description || "",
    tags: backendProduct.tags || [],
    stock: backendProduct.quantity || 0,
    rating: backendProduct.averageRating || 5,
    soldCount: backendProduct.reviewCount || 0,
  }
}

export async function getProducts(params?: {
  page?: number
  limit?: number
  search?: string
  tags?: string
  isFeatured?: boolean
  isVisible?: boolean
}): Promise<{ products: Product[]; pagination?: any }> {
  try {
    const queryParams: Record<string, any> = {
      ...params,
      isVisible: params?.isVisible ?? true,
      status: "active",
    }
    
    // Remove undefined values
    Object.keys(queryParams).forEach(
      (key) => queryParams[key] === undefined && delete queryParams[key]
    )
    
    const response = await apiClient.get<BackendProduct[] | { products: BackendProduct[]; pagination: any }>(
      "/products",
      queryParams
    )

    if (Array.isArray(response.data)) {
      return {
        products: response.data.map(mapBackendProductToFrontend),
      }
    }

    if (response.data && "products" in response.data) {
      return {
        products: response.data.products.map(mapBackendProductToFrontend),
        pagination: response.data.pagination,
      }
    }

    return { products: [] }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { products: [] }
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await apiClient.get<BackendProduct>(`/products/${id}`)
    if (response.data) {
      return mapBackendProductToFrontend(response.data)
    }
    return null
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get<BackendProduct[] | { products: BackendProduct[] }>(
      "/products/featured"
    )

    if (Array.isArray(response.data)) {
      return response.data.map(mapBackendProductToFrontend)
    }

    if (response.data && "products" in response.data) {
      return response.data.products.map(mapBackendProductToFrontend)
    }

    return []
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await apiClient.get<BackendProduct[] | { products: BackendProduct[] }>(
      "/products/search",
      { search: query }
    )

    if (Array.isArray(response.data)) {
      return response.data.map(mapBackendProductToFrontend)
    }

    if (response.data && "products" in response.data) {
      return response.data.products.map(mapBackendProductToFrontend)
    }

    return []
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}

/**
 * Get "Nước Cốt Vải 100% Thanh Hà" product specifically
 * Dedicated endpoint for this specific product
 */
export async function getNuocCotVai100Product(): Promise<Product | null> {
  try {
    const response = await apiClient.get<BackendProduct>(
      "/products/nuoc-cot-vai-100"
    )
    
    if (response.data) {
      return mapBackendProductToFrontend(response.data)
    }
    
    return null
  } catch (error) {
    console.error("Error fetching Nuoc Cot Vai 100 product:", error)
    return null
  }
}
