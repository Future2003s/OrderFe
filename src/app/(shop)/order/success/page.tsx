"use client"

import { useSearchParams } from "next/navigation"
import { CheckCircle2, Package, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderCode = searchParams.get("code")

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">Đặt trước thành công!</h1>
          <p className="text-muted-foreground text-lg">
            Cảm ơn bạn đã đặt trước sản phẩm. Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 24h.
            Bạn sẽ thanh toán khi nhận hàng (COD).
          </p>
        </div>
        {orderCode && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Package className="h-5 w-5" />
                Mã đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary font-mono">
                {orderCode}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Vui lòng lưu mã đơn hàng để theo dõi
              </p>
            </CardContent>
          </Card>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/track">
              <Search className="mr-2 h-5 w-5" />
              Theo dõi đơn hàng
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Về trang chủ
            </Link>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
          <p className="font-semibold text-foreground">Lưu ý về thanh toán:</p>
          <p>• Bạn sẽ thanh toán khi nhận hàng (COD)</p>
          <p>• Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 24h</p>
          <p>• Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ hotline: 1900 1234</p>
        </div>
      </div>
    </div>
  )
}

