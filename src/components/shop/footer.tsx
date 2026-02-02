import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-background via-muted/20 to-muted/40">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              LALA-LYCHEEE
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Nước ép vải tự nhiên 100% từ vải tươi. Chất lượng đảm bảo, hương vị
              thuần khiết.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-base">Sản phẩm</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  href="/products?tag=vải thiều"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  Vải Thiều
                </Link>
              </li>
              <li>
                <Link
                  href="/products?tag=vải nhỡ"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  Vải Nhỡ
                </Link>
              </li>
              <li>
                <Link
                  href="/products?tag=vải tàu lai"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  Vải Tàu Lai
                </Link>
              </li>
              <li>
                <Link
                  href="/products?tag=phối trộn"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  Phối Trộn
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-base">Hỗ trợ</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/track"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  Theo dõi đơn hàng
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground cursor-not-allowed">Chính sách đổi trả</span>
              </li>
              <li>
                <span className="text-muted-foreground cursor-not-allowed">Câu hỏi thường gặp</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-base">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors">
                <a href="mailto:info@lalalycheee.vn" className="hover:text-primary">
                  Email: info@lalalycheee.vn
                </a>
              </li>
              <li className="hover:text-foreground transition-colors">
                <a href="tel:0962215666" className="hover:text-primary">
                  SĐT: 0962.215.666
                </a>
              </li>
              <li className="hover:text-foreground transition-colors">Giờ làm việc: 8:00 - 20:00</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 LALA-LYCHEEE. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  )
}

