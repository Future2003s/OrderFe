import { Truck, RefreshCw, CreditCard, Shield } from "lucide-react"

const badges = [
  {
    icon: Truck,
    title: "Giao hàng nhanh",
    description: "Miễn phí ship đơn trên 2 triệu",
  },
  {
    icon: RefreshCw,
    title: "Đổi trả dễ dàng",
    description: "7 ngày đổi trả miễn phí",
  },
  {
    icon: CreditCard,
    title: "Thanh toán an toàn",
    description: "Nhiều phương thức thanh toán",
  },
  {
    icon: Shield,
    title: "Chất lượng đảm bảo",
    description: "100% tự nhiên, không pha chế",
  },
]

export function TrustBadges() {
  return (
    <section className="border-y border-border/40 bg-gradient-to-b from-background to-muted/30 py-16">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-5 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-base md:text-lg">
                    {badge.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

