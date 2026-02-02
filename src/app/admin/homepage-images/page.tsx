"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Image as ImageIcon, Save, X, Eye } from "lucide-react"
import { uploadProductImage } from "@/api/products-admin"
import { toast } from "sonner"
import Image from "next/image"

interface HomepageImage {
  id: string
  name: string
  description: string
  url: string
  component: string
  field: string
}

const HOMEPAGE_IMAGES: HomepageImage[] = [
  {
    id: "hero-image",
    name: "Hero Image",
    description: "Ảnh chính trên trang chủ (Hero section)",
    url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=800&fit=crop",
    component: "Hero",
    field: "heroImage",
  },
]

export default function HomepageImagesPage() {
  const [images, setImages] = useState<HomepageImage[]>(HOMEPAGE_IMAGES)
  const [authToken, setAuthToken] = useState<string>("")
  const [uploading, setUploading] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    // Load saved images from localStorage
    const savedImages = localStorage.getItem("homepageImages")
    if (savedImages) {
      try {
        const parsed = JSON.parse(savedImages)
        setImages(parsed)
      } catch (error) {
        console.error("Error loading saved images:", error)
      }
    }

    // Get token
    const token = localStorage.getItem("authToken") || ""
    setAuthToken(token)
  }, [])

  const handleImageUpload = async (imageId: string, file: File) => {
    if (!authToken) {
      toast.error("Vui lòng đăng nhập để upload ảnh")
      return
    }

    setUploading(imageId)

    try {
      const result = await uploadProductImage(file, authToken)
      
      const updatedImages = images.map((img) =>
        img.id === imageId ? { ...img, url: result.url } : img
      )
      
      setImages(updatedImages)
      localStorage.setItem("homepageImages", JSON.stringify(updatedImages))
      toast.success("Upload ảnh thành công!")
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi upload ảnh")
    } finally {
      setUploading(null)
    }
  }

  const handleUrlChange = (imageId: string, url: string) => {
    const updatedImages = images.map((img) =>
      img.id === imageId ? { ...img, url } : img
    )
    setImages(updatedImages)
    localStorage.setItem("homepageImages", JSON.stringify(updatedImages))
  }

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("homepageImages", JSON.stringify(images))
    
    // Dispatch custom event to update components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("homepageImagesUpdated"))
    }
    
    // In a real app, you would save to backend API here
    toast.success("Đã lưu cấu hình ảnh trang chủ!")
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Quản Lý Ảnh Trang Chủ</h1>
        <p className="text-muted-foreground">
          Quản lý và cập nhật các ảnh hiển thị trên trang chủ
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">{image.name}</CardTitle>
              <CardDescription>{image.description}</CardDescription>
              <div className="text-xs text-muted-foreground mt-1">
                Component: {image.component}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Preview */}
              <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-muted bg-muted">
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/800x600?text=Image+Error"
                  }}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPreviewImage(image.url)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Xem lớn
                  </Button>
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <Label>URL Ảnh</Label>
                <Input
                  value={image.url}
                  onChange={(e) => handleUrlChange(image.id, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Upload Button */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(image.id, file)
                    }
                  }}
                  className="hidden"
                  id={`upload-${image.id}`}
                  disabled={uploading === image.id}
                />
                <label htmlFor={`upload-${image.id}`}>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={uploading === image.id}
                    asChild
                  >
                    <span className="cursor-pointer">
                      {uploading === image.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Đang upload...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload ảnh mới
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Save className="h-5 w-5" />
          Lưu Tất Cả
        </Button>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Xem Trước Ảnh</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
