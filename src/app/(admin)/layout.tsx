import PageLoading from '@/components/PageLoading'
import AdminMenu from '@/components/admin/AdminMenu'
import Header from '@/components/layouts/Header'
import StoreProvider from '@/libs/StoreProvider'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Toaster } from 'react-hot-toast'
import authOptions from '../api/auth/[...nextauth]/authOptions'
import '../globals.scss'

export const metadata: Metadata = {
  title: 'Mona Edu',
  description: 'Mona Edu - Nền tảng học trực tuyến hàng đầu Việt Nam',
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
  const session = await getServerSession(authOptions)

  return (
    <html lang='vi'>
      <body className='bg-neutral-800 text-white' suppressHydrationWarning={true}>
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

          <Header />

          {/* Menu */}
          <AdminMenu />

          {/* Loading */}
          <PageLoading />

          {/* Main */}
          <main className='mb-[72px] md:mb-auto md:mt-[72px] px-21 py-21'>{children}</main>
        </StoreProvider>
      </body>
    </html>
  )
}
