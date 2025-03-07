'use client';

import { WineIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WelcomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 md:overflow-hidden">
      <div className="text-center space-y-6 -mt-[env(safe-area-inset-top)]">
        <div className="flex flex-col items-center space-y-4">
          <WineIcon className="w-20 h-20 text-pink-500" />
          <h1 className="text-3xl font-bold text-gray-900">Welcome to VinAI</h1>
          <p className="text-gray-600 max-w-sm">
            Your personal AI sommelier to help you discover and pair the perfect wines for any occasion.
          </p>
        </div>
        
        <Link href="/home" className="block">
          <button
            className="inline-block bg-pink-500 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-pink-600 transition-colors"
          >
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
