# Hướng dẫn cài đặt

## Bước 1: Cài đặt dependencies cơ bản

```bash
npm install
```

## Bước 2: Cài đặt các thư viện bổ sung

```bash
npm i zustand @tanstack/react-query react-hook-form zod @hookform/resolvers sonner framer-motion embla-carousel-react lucide-react
```

## Bước 3: Khởi tạo shadcn/ui

```bash
npx shadcn@latest init
```

Khi được hỏi, chọn:
- Style: Default
- Base color: Slate
- CSS variables: Yes

## Bước 4: Thêm các component shadcn/ui

```bash
npx shadcn@latest add button card badge input textarea dialog sheet separator accordion tabs skeleton toast label select
```

## Bước 5: Chạy dự án

```bash
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000)

## Lưu ý

- Tất cả dependencies đã được liệt kê trong `package.json`
- Nếu gặp lỗi về missing dependencies, chạy lại `npm install`
- Đảm bảo Node.js version >= 18.x

