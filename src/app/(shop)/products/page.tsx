"use client"

import { useState, useMemo, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { ProductGrid } from "@/components/shop/product-grid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getProducts, searchProducts, getNuocCotVai100Product, type Product } from "@/api/products"
import { products as mockProducts } from "@/data/products"

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [allTags, setAllTags] = useState<string[]>([])

  // Fetch "Nước Cốt Vải 100% Thanh Hà" product specifically
  const { data: nuocCotVaiProduct } = useQuery<Product | null>({
    queryKey: ["nuoc-cot-vai-100"],
    queryFn: async () => {
      try {
        return await getNuocCotVai100Product()
      } catch (error) {
        console.error("Error fetching Nuoc Cot Vai 100 product:", error)
        return null
      }
    },
    staleTime: 300000, // 5 minutes - cache longer since it's a specific product
  })

  // Fetch products from API
  const { data: apiProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["products", searchQuery, selectedTag],
    queryFn: async () => {
      if (searchQuery) {
        return await searchProducts(searchQuery)
      }
      const result = await getProducts({
        tags: selectedTag || undefined,
        isVisible: true,
        limit: 100,
      })
      return result.products
    },
    staleTime: 60000, // 1 minute
  })

  // Combine products: prioritize Nuoc Cot Vai 100 product, then API products, then mock
  const products = useMemo(() => {
    let combined: Product[] = []
    
    // Start with API products or mock
    const baseProducts = apiProducts || mockProducts
    
    // If we have the Nuoc Cot Vai product, add it first and remove duplicates
    if (nuocCotVaiProduct) {
      combined = [nuocCotVaiProduct]
      // Add other products, excluding the Nuoc Cot Vai product if it's already in the list
      combined = [
        ...combined,
        ...baseProducts.filter(p => p.id !== nuocCotVaiProduct.id)
      ]
    } else {
      combined = baseProducts
    }
    
    return combined
  }, [apiProducts, nuocCotVaiProduct, mockProducts])

  // Extract tags from products
  useEffect(() => {
    const tags = Array.from(new Set(products.flatMap((p) => p.tags))).sort()
    setAllTags(tags)
  }, [products])

  const filteredProducts = useMemo(() => {
    if (apiProducts) {
      // If using API, filtering is done server-side
      return apiProducts
    }
    
    // Fallback: client-side filtering for mock data
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedTag) {
      filtered = filtered.filter((p) => p.tags.includes(selectedTag))
    }

    return filtered
  }, [products, searchQuery, selectedTag, apiProducts])

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Sản phẩm</h1>
        <p className="text-muted-foreground">
          Khám phá bộ sưu tập sản phẩm tự nhiên của chúng tôi
        </p>
      </div>
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Tìm kiếm sản phẩm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
              aria-label="Xóa tìm kiếm"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            Tất cả
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
        {selectedTag && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Đang lọc:</span>
            <Badge variant="secondary" className="gap-2">
              {selectedTag}
              <button
                onClick={() => setSelectedTag(null)}
                className="ml-1 hover:text-destructive"
                aria-label="Xóa bộ lọc"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}
      </div>
      <ProductGrid products={filteredProducts} isLoading={isLoading} />
    </div>
  )
}

