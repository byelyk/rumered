import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ConditionalStackProvider } from '@/components/conditional-stack-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rumered - College Style & Dorm Room Platform',
  description:
    'The ultimate platform for college students to showcase their style and dorm room setups. Vote on outfits and room tours, and get inspired by your peers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConditionalStackProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ConditionalStackProvider>
      </body>
    </html>
  );
}
