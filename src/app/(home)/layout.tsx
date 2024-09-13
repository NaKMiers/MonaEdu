import Background from '@/components/backgrounds/Background'
import FloatingButtons from '@/components/floatings/FloatingButtons'
import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import PageLoading from '@/components/PageLoading'
import { ReactNode } from 'react'
import '../globals.scss'

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Floating Button */}
      <FloatingButtons />

      {/* Loading */}
      <PageLoading />

      {/* Main */}
      <main className='md:mb-auto md:mt-[72px] min-h-21'>{children}</main>

      {/* Background */}
      <Background />

      {/* Footer */}
      <Footer />
    </>
  )
}
