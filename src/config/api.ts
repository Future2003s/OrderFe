/**
 * Global API Configuration
 * 
 * This file centralizes all API endpoint configurations.
 * To change API endpoints, update the environment variables or modify the defaults here.
 */

/**
 * Main API base URL for standard API endpoints (orders, products, auth, etc.)
 * Default: http://localhost:8081/api/v1
 * 
 * Environment variable: NEXT_PUBLIC_API_URL
 */
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  "http://localhost:8081/api/v1"

/**
 * Products CRUD API base URL (for admin product management)
 * Default: http://localhost:8081/products
 * 
 * Environment variable: NEXT_PUBLIC_PRODUCTS_API_URL
 */
export const PRODUCTS_API_BASE_URL = 
  process.env.NEXT_PUBLIC_PRODUCTS_API_URL || 
  "http://localhost:8081/products"

/**
 * API Configuration object
 * Use this to access all API endpoints in a centralized way
 */
export const apiConfig = {
  /**
   * Main API base URL
   */
  baseURL: API_BASE_URL,
  
  /**
   * Products CRUD API base URL
   */
  productsBaseURL: PRODUCTS_API_BASE_URL,
  
  /**
   * API endpoints
   */
  endpoints: {
    // Auth endpoints
    auth: {
      login: `${API_BASE_URL}/auth/login`,
      me: `${API_BASE_URL}/auth/me`,
    },
    
    // Product endpoints
    products: {
      list: `${API_BASE_URL}/products`,
      getById: (id: string) => `${API_BASE_URL}/products/${id}`,
      getBySlug: (slug: string) => `${API_BASE_URL}/products/${slug}`,
      featured: `${API_BASE_URL}/products/featured`,
      search: `${API_BASE_URL}/products/search`,
      nuocCotVai100: `${API_BASE_URL}/products/nuoc-cot-vai-100`,
    },
    
    // Products Admin endpoints (CRUD)
    productsAdmin: {
      list: PRODUCTS_API_BASE_URL,
      getById: (id: string) => `${PRODUCTS_API_BASE_URL}/${id}`,
      create: PRODUCTS_API_BASE_URL,
      update: (id: string) => `${PRODUCTS_API_BASE_URL}/${id}`,
      delete: (id: string) => `${PRODUCTS_API_BASE_URL}/${id}`,
      uploadImage: `${API_BASE_URL}/products/images`,
    },
    
    // Order endpoints
    orders: {
      create: `${API_BASE_URL}/orders/guest`,
      getByCode: (code: string) => `${API_BASE_URL}/orders/number/${code}`,
      getById: (id: string) => `${API_BASE_URL}/orders/${id}`,
      track: (code: string) => `${API_BASE_URL}/orders/${code}/tracking`,
    },
    
    // Cart endpoints
    cart: {
      get: `${API_BASE_URL}/cart`,
      addItem: `${API_BASE_URL}/cart/items`,
      updateItem: (productId: string) => `${API_BASE_URL}/cart/items/${productId}`,
      removeItem: (productId: string) => `${API_BASE_URL}/cart/items/${productId}`,
      clear: `${API_BASE_URL}/cart/clear`,
    },
  },
}

/**
 * Helper function to get full API URL
 * @param endpoint - API endpoint path (e.g., "/products", "/auth/login")
 * @returns Full API URL
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint
  return `${API_BASE_URL}/${cleanEndpoint}`
}

/**
 * Helper function to get Products Admin API URL
 * @param endpoint - API endpoint path (e.g., "123", "123/images")
 * @returns Full Products Admin API URL
 */
export function getProductsApiUrl(endpoint: string = ""): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint
  return cleanEndpoint ? `${PRODUCTS_API_BASE_URL}/${cleanEndpoint}` : PRODUCTS_API_BASE_URL
}
