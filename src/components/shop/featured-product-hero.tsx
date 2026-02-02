"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import type { Product } from "@/api/products"

interface FeaturedProductHeroProps {
  product: Product | null
}

export function FeaturedProductHero({ product }: FeaturedProductHeroProps) {
  if (!product) {
    return null
  }

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(346,77%,50%,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(346,77%,50%,0.06),transparent_50%)]" />
      
      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
            <div className="relative aspect-square rounded-3xl overflow-hidden premium-shadow-lg border border-primary/20 bg-background">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </div>
            
            {/* Badge overlay */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">
                <Sparkles className="h-3 w-3 mr-1" />
                Sản phẩm đặc biệt
              </Badge>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">100% Nguyên chất</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                {product.name}
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.shortDesc || product.desc || "Sản phẩm cao cấp từ vải thiều Thanh Hà"}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating}) • Đã bán {product.soldCount}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl md:text-5xl font-bold text-primary">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </span>
              {product.compareAt && product.compareAt > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.compareAt)}
                </span>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">100% Tự nhiên</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Không chất bảo quản</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Từ Thanh Hà</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Tốt cho sức khỏe</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="flex-1 text-lg px-8 py-6 h-auto rounded-full premium-shadow-lg hover:scale-105 transition-transform bg-gradient-to-r from-primary to-primary/90"
              >
                <Link href={`/products/${product.slug || product.id}`} className="flex items-center justify-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Mua ngay
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="flex-1 text-lg px-8 py-6 h-auto rounded-full border-2 hover:bg-primary/5"
              >
                <Link href={`/products/${product.slug || product.id}`} className="flex items-center justify-center">
                  Xem chi tiết
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {product.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
