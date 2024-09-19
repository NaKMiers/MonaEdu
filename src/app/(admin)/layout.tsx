import AdminMenu from '@/components/admin/AdminMenu'
import Header from '@/components/layouts/Header'
import '../globals.scss'
import PageLoading from '@/components/PageLoading'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='bg-neutral-800 text-light pt-[72px] -mt-[72px] min-h-[calc(100vh+72px)]'>
      {/* Header */}
      <Header />

      {/* Menu */}
      <AdminMenu />

      {/* Loading */}
      <PageLoading />

      {/* Main */}
      <main className='mb-[72px] md:mb-auto md:mt-[72px] px-21 py-21'>{children}</main>
    </div>
  )
}
