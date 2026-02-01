# LALA-LYCHEEE - Nước Ép Vải Hảo Hạng Thanh Hà

Website bán nước ép vải nguyên chất 100% với Next.js 16, TypeScript, TailwindCSS và shadcn/ui, tích hợp với Backend API.

**Sản phẩm:** Nước ép vải thiều, nước ép vải nhỡ (u hồng), nước ép vải tàu lai, nước ép vải phối trộn.

## Cài đặt

```bash
npm install
```

## Cài đặt thư viện bổ sung

```bash
npm i zustand @tanstack/react-query react-hook-form zod @hookform/resolvers sonner framer-motion embla-carousel-react lucide-react
npx shadcn@latest init
npx shadcn@latest add button card badge input textarea dialog sheet separator accordion tabs skeleton toast alert
```

## Cấu hình API

Tạo file `.env.local` trong thư mục gốc:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
```

**Lưu ý:** 
- Đảm bảo Backend API đang chạy tại `http://localhost:8081`
- Nếu Backend chạy ở port khác, cập nhật `NEXT_PUBLIC_API_URL` tương ứng
- Frontend sẽ tự động fallback về mock data nếu API không khả dụng

## Chạy dự án

### 1. Chạy Backend (từ thư mục BackEnd)

```bash
cd ../BackEnd
npm run dev
```

Backend sẽ chạy tại `http://localhost:8081`

### 2. Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000`

## Tích hợp API

Frontend đã được tích hợp với Backend API:

### Products API
- `GET /api/v1/products` - Lấy danh sách sản phẩm
- `GET /api/v1/products/:id` - Lấy chi tiết sản phẩm
- `GET /api/v1/products/featured` - Lấy sản phẩm nổi bật
- `GET /api/v1/products/search?search=...` - Tìm kiếm sản phẩm

### Orders API
- `POST /api/v1/orders/guest` - Tạo đơn hàng (guest checkout)
- `GET /api/v1/orders/:id` - Lấy thông tin đơn hàng
- `GET /api/v1/orders/:id/tracking` - Lấy trạng thái đơn hàng

### Cart API (Optional)
- `GET /api/v1/cart` - Lấy giỏ hàng
- `POST /api/v1/cart/items` - Thêm vào giỏ hàng
- `PUT /api/v1/cart/items/:productId` - Cập nhật số lượng
- `DELETE /api/v1/cart/items/:productId` - Xóa khỏi giỏ hàng

**Lưu ý:** Cart hiện tại sử dụng Zustand store với localStorage. Có thể tích hợp với Backend Cart API nếu cần.

## Cấu trúc dự án

- `src/app/` - App Router routes
- `src/components/ui/` - shadcn/ui components
- `src/components/shop/` - Business components
- `src/lib/` - Utilities (bao gồm `api-client.ts`)
- `src/store/` - Zustand stores
- `src/data/` - Mock data (fallback khi API không khả dụng)
- `src/api/` - API client functions
  - `products.ts` - Product API functions
  - `orders.ts` - Order API functions
  - `cart.ts` - Cart API functions (optional)

## Sản phẩm

Dự án này chỉ bán **nước ép vải** với 4 loại:

1. **Nước Ép Vải Thiều** - 75.000đ
2. **Nước Ép Vải Nhỡ (U Hồng)** - 95.000đ
3. **Nước Ép Vải Tàu Lai** - 80.000đ
4. **Nước Ép Vải Phối Trộn** - 80.000đ

Tất cả sản phẩm đều:
- Nguyên chất 100% từ vải tươi
- Không chất bảo quản
- Không đường hóa học
- Ép lạnh giữ nguyên hương vị tự nhiên

## Tính năng

- ✅ Website chuyên bán nước ép vải
- ✅ Tích hợp Backend API
- ✅ Fallback về mock data nếu API lỗi
- ✅ Loading states và error handling
- ✅ Responsive design (mobile-first)
- ✅ SEO optimized
- ✅ Performance optimized
- ✅ Đặt trước sản phẩm với thanh toán COD
- ✅ Theo dõi đơn hàng
- ✅ Hiển thị 4 loại nước ép vải

## Mapping dữ liệu

Frontend tự động map dữ liệu từ Backend format sang Frontend format:

- **Product:** Backend `_id` → Frontend `id`, Backend `images[]` → Frontend `images[]`, etc.
- **Order:** Backend `orderNumber` → Frontend `code`, Backend status → Frontend status mapping
- **Slug:** Tự động generate từ product name nếu Backend không có slug

## Troubleshooting

### API không kết nối được
1. Kiểm tra Backend có đang chạy không
2. Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`
3. Kiểm tra CORS settings trong Backend
4. Frontend sẽ tự động fallback về mock data

### Products không hiển thị
1. Kiểm tra Backend có products không
2. Kiểm tra products có `isVisible: true` và `status: "active"` không
3. Xem console logs để debug

### Order không tạo được
1. Kiểm tra Backend API `/api/v1/orders/guest` có hoạt động không
2. Kiểm tra request payload format
3. Xem Network tab trong DevTools

