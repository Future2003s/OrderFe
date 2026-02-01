"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Product } from "@/data/products"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatMoney } from "@/lib/utils"
import { Star, ShoppingCart, Zap } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product, 1)
    router.push("/checkout")
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product, 1)
    toast.success("Đã thêm vào danh sách đặt trước")
  }

  const discountPercent =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : 0

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:premium-shadow-lg hover:-translate-y-1 border-0 premium-shadow bg-card/50 backdrop-blur-sm">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {discountPercent > 0 && (
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-destructive to-destructive/80 text-white border-0 shadow-lg">
              -{discountPercent}%
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">Hết hàng</Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-6 space-y-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors group-hover:translate-x-1 duration-300">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.shortDesc}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            ({product.rating}) • Đã bán {product.soldCount}
          </span>
        </div>
        <div className="flex items-baseline gap-3 pt-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {formatMoney(product.price)}
          </span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatMoney(product.compareAt)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 space-y-3">
        <Button
          className="w-full rounded-full h-12 font-semibold text-base hover:scale-105 transition-transform duration-200 premium-shadow-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          aria-label={`Mua ngay ${product.name}`}
        >
          <Zap className="mr-2 h-5 w-5" />
          Mua ngay
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-full h-10 font-medium hover:scale-105 transition-transform duration-200 border-2"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          aria-label={`Thêm ${product.name} vào danh sách đặt trước`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Đặt trước
        </Button>
      </CardFooter>
    </Card>
  )
}

