import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pembayaran | TKIT Miftahussalam",
  description: "Pembayaran biaya masuk TKIT Miftahussalam",
  icons: {
    icon: "https://tkitmiftahussalam.instawp.xyz/wp-content/uploads/2022/02/cropped-logo-miftahussalam-192x192.png",
    apple: "https://tkitmiftahussalam.instawp.xyz/wp-content/uploads/2022/02/cropped-logo-miftahussalam-192x192.png",
    shortcut: "https://tkitmiftahussalam.instawp.xyz/wp-content/uploads/2022/02/cropped-logo-miftahussalam-192x192.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}


import './globals.css'