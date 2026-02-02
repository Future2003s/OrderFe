"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function Hero() {
  const [heroImageUrl, setHeroImageUrl] = useState(
    "https://res.cloudinary.com/deu1fhggt/image/upload/v1769998097/products/products/1769998096062-v6h1csou8a.jpg"
  )

  useEffect(() => {
    // Load hero image from localStorage
    if (typeof window !== "undefined") {
      const savedImages = localStorage.getItem("homepageImages")
      if (savedImages) {
        try {
          const images = JSON.parse(savedImages)
          const heroImage = images.find((img: any) => img.id === "hero-image")
          if (heroImage?.url) {
            setHeroImageUrl(heroImage.url)
          }
        } catch (error) {
          console.error("Error loading hero image:", error)
        }
      }
    }
  }, [])

  // Listen for storage changes (when admin updates image)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleStorageChange = () => {
        const savedImages = localStorage.getItem("homepageImages")
        if (savedImages) {
          try {
            const images = JSON.parse(savedImages)
            const heroImage = images.find((img: any) => img.id === "hero-image")
            if (heroImage?.url) {
              setHeroImageUrl(heroImage.url)
            }
          } catch (error) {
            console.error("Error loading hero image:", error)
          }
        }
      }

      window.addEventListener("storage", handleStorageChange)
      // Also listen for custom event (when same tab updates)
      window.addEventListener("homepageImagesUpdated", handleStorageChange)

      return () => {
        window.removeEventListener("storage", handleStorageChange)
        window.removeEventListener("homepageImagesUpdated", handleStorageChange)
      }
    }
  }, [])
  
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background via-50% to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(346,77%,50%,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(346,77%,50%,0.08),transparent_50%)]" />
      
      <div className="container relative z-10 py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">100% Tự Nhiên</span>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1]">
              <span className="block">Nước ép vải</span>
              <span className="block mt-2 gradient-text">hảo hạng Thanh Hà</span>
            </h1>
            
            <p className="text-xl text-muted-foreground md:text-2xl max-w-[600px] leading-relaxed">
              Nước ép vải thiều, vải nhỡ, tàu lai và phối trộn. Nguyên chất từ vải tươi, không chất bảo quản,
              không đường hóa học. Hương vị thuần khiết, tốt cho sức khỏe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="text-lg px-10 py-6 h-auto rounded-full premium-shadow hover:scale-105 transition-transform">
                <Link href="/products" className="flex items-center">
                  Mua ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-10 py-6 h-auto rounded-full border-2 hover:bg-primary/5">
                <Link href="/products">Xem sản phẩm</Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-square"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
            <div className="relative aspect-square rounded-3xl overflow-hidden premium-shadow-lg border border-primary/10">
              <Image
                src={heroImageUrl}
                alt="Nước ép vải hảo hạng Thanh Hà LALA-LYCHEEE 100% tự nhiên"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

