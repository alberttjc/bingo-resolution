import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { BingoProvider } from '@/lib/bingo-context'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Resolution Bingo - Gamify Your New Year Goals',
  description: 'Create personalized bingo cards for your New Year resolutions. Track your goals in a fun, motivating way.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <BingoProvider>
          {children}
        </BingoProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
