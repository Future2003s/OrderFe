"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCartStore } from "@/store/cart"
import { createOrder } from "@/api/orders"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  address: z.string().min(10, "Địa chỉ phải có ít nhất 10 ký tự"),
  note: z.string().optional(),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export function CheckoutForm() {
  const router = useRouter()
  const { items, clearCart, getTotalPrice } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      note: "",
    },
  })

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error("Danh sách đặt trước trống")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createOrder({
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        note: data.note,
        paymentMethod: "cod",
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price, // Include price for validation
          name: item.product.name, // Include name for validation
        })),
      })
      clearCart()
      router.push(`/order/success?code=${result.code}`)
    } catch (error: any) {
      const errorMessage = error?.message || error?.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại."
      toast.error(errorMessage)
      console.error("Checkout error:", error)
      
      // Log detailed error for debugging
      if (error?.response) {
        console.error("API Error Response:", error.response)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <strong>Đặt trước sản phẩm:</strong> Bạn sẽ đặt hàng trước và thanh toán khi nhận hàng (COD). 
          Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 24h. Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ SĐT: 0962.215.666 hoặc Email: info@lalalycheee.vn
        </AlertDescription>
      </Alert>
      
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3 border border-primary/20">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Phương thức thanh toán</h3>
              <p className="text-sm text-muted-foreground">
                Thanh toán khi nhận hàng (COD) - Bạn chỉ thanh toán sau khi đã nhận và kiểm tra sản phẩm.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập họ và tên"
                  {...field}
                  aria-label="Họ và tên"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại *</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  {...field}
                  aria-label="Số điện thoại"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ giao hàng *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập địa chỉ chi tiết"
                  rows={3}
                  {...field}
                  aria-label="Địa chỉ giao hàng"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú (tùy chọn)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ghi chú cho đơn hàng"
                  rows={2}
                  {...field}
                  aria-label="Ghi chú"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full h-14 text-lg font-semibold premium-shadow-lg hover:scale-105 transition-transform bg-gradient-to-r from-primary to-primary/90"
          disabled={isSubmitting || items.length === 0}
        >
          {isSubmitting ? "Đang xử lý..." : "Đặt trước sản phẩm"}
        </Button>
      </form>
    </Form>
    </div>
  )
}

