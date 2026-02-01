"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { Product } from "@/data/products"
import { toast } from "sonner"
import { useState } from "react"

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  variant = "default",
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error("Sản phẩm đã hết hàng")
      return
    }

    setIsLoading(true)
    addItem(product, quantity)
    toast.success("Đã thêm vào danh sách đặt trước")
    setIsLoading(false)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={product.stock === 0 || isLoading}
      size="lg"
      variant={variant}
      className={className}
      aria-label={`Thêm ${product.name} vào danh sách đặt trước`}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {product.stock === 0 ? "Hết hàng" : "Đặt trước"}
    </Button>
  )
}

