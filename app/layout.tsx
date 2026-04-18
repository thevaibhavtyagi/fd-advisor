import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Noto_Sans_Devanagari } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-devanagari',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FD Advisor | Blostem',
  description: 'Your trusted multilingual guide to Fixed Deposits. Understand FD offers in simple Hindi, Marathi, or English.',
  generator: 'Blostem',
  keywords: ['Fixed Deposit', 'FD', 'Investment', 'Hindi', 'Marathi', 'Banking', 'Finance'],
  authors: [{ name: 'Blostem' }],
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0F172A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${notoDevanagari.variable}`}>
      <body className="font-sans antialiased bg-background overflow-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
