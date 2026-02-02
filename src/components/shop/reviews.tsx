import { Star } from "lucide-react"
import { getReviewsByProductId, reviews as allReviews } from "@/data/products"

interface ReviewsProps {
  productId?: string
  showAll?: boolean
  limit?: number
}

export function Reviews({ productId, showAll = false, limit }: ReviewsProps) {
  let reviews = productId 
    ? getReviewsByProductId(productId)
    : showAll 
    ? allReviews 
    : allReviews.slice(0, limit || 6)

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Chưa có đánh giá nào cho sản phẩm này
      </div>
    )
  }

  // Format date to Vietnamese format (dd/mm/yyyy)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Generate avatar initials
  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(review.userName)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {review.userName}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(review.date)}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  )
}

