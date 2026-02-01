import { Star } from "lucide-react"
import { getReviewsByProductId } from "@/data/products"

interface ReviewsProps {
  productId: string
}

export function Reviews({ productId }: ReviewsProps) {
  const reviews = getReviewsByProductId(productId)

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Chưa có đánh giá nào cho sản phẩm này
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold">{review.userName}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.date).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}

