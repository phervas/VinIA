'use client';

import Image from 'next/image';
import { WineIcon } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
      <div className="flex justify-between items-center px-4 h-16">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <Image
              src="/placeholder-avatar.png"
              alt="User avatar"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium">John Doe</span>
        </div>
        <div className="flex items-center space-x-2">
          <WineIcon className="w-6 h-6 text-pink-500" />
          <span className="text-sm font-semibold text-pink-500">VinAI</span>
        </div>
      </div>
    </header>
  );
} 