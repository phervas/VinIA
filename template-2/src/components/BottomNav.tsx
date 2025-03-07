'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, CameraIcon, UtensilsIcon, UserIcon } from 'lucide-react';

const navItems = [
  { name: 'Home', icon: HomeIcon, path: '/home' },
  { name: 'Scanner', icon: CameraIcon, path: '/scanner' },
  { name: 'Food+Wine', icon: UtensilsIcon, path: '/food-wine' },
  { name: 'Account', icon: UserIcon, path: '/account' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-pink-500' : 'text-gray-500'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 