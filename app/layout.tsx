import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FinWork – Lowongan Kerja Finance & Keuangan Terbaik Indonesia',
    template: '%s | FinWork',
  },
  description:
    'Portal lowongan kerja khusus bidang keuangan, perbankan, investasi, dan fintech di Indonesia. Temukan karir impian Anda bersama FinWork.',
  keywords: [
    'lowongan kerja finance',
    'lowongan kerja keuangan',
    'jobs finance indonesia',
    'karir perbankan',
    'investment banking jobs',
    'fintech jobs indonesia',
    'akuntan lowongan',
    'analyst keuangan',
  ],
  authors: [{ name: 'FinWork' }],
  creator: 'FinWork',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'FinWork',
    title: 'FinWork – Lowongan Kerja Finance & Keuangan Terbaik Indonesia',
    description:
      'Portal lowongan kerja khusus bidang keuangan, perbankan, investasi, dan fintech di Indonesia.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinWork – Lowongan Kerja Finance & Keuangan',
    description: 'Temukan karir keuangan impian Anda di FinWork.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <body className="font-body bg-navy-900 text-white antialiased">
        {children}
      </body>
    </html>
  )
}
