"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart"
import { QuantitySelector } from "./quantity-selector"
import { formatMoney } from "@/lib/utils"
import { Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } =
    useCartStore()
  const [isClearing, setIsClearing] = useState(false)

  const handleCheckout = () => {
    onOpenChange(false)
    // Navigate will be handled by Link
  }

  const handleClearCart = () => {
    setIsClearing(true)
    clearCart()
    setIsClearing(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Danh sách đặt trước ({items.length})</SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">Danh sách trống</p>
              <p className="text-sm text-muted-foreground">
                Thêm sản phẩm vào danh sách đặt trước để tiếp tục
              </p>
            </div>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link href="/products">Xem sản phẩm</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 border rounded-lg"
                >
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border"
                    onClick={() => onOpenChange(false)}
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
                      onClick={() => onOpenChange(false)}
                    >
                      <h4 className="font-semibold line-clamp-2 hover:text-primary">
                        {item.product.name}
                      </h4>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatMoney(item.product.price)}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(qty) =>
                          updateQuantity(item.product.id, qty)
                        }
                        max={item.product.stock}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.product.id)}
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <SheetFooter className="flex-col gap-4 sm:flex-col">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">
                    {formatMoney(getTotalPrice())}
                  </span>
                </div>
                {items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="w-full text-destructive"
                  >
                    Xóa tất cả
                  </Button>
                )}
              </div>
              <Button
                asChild
                className="w-full rounded-full h-12 font-semibold premium-shadow-lg hover:scale-105 transition-transform bg-gradient-to-r from-primary to-primary/90"
                size="lg"
                onClick={handleCheckout}
              >
                <Link href="/checkout">Đặt trước sản phẩm</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

