import '../globals.scss'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* Main */}
      <main className=''>{children}</main>
    </>
  )
}
