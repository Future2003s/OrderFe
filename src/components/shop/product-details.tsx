"use client"

import { useState } from "react"
import { Product } from "@/data/products"
import { QuantitySelector } from "./quantity-selector"
import { AddToCartButton } from "./add-to-cart-button"
import { BuyNowButton } from "./buy-now-button"
import { Package, Truck } from "lucide-react"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="space-y-6 border-t pt-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Tồn kho:</span>
          <span className="font-semibold">
            {product.stock > 0 ? `${product.stock} sản phẩm` : "Hết hàng"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Giao hàng:</span>
          <span className="font-semibold">2-5 ngày làm việc</span>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Số lượng:</label>
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            max={product.stock}
            disabled={product.stock === 0}
          />
        </div>
        <div className="space-y-3">
          <BuyNowButton product={product} quantity={quantity} className="w-full rounded-full h-14 text-lg font-semibold" />
          <AddToCartButton product={product} quantity={quantity} className="w-full rounded-full h-12 border-2" variant="outline" />
        </div>
      </div>
    </div>
  )
}

