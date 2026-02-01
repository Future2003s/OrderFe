"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart"
import { formatMoney } from "@/lib/utils"
import { useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"

export function OrderSummary() {
  const { items, getTotalPrice } = useCartStore()
  const [discountCode, setDiscountCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 2000000 ? 0 : 30000
  const total = subtotal + shipping - discount

  const handleApplyDiscount = () => {
    // Mock discount logic
    if (discountCode.toUpperCase() === "WELCOME10") {
      setDiscount(Math.round(subtotal * 0.1))
      toast.success("Áp dụng mã giảm giá thành công")
    } else if (discountCode) {
      toast.error("Mã giảm giá không hợp lệ")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4">
              <Link
                href={`/products/${item.product.slug}`}
                className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border"
              >
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-medium hover:text-primary line-clamp-2"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {formatMoney(item.product.price)} x {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatMoney(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tạm tính:</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phí vận chuyển:</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600">Miễn phí</span>
              ) : (
                formatMoney(shipping)
              )}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Giảm giá:</span>
              <span>-{formatMoney(discount)}</span>
            </div>
          )}
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Mã giảm giá"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="flex-1"
              aria-label="Mã giảm giá"
            />
            <Button
              variant="outline"
              onClick={handleApplyDiscount}
              disabled={!discountCode}
            >
              Áp dụng
            </Button>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span className="text-primary">{formatMoney(total)}</span>
          </div>
          {subtotal < 2000000 && (
            <p className="text-xs text-muted-foreground">
              Mua thêm {formatMoney(2000000 - subtotal)} để được miễn phí ship
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

