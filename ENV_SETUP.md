# Environment Variables Setup

## Cách sử dụng Environment Variables trong OrderFe

### 1. Tạo file `.env.local`

Next.js tự động load environment variables từ các file sau (theo thứ tự ưu tiên):
- `.env.local` (ưu tiên cao nhất, không commit vào git)
- `.env.development` (chỉ load khi `npm run dev`)
- `.env.production` (chỉ load khi `npm run build` và `npm start`)
- `.env` (load mọi lúc)

**Khuyến nghị**: Sử dụng `.env.local` cho development.

### 2. Copy file template

```bash
# Copy file example
cp .env.example .env.local
```

### 3. Cập nhật giá trị trong `.env.local`

Mở file `.env.local` và cập nhật với API endpoint của bạn:

```env
# Main API base URL (for orders, products, auth, cart)
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1

# Products CRUD API base URL (for admin product management)
NEXT_PUBLIC_PRODUCTS_API_URL=http://localhost:8081/products
```

### 4. Lưu ý quan trọng

- **Phải có prefix `NEXT_PUBLIC_`**: Next.js chỉ expose environment variables có prefix này cho client-side code
- **Restart dev server**: Sau khi thay đổi `.env.local`, bạn phải restart dev server:
  ```bash
  # Dừng server (Ctrl+C)
  # Sau đó chạy lại
  npm run dev
  ```
- **Build time**: Environment variables được embed vào code khi build, không thể thay đổi runtime

### 5. Kiểm tra environment variables

Để kiểm tra xem environment variables có được load đúng không, bạn có thể:

1. **Log trong code** (chỉ trong development):
   ```typescript
   console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)
   ```

2. **Kiểm tra trong browser console** (chỉ variables có `NEXT_PUBLIC_` prefix)

### 6. Production Deployment

Khi deploy lên production (Vercel, Docker, etc.), bạn cần set environment variables trong platform settings:

**Vercel:**
- Settings → Environment Variables
- Add `NEXT_PUBLIC_API_URL` và `NEXT_PUBLIC_PRODUCTS_API_URL`

**Docker:**
```dockerfile
ENV NEXT_PUBLIC_API_URL=http://your-api-server.com/api/v1
ENV NEXT_PUBLIC_PRODUCTS_API_URL=http://your-api-server.com/products
```

**PM2 (ecosystem.config.js):**
```javascript
env: {
  NEXT_PUBLIC_API_URL: "http://your-api-server.com/api/v1",
  NEXT_PUBLIC_PRODUCTS_API_URL: "http://your-api-server.com/products"
}
```

### 7. Troubleshooting

**Vấn đề**: Environment variables không hoạt động

**Giải pháp**:
1. ✅ Đảm bảo file `.env.local` tồn tại trong root directory (cùng cấp với `package.json`)
2. ✅ Đảm bảo có prefix `NEXT_PUBLIC_` cho client-side variables
3. ✅ Restart dev server sau khi thay đổi
4. ✅ Không có khoảng trắng xung quanh dấu `=`
5. ✅ Không có quotes (dấu ngoặc kép) xung quanh giá trị (trừ khi giá trị có khoảng trắng)

**Ví dụ đúng**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
```

**Ví dụ sai**:
```env
NEXT_PUBLIC_API_URL = "http://localhost:8081/api/v1"  # ❌ Có khoảng trắng và quotes
```
