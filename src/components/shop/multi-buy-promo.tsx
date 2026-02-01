"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Sparkles, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function MultiBuyPromo() {
  return (
    <section className="container py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 premium-shadow-lg p-8 md:p-12"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="rounded-full bg-primary/10 p-3 border border-primary/20">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-2xl md:text-3xl font-bold">
                  Mua nhiều sản phẩm cùng lúc
                </h3>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Khám phá đầy đủ hương vị với bộ sưu tập 4 loại nước ép vải độc đáo. 
                So sánh và thưởng thức sự khác biệt của từng loại vải.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10">
              <div className="rounded-full bg-primary/10 p-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Miễn phí vận chuyển</p>
                <p className="text-sm text-muted-foreground">Đơn hàng từ 2 triệu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10">
              <div className="rounded-full bg-primary/10 p-2">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Đa dạng hương vị</p>
                <p className="text-sm text-muted-foreground">4 loại vải độc đáo</p>
              </div>
            </div>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-full h-14 px-8 text-lg font-semibold premium-shadow-lg hover:scale-105 transition-transform bg-gradient-to-r from-primary to-primary/90"
          >
            <Link href="/products">
              Xem tất cả sản phẩm
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

