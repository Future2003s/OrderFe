import { NextRequest } from "next/server"
import { API_BASE_URL } from "@/config/api"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || ""
    const formData = await request.formData()

    const upstream = await fetch(`${API_BASE_URL}/products/images`, {
      method: "POST",
      headers: {
        accept: "application/json",
        ...(authHeader ? { authorization: authHeader } : {}),
      },
      body: formData,
    })

    const contentType = upstream.headers.get("content-type") || ""
    const text = await upstream.text()

    // Some upstreams return JSON but set the wrong Content-Type; try parsing anyway.
    const looksLikeJson = contentType.toLowerCase().includes("application/json")
    let parsed: unknown | null = null
    if (!looksLikeJson && text) {
      try {
        parsed = JSON.parse(text)
      } catch {
        parsed = null
      }
    }

    // If upstream didn't return JSON (common for 502/403 HTML pages), normalize to JSON
    const isJson = looksLikeJson || parsed !== null
    if (!isJson) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Upstream upload did not return JSON",
          upstreamStatus: upstream.status,
          upstreamContentType: contentType || null,
          // keep first chars for debugging without spamming
          upstreamBodyPreview: text ? text.slice(0, 500) : "",
        }),
        {
          status: upstream.status && upstream.status >= 400 ? upstream.status : 502,
          headers: { "content-type": "application/json" },
        }
      )
    }

    return new Response(looksLikeJson ? text : JSON.stringify(parsed), {
      status: upstream.status,
      headers: { "content-type": "application/json" },
    })
  } catch (e) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Upload proxy failed",
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    )
  }
}

