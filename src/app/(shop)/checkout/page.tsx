"use client"

import { CheckoutForm } from "@/components/shop/checkout-form"
import { OrderSummary } from "@/components/shop/order-summary"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">Danh sách đặt trước trống</h1>
          <p className="text-muted-foreground">
            Vui lòng thêm sản phẩm vào danh sách đặt trước để tiếp tục
          </p>
          <Button asChild>
            <Link href="/products">Xem sản phẩm</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tiếp tục mua sắm
        </Link>
      </Button>
      <h1 className="text-3xl font-bold mb-4">Đặt trước sản phẩm</h1>
      <p className="text-muted-foreground mb-8">
        Điền thông tin để đặt hàng trước. Bạn sẽ thanh toán khi nhận hàng (COD).
      </p>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-6">Thông tin đặt hàng</h2>
          <CheckoutForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-6">Tóm tắt đơn hàng</h2>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}

