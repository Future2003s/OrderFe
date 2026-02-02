import { API_BASE_URL } from "@/config/api"

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    // Get session ID from localStorage if available
    let sessionId: string | null = null
    if (typeof window !== "undefined") {
      sessionId = localStorage.getItem("sessionId")
    }
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(sessionId && { "x-session-id": sessionId }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        // Include full error details for better debugging
        const errorMessage = data.message || data.error || "API request failed"
        const errorDetails = data.errors || data.stack
        const error = new Error(errorMessage) as any
        error.response = { data, status: response.status }
        error.errors = errorDetails
        throw error
      }

      return data
    } catch (error: any) {
      console.error("API Error:", error)
      // Re-throw with more context if it's not already an Error with response
      if (!error.response) {
        const apiError = new Error(error.message || "API request failed") as any
        apiError.originalError = error
        throw apiError
      }
      throw error
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const queryString = params
      ? "?" + new URLSearchParams(params as any).toString()
      : ""
    return this.request<T>(`${endpoint}${queryString}`, {
      method: "GET",
      ...options,
    })
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

