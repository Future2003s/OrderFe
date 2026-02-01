"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        aria-label="Giảm số lượng"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-12 text-center font-semibold">{value}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        aria-label="Tăng số lượng"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

