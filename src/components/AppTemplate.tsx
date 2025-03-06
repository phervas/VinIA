'use client';

import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { usePathname } from 'next/navigation';

export default function AppTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNav = pathname !== '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {showNav && <Header />}
      <main className={showNav ? "pt-16 pb-16" : ""}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
} 