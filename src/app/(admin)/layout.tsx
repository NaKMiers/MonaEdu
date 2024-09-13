import AdminMenu from '@/components/admin/AdminMenu'
import Header from '@/components/layouts/Header'
import '../globals.scss'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Menu */}
      <AdminMenu />

      {/* Main */}
      <main className='mb-[72px] md:mb-auto md:mt-[72px] px-21 py-21'>{children}</main>
    </>
  )
}
