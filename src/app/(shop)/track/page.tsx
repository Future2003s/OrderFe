"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrderByCode, type Order } from "@/api/orders"
import { formatMoney, formatPhone } from "@/lib/utils"
import { Search, Package, Truck, CheckCircle2, Clock } from "lucide-react"
import { OrderStatusStepper } from "@/components/shop/order-status-stepper"

export default function TrackPage() {
  const [orderCode, setOrderCode] = useState("")
  const [searchCode, setSearchCode] = useState("")

  const { data: order, isLoading, error } = useQuery<Order | null>({
    queryKey: ["order", searchCode],
    queryFn: () => getOrderByCode(searchCode),
    enabled: searchCode.length > 0,
  })

  const handleSearch = () => {
    if (orderCode.trim()) {
      setSearchCode(orderCode.trim().toUpperCase())
    }
  }

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

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Theo dõi đơn hàng</h1>
          <p className="text-muted-foreground text-lg">
            Nhập mã đơn hàng để xem trạng thái đơn hàng của bạn
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Tìm kiếm đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Nhập mã đơn hàng (ví dụ: ORD000023)"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
                aria-label="Mã đơn hàng"
              />
              <Button 
                onClick={handleSearch} 
                disabled={!orderCode.trim()}
                className="w-full sm:w-auto"
              >
                <Search className="mr-2 h-4 w-4" />
                Tìm kiếm
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              💡 Bạn có thể tìm đơn hàng bằng mã đơn hàng bạn đã nhận được
            </p>
          </CardContent>
        </Card>
        {isLoading && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Đang tải...</p>
            </CardContent>
          </Card>
        )}
        {error && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-destructive">
                Có lỗi xảy ra. Vui lòng thử lại.
              </p>
            </CardContent>
          </Card>
        )}
        {searchCode && !isLoading && !order && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Không tìm thấy đơn hàng với mã: {searchCode}
              </p>
            </CardContent>
          </Card>
        )}
        {order && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
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
    </div>
  )
}

