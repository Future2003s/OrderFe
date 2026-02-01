export interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAt?: number
  images: string[]
  shortDesc: string
  desc: string
  tags: string[]
  stock: number
  rating: number
  soldCount: number
}

export const products: Product[] = [
  {
    id: "1",
    name: "Nước Ép Vải Thiều",
    slug: "nuoc-ep-vai-thieu",
    price: 75000,
    compareAt: 90000,
    images: [
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
    ],
    shortDesc: "Nước ép vải thiều nguyên chất 100%, vị ngọt thanh đặc trưng",
    desc: "Nước ép vải thiều LALA-LYCHEEE được làm từ những quả vải thiều tươi ngon nhất, ép lạnh để giữ nguyên hương vị tự nhiên. Vải thiều có vị ngọt thanh, thơm mát đặc trưng. Sản phẩm không chứa đường hóa học, không chất bảo quản, hoàn toàn tự nhiên và tốt cho sức khỏe.",
    tags: ["vải thiều", "tự nhiên", "không đường", "ép lạnh"],
    stock: 50,
    rating: 5,
    soldCount: 1234,
  },
  {
    id: "2",
    name: "Nước Ép Vải Nhỡ",
    slug: "nuoc-ep-vai-nho",
    price: 95000,
    compareAt: 110000,
    images: [
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
    ],
    shortDesc: "Nước ép vải nhỡ nguyên chất, vị ngọt đậm đà, màu đẹp mắt",
    desc: "Nước ép vải nhỡ LALA-LYCHEEE được chế biến từ giống vải nhỡ đặc biệt, có màu tự nhiên đẹp mắt và vị ngọt đậm đà. Sản phẩm ép lạnh giữ nguyên hương vị và màu sắc tự nhiên, không chất bảo quản, không đường hóa học.",
    tags: ["vải nhỡ", "tự nhiên", "không đường", "ép lạnh"],
    stock: 45,
    rating: 5,
    soldCount: 856,
  },
  {
    id: "3",
    name: "Nước Ép Vải Tàu Lai",
    slug: "nuoc-ep-vai-tau-lai",
    price: 80000,
    compareAt: 95000,
    images: [
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
    ],
    shortDesc: "Nước ép vải tàu lai nguyên chất, vị ngọt mát, thơm dịu",
    desc: "Nước ép vải tàu lai LALA-LYCHEEE được làm từ giống vải tàu lai nổi tiếng, có vị ngọt mát và hương thơm dịu nhẹ đặc trưng. Sản phẩm ép lạnh giữ nguyên hương vị tự nhiên, không chất bảo quản, không đường hóa học, hoàn toàn tự nhiên.",
    tags: ["vải tàu lai", "tự nhiên", "không đường", "ép lạnh"],
    stock: 40,
    rating: 5,
    soldCount: 567,
  },
  {
    id: "4",
    name: "Nước Ép Vải Phối Trộn",
    slug: "nuoc-ep-vai-phoi-tron",
    price: 80000,
    compareAt: 95000,
    images: [
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
    ],
    shortDesc: "Nước ép vải phối trộn đặc biệt, kết hợp hương vị của nhiều loại vải",
    desc: "Nước ép vải phối trộn LALA-LYCHEEE là sự kết hợp tinh tế giữa vải thiều, vải u hồng và vải tàu lai, tạo nên hương vị độc đáo và cân bằng. Sản phẩm ép lạnh giữ nguyên hương vị tự nhiên của từng loại vải, không chất bảo quản, không đường hóa học.",
    tags: ["phối trộn", "tự nhiên", "không đường", "ép lạnh"],
    stock: 35,
    rating: 5,
    soldCount: 642,
  },
]

export const reviews = [
  {
    id: "1",
    productId: "1",
    userName: "Nguyễn Văn A",
    rating: 5,
    comment: "Nước ép vải thiều rất ngon, vị ngọt thanh tự nhiên. Sẽ mua lại!",
    date: "2024-01-15",
  },
  {
    id: "2",
    productId: "1",
    userName: "Trần Thị B",
    rating: 5,
    comment: "Vải thiều có vị đặc trưng, sản phẩm chất lượng. Giao hàng nhanh.",
    date: "2024-01-20",
  },
  {
    id: "3",
    productId: "2",
    userName: "Lê Văn C",
    rating: 5,
    comment: "Vải nhỡ có màu đẹp, vị ngọt đậm đà. Rất hài lòng!",
    date: "2024-01-18",
  },
  {
    id: "4",
    productId: "2",
    userName: "Phạm Thị D",
    rating: 5,
    comment: "Nước ép vải nhỡ nguyên chất, màu sắc tự nhiên đẹp mắt. Sẽ ủng hộ shop tiếp!",
    date: "2024-01-22",
  },
  {
    id: "5",
    productId: "3",
    userName: "Hoàng Văn E",
    rating: 5,
    comment: "Vải tàu lai có vị ngọt mát, thơm dịu rất dễ uống!",
    date: "2024-01-25",
  },
  {
    id: "6",
    productId: "4",
    userName: "Nguyễn Thị F",
    rating: 5,
    comment: "Nước ép phối trộn có hương vị độc đáo, kết hợp hoàn hảo các loại vải. Rất thích!",
    date: "2024-01-28",
  },
  {
    id: "7",
    productId: "4",
    userName: "Trần Văn G",
    rating: 5,
    comment: "Phối trộn tạo nên hương vị cân bằng, rất ngon.",
    date: "2024-02-01",
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getReviewsByProductId(productId: string) {
  return reviews.filter((r) => r.productId === productId)
}

