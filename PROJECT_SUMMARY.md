# Tóm tắt dự án LALA-LYCHEEE - Nước Ép Vải Hảo Hạng Thanh Hà

**Mục đích:** Website chuyên bán nước ép vải nguyên chất 100% với 4 loại sản phẩm:
- Nước Ép Vải Thiều (75.000đ)
- Nước Ép Vải Nhỡ/U Hồng (95.000đ)
- Nước Ép Vải Tàu Lai (80.000đ)
- Nước Ép Vải Phối Trộn (80.000đ)

## Cấu trúc dự án

```
OrderFe/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (shop)/            # Route group cho shop
│   │   │   ├── layout.tsx     # Layout chung (Header + Footer)
│   │   │   ├── page.tsx        # Trang chủ (/)
│   │   │   ├── products/       # Danh sách sản phẩm
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/    # Chi tiết sản phẩm
│   │   │   ├── checkout/       # Thanh toán
│   │   │   ├── order/          # Kết quả đặt hàng
│   │   │   │   └── success/
│   │   │   └── track/          # Theo dõi đơn hàng
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   └── not-found.tsx       # 404 page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── shop/              # Business components
│   │       ├── header.tsx
│   │       ├── hero.tsx
│   │       ├── trust-badges.tsx
│   │       ├── product-card.tsx
│   │       ├── product-grid.tsx
│   │       ├── product-gallery.tsx
│   │       ├── price-block.tsx
│   │       ├── quantity-selector.tsx
│   │       ├── add-to-cart-button.tsx
│   │       ├── cart-drawer.tsx
│   │       ├── checkout-form.tsx
│   │       ├── order-summary.tsx
│   │       ├── reviews.tsx
│   │       ├── faq-accordion.tsx
│   │       ├── footer.tsx
│   │       ├── product-details.tsx
│   │       └── order-status-stepper.tsx
│   ├── lib/
│   │   └── utils.ts           # Utilities (cn, formatMoney, etc.)
│   ├── store/
│   │   └── cart.ts            # Zustand cart store
│   ├── data/
│   │   └── products.ts        # Mock data
│   └── api/
│       └── orders.ts          # Mock API functions
```

## Tính năng đã triển khai

### ✅ Trang chủ (/)
- Hero section với CTA
- Trust badges (giao hàng, đổi trả, thanh toán)
- Sản phẩm nổi bật
- Đánh giá khách hàng
- FAQ accordion

### ✅ Danh sách sản phẩm (/products)
- Grid layout responsive
- Tìm kiếm sản phẩm
- Lọc theo tag
- Skeleton loading
- Product cards với rating, giá, discount

### ✅ Chi tiết sản phẩm (/products/[slug])
- Image gallery với carousel (embla)
- Thông tin sản phẩm đầy đủ
- Quantity selector
- Add to cart button
- Tabs: Mô tả & Đánh giá
- SEO metadata

### ✅ Giỏ hàng
- Cart drawer (mở từ phải)
- Xem, sửa, xóa sản phẩm
- Quantity selector trong cart
- Tổng tiền tự động tính
- Sticky cart button trên mobile

### ✅ Thanh toán (/checkout)
- Form validation với zod
- Thông tin khách hàng
- Phương thức thanh toán
- Order summary
- Mã giảm giá UI (mock)

### ✅ Kết quả đặt hàng (/order/success)
- Hiển thị mã đơn hàng
- CTA theo dõi đơn hàng
- Link về trang chủ

### ✅ Theo dõi đơn hàng (/track)
- Nhập mã đơn hàng
- Hiển thị trạng thái với stepper UI
- Chi tiết đơn hàng
- 4 trạng thái: Pending → Confirmed → Shipping → Delivered

## Stack công nghệ

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Library**: shadcn/ui (Radix UI)
- **Icons**: lucide-react
- **Forms**: react-hook-form + zod
- **State**: zustand (với localStorage persistence)
- **Data Fetching**: @tanstack/react-query
- **Toast**: sonner
- **Carousel**: embla-carousel-react
- **Animations**: framer-motion (sẵn sàng sử dụng)

## Sản phẩm

- **4 loại nước ép vải:**
  1. Nước Ép Vải Thiều - 75.000đ
  2. Nước Ép Vải Nhỡ (U Hồng) - 95.000đ
  3. Nước Ép Vải Tàu Lai - 80.000đ
  4. Nước Ép Vải Phối Trộn - 80.000đ

- Tất cả đều nguyên chất 100%, không chất bảo quản, không đường hóa học
- Ép lạnh giữ nguyên hương vị tự nhiên

## Mock Data

- 4 sản phẩm nước ép vải (mock data)
- Reviews mẫu
- API mock với localStorage (đã tích hợp Backend API)

## Responsive Design

- Mobile-first approach
- Sticky header
- Sticky cart button trên mobile
- Grid layout tự động điều chỉnh
- Mobile menu

## SEO & Performance

- generateMetadata cho product pages
- OpenGraph tags
- Priority images
- Next.js Image optimization
- Aria labels đầy đủ

## Cách chạy

Xem file `INSTALLATION.md` để biết chi tiết.

```bash
npm install
npm run dev
```

## Lưu ý

- ✅ Đã tích hợp Backend API (có fallback về mock data)
- ✅ Chỉ bán nước ép vải, không phải e-commerce tổng quát
- ✅ Phương thức thanh toán: Đặt trước sản phẩm, thanh toán COD khi nhận hàng
- Images đang dùng Unsplash placeholder, cần thay bằng ảnh thật của sản phẩm
- Tất cả sản phẩm đều có rating 5 sao

