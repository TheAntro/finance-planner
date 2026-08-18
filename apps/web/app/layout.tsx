import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Providers from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Networth Tracker",
  description: "Track your networth over time",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scrollbar-gutter-stable antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <div className="mx-auto w-full max-w-4xl px-4">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
