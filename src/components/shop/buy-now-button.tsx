"use client"

import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { Product } from "@/data/products"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface BuyNowButtonProps {
  product: Product
  quantity?: number
  className?: string
}

export function BuyNowButton({
  product,
  quantity = 1,
  className,
}: BuyNowButtonProps) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const [isLoading, setIsLoading] = useState(false)

  const handleBuyNow = async () => {
    if (product.stock === 0) {
      return
    }

    setIsLoading(true)
    addItem(product, quantity)
    router.push("/checkout")
    setIsLoading(false)
  }

  return (
    <Button
      onClick={handleBuyNow}
      disabled={product.stock === 0 || isLoading}
      size="lg"
      className={`bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary premium-shadow-lg hover:scale-105 transition-transform ${className}`}
      aria-label={`Mua ngay ${product.name}`}
    >
      <Zap className="mr-2 h-5 w-5" />
      {product.stock === 0 ? "Hết hàng" : "Mua ngay"}
    </Button>
  )
}

