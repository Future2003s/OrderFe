import { Hero } from "@/components/shop/hero"
import { TrustBadges } from "@/components/shop/trust-badges"
import { ProductGrid } from "@/components/shop/product-grid"
import { Reviews } from "@/components/shop/reviews"
import { FAQAccordion } from "@/components/shop/faq-accordion"
import { MultiBuyPromo } from "@/components/shop/multi-buy-promo"
import { getFeaturedProducts, getProducts } from "@/api/products"
import { products as mockProducts } from "@/data/products"

export default async function HomePage() {
  // Try to fetch featured products from API, fallback to mock
  let featuredProducts
  try {
    const apiProducts = await getFeaturedProducts()
    featuredProducts = apiProducts.length > 0 ? apiProducts.slice(0, 4) : mockProducts.slice(0, 4)
  } catch (error) {
    // Fallback to mock data if API fails
    featuredProducts = mockProducts.slice(0, 4)
  }

  return (
    <>
      <Hero />
      <TrustBadges />
      <section className="container py-24">
        <div className="mb-16 text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Sản phẩm nổi bật
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những sản phẩm được yêu thích nhất từ LALA-LYCHEEE
          </p>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
      <MultiBuyPromo />
      <section className="bg-gradient-to-b from-muted/30 via-muted/20 to-background py-24">
        <div className="container">
          <div className="mb-16 text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Đánh giá khách hàng
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Những gì khách hàng nói về chúng tôi
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Reviews productId="1" />
          </div>
        </div>
      </section>
      <section className="container py-24">
        <div className="mb-16 text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Câu hỏi thường gặp
          </h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <FAQAccordion />
        </div>
      </section>
    </>
  )
}

