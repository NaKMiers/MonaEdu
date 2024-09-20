import StoreProvider from '@/libs/StoreProvider'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import NextTopLoader from 'nextjs-toploader'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import authOptions from './api/auth/[...nextauth]/authOptions'
import './globals.scss'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Mona Edu',
  description:
    'Mona Edu - Nền tảng học trực tuyến hàng đầu Việt Nam. Chúng tôi cung cấp các khóa học trực tuyến chất lượng cao từ các nền tảng hàng đầu như: udemy.com, unica.vn, gitiho.com,....',
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Mona Edu',
    description:
      'Mona Edu - Nền tảng học trực tuyến hàng đầu Việt Nam. Chúng tôi cung cấp các khóa học trực tuyến chất lượng cao từ các nền tảng hàng đầu như: udemy.com, unica.vn, gitiho.com,....',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Mona Edu',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Mona Edu Logo',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mona Edu',
    description:
      'Mona Edu - Nền tảng học trực tuyến hàng đầu Việt Nam. Chúng tôi cung cấp các khóa học trực tuyến chất lượng cao từ các nền tảng hàng đầu như: udemy.com, unica.vn, gitiho.com,....',
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang='vi'>
      <body suppressHydrationWarning={true}>
        {/* Google Analytics Script */}
        <Script
          strategy='afterInteractive'
          src='https://www.googletagmanager.com/gtag/js?id=G-4PFK735075'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              gtag('config', 'G-4PFK735075');
            `}
        </Script>

        <StoreProvider session={session}>
          {/* Toast */}
          <Toaster
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />

          {/* Top Loader */}
          <NextTopLoader
            color='#F7E360'
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing='ease'
            speed={200}
            shadow='0 0 10px #F7E360,0 0 5px #F7E360'
            zIndex={1600}
            showAtBottom={false}
          />

          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
