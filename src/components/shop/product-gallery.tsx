"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: false
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      console.log("Scrolling to index:", index, "Total images:", images.length)
      try {
        emblaApi.scrollTo(index, true) // true = jump (no animation)
        // Also update state immediately for better UX
        setSelectedIndex(index)
      } catch (error) {
        console.error("Error scrolling to index:", error)
      }
    } else {
      console.warn("Embla API not ready yet")
    }
  }, [emblaApi, images.length])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      const currentIndex = emblaApi.selectedScrollSnap()
      console.log("Selected index changed to:", currentIndex)
      setSelectedIndex(currentIndex)
    }

    emblaApi.on("select", onSelect)
    
    // Set initial selected index
    const initialIndex = emblaApi.selectedScrollSnap()
    setSelectedIndex(initialIndex)

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg border">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__viewport overflow-hidden">
            <div className="embla__container flex">
              {images.map((image, index) => (
                <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                  <Image
                    src={image}
                    alt={`${productName} - Hình ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2"
              onClick={scrollPrev}
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={scrollNext}
              aria-label="Ảnh sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`thumb-${index}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("Thumbnail clicked, index:", index, "emblaApi:", !!emblaApi)
                if (emblaApi) {
                  scrollTo(index)
                } else {
                  console.warn("Embla API not ready, setting state directly")
                  setSelectedIndex(index)
                }
              }}
              onMouseDown={(e) => e.preventDefault()}
              className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 hover:opacity-90 active:scale-95 touch-none ${
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-transparent hover:border-primary/50"
              }`}
              aria-label={`Xem hình ${index + 1}`}
              type="button"
              style={{ userSelect: "none" }}
            >
              <Image
                src={image}
                alt={`${productName} - Hình ${index + 1}`}
                fill
                className="object-cover pointer-events-none"
                unoptimized
                draggable={false}
              />
              {selectedIndex === index && (
                <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

