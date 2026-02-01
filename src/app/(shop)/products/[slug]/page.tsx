import { notFound } from "next/navigation"
import { getProductBySlug } from "@/data/products"
import { getProducts, getProductById, type Product } from "@/api/products"
import { ProductGallery } from "@/components/shop/product-gallery"
import { PriceBlock } from "@/components/shop/price-block"
import { QuantitySelector } from "@/components/shop/quantity-selector"
import { AddToCartButton } from "@/components/shop/add-to-cart-button"
import { Reviews } from "@/components/shop/reviews"
import { Badge } from "@/components/ui/badge"
import { Star, Package, Truck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Metadata } from "next"
import { ProductDetails } from "@/components/shop/product-details"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  
  // Try to get from API first, fallback to mock
  let product: Product | null = null
  
  // If slug is an ObjectId (24 hex chars), try to fetch by ID
  if (/^[0-9a-fA-F]{24}$/.test(slug)) {
    product = await getProductById(slug)
  } else {
    // Try to find by slug in API products
    const result = await getProducts({ isVisible: true, limit: 1000 })
    product = result.products.find((p) => p.slug === slug) || null
  }
  
  // Fallback to mock data
  if (!product) {
    product = getProductBySlug(slug)
  }

  if (!product) {
    return {
      title: "Sản phẩm không tìm thấy",
    }
  }

  return {
    title: `${product.name} - LALA-LYCHEEE`,
    description: product.shortDesc,
    openGraph: {
      title: product.name,
      description: product.shortDesc,
      images: [product.images[0]],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  
  // Try to get from API first, fallback to mock
  let product: Product | null = null
  
  // If slug is an ObjectId (24 hex chars), try to fetch by ID
  if (/^[0-9a-fA-F]{24}$/.test(slug)) {
    product = await getProductById(slug)
  } else {
    // Try to find by slug in API products
    const result = await getProducts({ isVisible: true, limit: 1000 })
    product = result.products.find((p) => p.slug === slug) || null
  }
  
  // Fallback to mock data
  if (!product) {
    product = getProductBySlug(slug)
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-2 mb-12">
        <ProductGallery images={product.images} productName={product.name} />
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating}) • Đã bán {product.soldCount}
              </span>
            </div>
            <PriceBlock
              price={product.price}
              compareAt={product.compareAt}
              className="mb-6"
            />
            <p className="text-muted-foreground mb-6">{product.shortDesc}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <ProductDetails product={product} />
        </div>
      </div>
      <Tabs defaultValue="description" className="w-full">
        <TabsList>
          <TabsTrigger value="description">Mô tả</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{product.desc}</p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <Reviews productId={product.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

