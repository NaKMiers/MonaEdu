import Background from '@/components/backgrounds/Background';
import FloatingButtons from '@/components/floatings/FloatingButtons';
import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import PageLoading from '@/components/PageLoading';
import StoreProvider from '@/libs/StoreProvider';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Toaster } from 'react-hot-toast';
import '../globals.scss';

export const metadata: Metadata = {
  title: 'Mona Edu',
  description: 'Mona Edu - Nền tảng học trực tuyến hàng đầu Việt Nam',
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang='vi'>
      <body className='' suppressHydrationWarning={true}>
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

          {/* Header */}
          <Header />

          {/* Loading */}
          <PageLoading />

          {/* Floating Button */}
          <FloatingButtons />

          {/* Main */}
          <main className='md:mb-auto md:mt-[72px]'>{children}</main>

          {/* Background */}
          <Background />

          {/* Footer */}
          {/* <Footer /> */}
        </StoreProvider>
      </body>
    </html>
  );
}
