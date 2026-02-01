import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin", "vietnamese"] })

export const metadata: Metadata = {
  title: "LALA-LYCHEEE - Nước Ép Vải Thiều, Nhỡ, Tàu Lai & Phối Trộn",
  description: "Nước ép vải nguyên chất 100%: vải thiều, vải nhỡ, vải tàu lai và phối trộn. Không pha chế, không chất bảo quản. Sản phẩm tự nhiên tốt cho sức khỏe.",
  keywords: "nước ép vải, nước ép vải thiều, nước ép vải nhỡ, nước ép vải tàu lai, nước ép vải phối trộn, đồ uống tự nhiên",
  openGraph: {
    title: "LALA-LYCHEEE - Nước Ép Vải 100% Tự Nhiên",
    description: "Nước ép vải nguyên chất 100% từ vải tươi: thiều, nhỡ, tàu lai và phối trộn",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  )
}

