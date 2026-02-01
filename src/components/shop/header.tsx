"use client"

import Link from "next/link"
import { Search, ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart"
import { CartDrawer } from "./cart-drawer"
import { useState } from "react"

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems())
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-primary transition-all">
                LALA-LYCHEEE
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium transition-all hover:text-primary relative group"
              >
                Trang chủ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium transition-all hover:text-primary relative group"
              >
                Sản phẩm
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
              <Link
                href="/track"
                className="text-sm font-medium transition-all hover:text-primary relative group"
              >
                Theo dõi đơn
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Tìm kiếm">
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-primary/10 transition-all"
              onClick={() => setCartOpen(true)}
              aria-label="Danh sách đặt trước"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-md -translate-y-1/2 translate-x-1/2 px-1">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container flex flex-col gap-4 py-4">
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sản phẩm
              </Link>
              <Link
                href="/track"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Theo dõi đơn
              </Link>
            </nav>
          </div>
        )}
      </header>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      {/* Sticky cart button for mobile */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Button
          size="lg"
          className="relative rounded-full h-14 w-14 shadow-lg"
          onClick={() => setCartOpen(true)}
          aria-label="Danh sách đặt trước"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 flex min-w-[20px] h-[20px] items-center justify-center rounded-full bg-destructive text-[11px] font-bold text-white shadow-md -translate-y-1/2 translate-x-1/2 px-1">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Button>
      </div>
    </>
  )
}

