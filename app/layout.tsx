import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth-provider';
import { ClientLayout } from '@/components/client-layout';

export const metadata: Metadata = {
  title: 'Dinner Tracker',
  description: 'Keep track of your dinners and friends',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=0.86, user-scalable=no, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap"
        />
        <title>Dinner Tracker</title>
      </head>
      <body className="relative flex w-full min-h-screen flex-col bg-[#FFFFFF] justify-between group/design-root overflow-x-hidden font-sans">
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
