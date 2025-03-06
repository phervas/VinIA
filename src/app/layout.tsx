import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppTemplate from '@/components/AppTemplate';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VinAI - Your Personal Wine Sommelier',
  description: 'AI-powered wine recommendations and food pairing assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppTemplate>{children}</AppTemplate>
      </body>
    </html>
  );
}
