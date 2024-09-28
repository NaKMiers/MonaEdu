import Footer from '@/components/layouts/Footer'
import PageLoading from '@/components/PageLoading'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <>
      {/* Loading */}
      <PageLoading />

      <div className={`trans-300 fixed left-21 top-21 flex items-center gap-3`}>
        <Link
          href="/"
          prefetch={false}
          className="trans-200 spin shrink-0 rounded-md"
        >
          <Image
            className="aspect-square rounded-md"
            src="/images/logo.png"
            width={32}
            height={32}
            alt="Mona-Edu"
          />
        </Link>
        <Link
          href="/"
          prefetch={false}
          className="text-2xl font-bold"
        >
          MonaEdu
        </Link>
      </div>

      {/* Main */}
      <main className="min-h-screen bg-slate-100">{children}</main>

      {/* Footer */}
      <Footer />
    </>
  )
}
