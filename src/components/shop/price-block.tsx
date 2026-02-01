import { formatMoney } from "@/lib/utils"

interface PriceBlockProps {
  price: number
  compareAt?: number
  className?: string
}

export function PriceBlock({ price, compareAt, className }: PriceBlockProps) {
  const discountPercent =
    compareAt && compareAt > price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : 0

  return (
    <div className={className}>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-3xl font-bold text-primary">
          {formatMoney(price)}
        </span>
        {compareAt && compareAt > price && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              {formatMoney(compareAt)}
            </span>
            <span className="px-2 py-1 bg-destructive/10 text-destructive text-sm font-semibold rounded">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>
    </div>
  )
}

