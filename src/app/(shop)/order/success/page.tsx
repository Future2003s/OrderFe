"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2, Package, Home, Search, Truck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getOrderByCode, type Order } from "@/api/orders"
import { formatMoney, formatPhone } from "@/lib/utils"
import { OrderStatusStepper } from "@/components/shop/order-status-stepper"

function OrderCodeCard() {
  const searchParams = useSearchParams()
  const orderCode = searchParams.get("code")

  if (!orderCode) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Package className="h-5 w-5" />
          Mã đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-primary font-mono text-center">
          {orderCode}
        </p>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Vui lòng lưu mã đơn hàng để theo dõi
        </p>
      </CardContent>
    </Card>
  )
}

function OrderTrackingSection() {
  const searchParams = useSearchParams()
  const orderCode = searchParams.get("code")

  // Tự động load tracking ngay khi có mã đơn hàng
  const { data: order, isLoading, error, refetch } = useQuery<Order | null>({
    queryKey: ["order", orderCode],
    queryFn: async () => {
      if (!orderCode) return null
      // Thêm delay nhỏ để đảm bảo đơn hàng đã được lưu vào database
      await new Promise(resolve => setTimeout(resolve, 500))
      return getOrderByCode(orderCode)
    },
    enabled: !!orderCode, // Tự động load khi có mã đơn hàng
    retry: 3, // Retry 3 lần nếu lỗi (vì đơn hàng có thể chưa được lưu ngay)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
    refetchOnWindowFocus: false, // Không refetch khi focus window
    staleTime: 30000, // Cache trong 30 giây
  })

  if (!orderCode) return null

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "confirmed":
        return <Package className="h-5 w-5 text-blue-600" />
      case "shipping":
        return <Truck className="h-5 w-5 text-purple-600" />
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
    }
  }

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận"
      case "confirmed":
        return "Đã xác nhận"
      case "shipping":
        return "Đang giao hàng"
      case "delivered":
        return "Đã giao hàng"
    }
  }

  if (!orderCode) return null

  return (
    <div className="space-y-4">
      {isLoading && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Đang tải thông tin đơn hàng...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive mb-4">
              Có lỗi xảy ra khi tải thông tin đơn hàng. Vui lòng thử lại sau.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Tải lại trang
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && !order && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              Không tìm thấy đơn hàng với mã: {orderCode}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Đơn hàng có thể đang được xử lý. Vui lòng thử lại sau vài giây.
            </p>
            <Button 
              onClick={() => refetch()} 
              variant="outline"
            >
              <Search className="mr-2 h-4 w-4" />
              Tải lại
            </Button>
          </CardContent>
        </Card>
      )}

      {order && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <CardTitle>Đơn hàng {order.code}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="font-semibold">
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <OrderStatusStepper currentStatus={order.status} />
                  <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                    <div>
                      <p className="text-sm font-semibold mb-1">Khách hàng</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-1">Số điện thoại</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPhone(order.phone)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-semibold mb-1">Địa chỉ giao hàng</p>
                      <p className="text-sm text-muted-foreground">
                        {order.address}
                      </p>
                    </div>
                    {order.note && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold mb-1">Ghi chú</p>
                        <p className="text-sm text-muted-foreground">
                          {order.note}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {formatMoney(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-primary">
                          {formatMoney(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
      )}
    </div>
  )
}

export default function OrderSuccessPage() {
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
            Bạn sẽ thanh toán khi nhận hàng (COD). Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ SĐT: 0962.215.666 hoặc Email: info@lalalycheee.vn
          </p>
        </div>
        <Suspense fallback={null}>
          <OrderCodeCard />
        </Suspense>
        
        <Suspense fallback={null}>
          <OrderTrackingSection />
        </Suspense>

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
          <p>• Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ:</p>
          <p className="pl-4">- SĐT: <a href="tel:0962215666" className="text-primary hover:underline">0962.215.666</a></p>
          <p className="pl-4">- Email: <a href="mailto:info@lalalycheee.vn" className="text-primary hover:underline">info@lalalycheee.vn</a></p>
        </div>
      </div>
    </div>
  )
}

