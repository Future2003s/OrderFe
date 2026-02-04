"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Package, DollarSign, Image as ImageIcon, Upload, X, Star } from "lucide-react"
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct, uploadProductImage, type AdminProduct, type CreateProductData } from "@/api/products-admin"
import { login, getCurrentUser, type LoginCredentials } from "@/api/auth"
import { toast } from "sonner"
import Image from "next/image"

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [authToken, setAuthToken] = useState<string>("")
  const [user, setUser] = useState<any>(null)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({ email: "", password: "" })
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<boolean>(false)
  const [productImages, setProductImages] = useState<Array<{ url: string; alt?: string; isMain: boolean; order: number }>>([])
  const [formData, setFormData] = useState<Partial<CreateProductData>>({
    name: "",
    slug: "",
    price: 0,
    sku: "",
    category: "",
    shortDescription: "",
    description: "",
    ingredients: "",
    volumeMl: 250,
    quantity: 100,
    status: "active",
    isVisible: true,
    currency: "VND",
    trackQuantity: true,
  })

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem("authToken") || ""
    setAuthToken(token)
    
    // Verify token and get user info
    if (token) {
      verifyToken(token)
    } else {
      setIsLoginDialogOpen(true)
    }
    
    loadProducts()
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const userData = await getCurrentUser(token)
      setUser(userData)
      setIsLoginDialogOpen(false)
    } catch (error) {
      // Token invalid, clear it
      localStorage.removeItem("authToken")
      setAuthToken("")
      setIsLoginDialogOpen(true)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)

    try {
      const response = await login(loginCredentials)
      
      if (response.success && response.data?.token) {
        const token = response.data.token
        setAuthToken(token)
        localStorage.setItem("authToken", token)
        setUser(response.data.user)
        setIsLoginDialogOpen(false)
        toast.success(`Đăng nhập thành công! Xin chào ${response.data.user.firstName || response.data.user.email}`)
        setLoginCredentials({ email: "", password: "" })
      } else {
        toast.error(response.message || "Đăng nhập thất bại")
      }
    } catch (error: any) {
      toast.error(error.message || "Đăng nhập thất bại")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setAuthToken("")
    setUser(null)
    setIsLoginDialogOpen(true)
    toast.success("Đã đăng xuất")
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      const result = await getAdminProducts({
        search: searchTerm || undefined,
        limit: 100,
      })
      setProducts(result.products || [])
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadProducts()
    }, 500)

    return () => clearTimeout(debounce)
  }, [searchTerm])


  const handleOpenEdit = (product: AdminProduct) => {
    setEditingProduct(product)
    setProductImages(product.images || [])
    setFormData({
      name: product.name || "",
      slug: product.slug || "",
      price: product.price ?? 0,
      sku: product.sku || "",
      category: typeof product.category === "string" ? product.category : product.category?._id || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      ingredients: product.ingredients || "",
      volumeMl: product.volumeMl ?? 250,
      quantity: product.quantity ?? 0,
      status: product.status || "active",
      isVisible: product.isVisible !== undefined ? product.isVisible : true,
      currency: product.currency || "VND",
      trackQuantity: product.trackQuantity !== undefined ? product.trackQuantity : true,
      images: product.images,
      nutrition: product.nutrition,
      supervisedBy: product.supervisedBy,
      claims: product.claims,
      tags: product.tags,
    })
    setIsDialogOpen(true)
  }

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setProductImages([])
    setFormData({
      name: "",
      slug: "",
      price: 0,
      sku: "",
      category: "",
      shortDescription: "",
      description: "",
      ingredients: "",
      volumeMl: 250,
      quantity: 100,
      status: "active",
      isVisible: true,
      currency: "VND",
      trackQuantity: true,
    })
    setIsDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (!authToken) {
      toast.error("Vui lòng đăng nhập để upload ảnh")
      setIsLoginDialogOpen(true)
      return
    }

    setUploadingImages(true)

    try {
      const uploadPromises = Array.from(files).map(async (file, fileIndex) => {
        try {
          const result = await uploadProductImage(file, authToken)
          return {
            url: result.url,
            alt: file.name,
            isMain: productImages.length === 0 && fileIndex === 0, // First image is main
            order: productImages.length + fileIndex,
          }
        } catch (error: any) {
          console.error(`Error uploading file ${file.name}:`, error)
          throw new Error(`Lỗi upload ảnh ${file.name}: ${error.message || "Unknown error"}`)
        }
      })

      const newImages = await Promise.all(uploadPromises)
      const updatedImages = [...productImages, ...newImages]
      setProductImages(updatedImages)
      setFormData((prev) => ({ ...prev, images: updatedImages }))
      toast.success(`Đã upload ${newImages.length} ảnh thành công!`)
    } catch (error: any) {
      console.error("Error in handleImageUpload:", error)
      toast.error(error.message || "Lỗi khi upload ảnh")
    } finally {
      setUploadingImages(false)
      // Reset input to allow uploading the same file again
      e.target.value = ""
    }
  }

  const handleRemoveImage = (index: number) => {
    if (productImages.length <= index) return
    
    const updatedImages = productImages.filter((_, i) => i !== index)
    // Reorder images
    updatedImages.forEach((img, i) => {
      img.order = i
      if (i === 0) img.isMain = true
      else img.isMain = false
    })
    setProductImages(updatedImages)
    setFormData((prev) => ({ ...prev, images: updatedImages }))
    toast.success("Đã xóa ảnh")
  }

  const handleSetMainImage = (index: number) => {
    if (productImages.length <= index) return
    
    const updatedImages = productImages.map((img, i) => ({
      ...img,
      isMain: i === index,
    }))
    setProductImages(updatedImages)
    setFormData((prev) => ({ ...prev, images: updatedImages }))
    toast.success("Đã đặt làm ảnh chính")
  }

  const handleReplaceImage = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (productImages.length <= index) {
      toast.error("Không tìm thấy ảnh cần thay thế")
      return
    }

    if (!authToken) {
      toast.error("Vui lòng đăng nhập để thay ảnh")
      setIsLoginDialogOpen(true)
      return
    }

    setUploadingImages(true)

    try {
      const result = await uploadProductImage(file, authToken)
      const newImage = {
        url: result.url,
        alt: file.name,
        isMain: productImages[index]?.isMain || false, // Keep main status
        order: productImages[index]?.order || index, // Keep order
      }

      const updatedImages = [...productImages]
      updatedImages[index] = newImage
      
      setProductImages(updatedImages)
      setFormData((prev) => ({ ...prev, images: updatedImages }))
      toast.success("Đã thay ảnh thành công!")
    } catch (error: any) {
      console.error("Error in handleReplaceImage:", error)
      toast.error(error.message || "Lỗi khi thay ảnh")
    } finally {
      setUploadingImages(false)
      // Reset input to allow replacing with the same file again
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!authToken) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này")
      setIsLoginDialogOpen(true)
      return
    }

    // Validate required fields
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error("Tên sản phẩm phải có ít nhất 2 ký tự")
      return
    }

    if (!formData.price || formData.price < 0) {
      toast.error("Giá sản phẩm phải là số dương")
      return
    }

    if (!formData.sku || formData.sku.trim().length === 0) {
      toast.error("SKU không được để trống")
      return
    }

    if (!formData.category || formData.category.trim().length === 0) {
      toast.error("Category không được để trống")
      return
    }

    try {
      // Build product data, only include fields that have values
      const productData: Partial<CreateProductData> = {
        name: formData.name!.trim(),
        price: formData.price!,
        sku: formData.sku!.trim(),
        category: formData.category!.trim(),
      }

      // Add optional fields only if they have values
      if (formData.slug) productData.slug = formData.slug.trim()
      if (formData.shortDescription) productData.shortDescription = formData.shortDescription.trim()
      if (formData.description) productData.description = formData.description.trim()
      if (formData.ingredients) productData.ingredients = formData.ingredients.trim()
      if (formData.volumeMl !== undefined) productData.volumeMl = formData.volumeMl
      if (formData.quantity !== undefined) productData.quantity = formData.quantity
      if (formData.status) productData.status = formData.status as "draft" | "active" | "archived"
      if (formData.isVisible !== undefined) productData.isVisible = formData.isVisible
      if (formData.currency) productData.currency = formData.currency
      if (formData.trackQuantity !== undefined) productData.trackQuantity = formData.trackQuantity
      
      // Handle images - prioritize productImages state over formData.images
      if (productImages.length > 0) {
        productData.images = productImages
      } else if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
        productData.images = formData.images
      } else if (editingProduct && editingProduct.images && editingProduct.images.length > 0) {
        // Keep existing images if no new images uploaded
        productData.images = editingProduct.images
      }
      
      if (formData.nutrition) productData.nutrition = formData.nutrition
      if (formData.supervisedBy) productData.supervisedBy = formData.supervisedBy
      if (formData.claims) productData.claims = formData.claims
      if (formData.tags) productData.tags = formData.tags

      if (editingProduct) {
        await updateAdminProduct(editingProduct._id, productData, authToken)
        toast.success("Cập nhật sản phẩm thành công!")
      } else {
        await createAdminProduct(productData as CreateProductData, authToken)
        toast.success("Tạo sản phẩm thành công!")
      }

      setIsDialogOpen(false)
      loadProducts()
    } catch (error: any) {
      console.error("Error submitting product:", error)
      const errorMessage = error.message || error.response?.data?.message || "Có lỗi xảy ra"
      const errorDetails = error.response?.data?.errors || []
      
      if (errorDetails.length > 0) {
        const errorList = errorDetails.map((e: any) => e.message || e).join(", ")
        toast.error(`Lỗi: ${errorList}`)
      } else {
        toast.error(errorMessage)
      }
    }
  }

  const handleDelete = async (product: AdminProduct) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      return
    }

    if (!authToken) {
      toast.error("Vui lòng đăng nhập để xóa sản phẩm")
      setIsLoginDialogOpen(true)
      return
    }

    try {
      await deleteAdminProduct(product._id, authToken)
      toast.success("Xóa sản phẩm thành công!")
      loadProducts()
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi xóa")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Quản Lý Sản Phẩm</h1>
        <p className="text-muted-foreground">
          Quản lý sản phẩm nước ép vải LALA-LYCHEEE
        </p>
      </div>

      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm Sản Phẩm
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const mainImage = product.images?.find((img) => img.isMain)?.url || product.images?.[0]?.url

            return (
              <Card key={product._id} className="overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.status === "active" ? "default" : "secondary"}>
                      {product.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                  <div className="flex items-center gap-2 text-lg font-bold text-primary">
                    <DollarSign className="h-4 w-4" />
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    SKU: {product.sku} | Stock: {product.quantity || 0}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenEdit(product)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Sửa
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên Sản Phẩm *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="nuoc-ep-vai-thieu"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Giá (VND) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price ?? 0}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku || ""}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category ID *</Label>
              <Input
                id="category"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="ObjectId của category"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Mô Tả Ngắn</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription || ""}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô Tả Đầy Đủ</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volumeMl">Dung Tích (ml)</Label>
                <Input
                  id="volumeMl"
                  type="number"
                  value={formData.volumeMl ?? 250}
                  onChange={(e) => setFormData({ ...formData, volumeMl: parseInt(e.target.value) || 250 })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Số Lượng</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity ?? 0}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Thành Phần</Label>
              <Textarea
                id="ingredients"
                value={formData.ingredients || ""}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Ảnh Sản Phẩm</Label>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer min-h-[120px]"
                >
                  {uploadingImages ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Đang upload ảnh...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-sm font-medium text-foreground mb-1">
                        Click để chọn ảnh hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Hỗ trợ: JPG, PNG, GIF, WebP (Tối đa 10MB mỗi ảnh)
                      </p>
                    </>
                  )}
                </label>
              </div>

              {/* Images Grid */}
              {productImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-3">
                    Đã upload {productImages.length} ảnh
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {productImages.map((img, index) => (
                      <div key={`${img.url}-${index}`} className="relative group">
                        <div className="relative aspect-square rounded-lg overflow-hidden border-2 transition-all"
                          style={{
                            borderColor: img.isMain ? "hsl(var(--primary))" : "hsl(var(--border))"
                          }}
                        >
                          <Image
                            src={img.url}
                            alt={img.alt || `Product image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          
                          {/* Main Image Badge */}
                          {img.isMain && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
                              <Star className="h-3 w-3 fill-current" />
                              Ảnh chính
                            </div>
                          )}
                          
                          {/* Image Order Number */}
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                            #{index + 1}
                          </div>
                          
                          {/* Hover Overlay with Actions */}
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                            <Button
                              type="button"
                              variant={img.isMain ? "default" : "secondary"}
                              size="sm"
                              onClick={() => handleSetMainImage(index)}
                              className="w-full"
                              disabled={img.isMain}
                            >
                              {img.isMain ? (
                                <>
                                  <Star className="h-4 w-4 mr-2 fill-current" />
                                  Ảnh chính
                                </>
                              ) : (
                                <>
                                  <Star className="h-4 w-4 mr-2" />
                                  Đặt làm ảnh chính
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveImage(index)}
                              className="w-full"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </Button>
                          </div>
                        </div>
                        
                        {/* Replace Image Button */}
                        <div className="mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleReplaceImage(index, e)}
                            className="hidden"
                            id={`replace-image-${index}`}
                          />
                          <label htmlFor={`replace-image-${index}`}>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                              asChild
                            >
                              <span className="cursor-pointer">
                                <Upload className="h-3 w-3 mr-1 inline" />
                                Thay ảnh
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Trạng Thái</Label>
                <Select
                  value={formData.status || "active"}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isVisible">Hiển Thị</Label>
                <Select
                  value={formData.isVisible !== undefined ? (formData.isVisible ? "true" : "false") : "true"}
                  onValueChange={(value) => setFormData({ ...formData, isVisible: value === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Có</SelectItem>
                    <SelectItem value="false">Không</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {editingProduct ? "Cập Nhật" : "Tạo Mới"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đăng Nhập</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={loginCredentials.email}
                onChange={(e) => setLoginCredentials({ ...loginCredentials, email: e.target.value })}
                placeholder="admin@example.com"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật Khẩu *</Label>
              <Input
                id="password"
                type="password"
                value={loginCredentials.password}
                onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoggingIn}>
                {isLoggingIn ? "Đang đăng nhập..." : "Đăng Nhập"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
