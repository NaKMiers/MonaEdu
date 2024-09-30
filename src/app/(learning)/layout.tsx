import AllLessons from '@/components/AllLessons'
import PageLoading from '@/components/PageLoading'
import UseDetectDevTools from '@/libs/hooks/useDetectDevTools'
import type { Metadata } from 'next'
import '../globals.scss'

export const metadata: Metadata = {
  title: 'Tiến trình - Mona Edu',
  description: 'Mona Edu - Học trực tuyến mọi lúc, mọi nơi',
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* Detect Dev Tools */}
      <UseDetectDevTools />

      {/* Loading */}
      <PageLoading />

      {/* Main */}
      <main className="flex gap-y-4">
        <AllLessons />

        {children}
      </main>
    </>
  )
}
