import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, Image as ImageIcon, Home } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-bold">
              <Home className="h-5 w-5" />
              Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin/products">
                <Button variant="ghost" className="gap-2">
                  <Package className="h-4 w-4" />
                  Sản Phẩm
                </Button>
              </Link>
              <Link href="/admin/homepage-images">
                <Button variant="ghost" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Ảnh Trang Chủ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
