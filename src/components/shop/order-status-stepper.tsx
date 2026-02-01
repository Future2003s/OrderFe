"use client"

import { CheckCircle2, Circle, Package, Truck, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered"

interface OrderStatusStepperProps {
  currentStatus: OrderStatus
}

const steps: Array<{ key: OrderStatus; label: string; icon: typeof CheckCircle2 }> = [
  { key: "pending", label: "Chờ xác nhận", icon: Clock },
  { key: "confirmed", label: "Đã xác nhận", icon: Package },
  { key: "shipping", label: "Đang giao hàng", icon: Truck },
  { key: "delivered", label: "Đã giao hàng", icon: CheckCircle2 },
]

export function OrderStatusStepper({ currentStatus }: OrderStatusStepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStatus)

  return (
    <div className="relative">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isCurrent && "bg-primary/10 border-primary text-primary",
                  isPending && "bg-muted border-muted-foreground/20 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </div>
              <p
                className={cn(
                  "mt-2 text-xs text-center font-medium",
                  isCompleted && "text-primary",
                  isCurrent && "text-primary",
                  isPending && "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-6 h-0.5 -z-0",
                    index === 0 && "left-[calc(12.5%+24px)] right-[calc(12.5%-24px)]",
                    index === 1 && "left-[calc(37.5%+24px)] right-[calc(12.5%-24px)]",
                    index === 2 && "left-[calc(62.5%+24px)] right-[calc(12.5%-24px)]",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

