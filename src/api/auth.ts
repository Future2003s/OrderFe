/**
 * Authentication API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1"

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data?: {
    token: string
    user: {
      _id: string
      email: string
      firstName?: string
      lastName?: string
      role: string
    }
  }
  message?: string
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    return data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

/**
 * Get current user info (verify token)
 */
export async function getCurrentUser(token: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Invalid token")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Get current user error:", error)
    throw error
  }
}
