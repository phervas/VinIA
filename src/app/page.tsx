'use client';

import { WineIcon } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center space-y-6">
        <WineIcon className="w-20 h-20 text-pink-500 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-900">Welcome to VinAI</h1>
        <p className="text-gray-600 max-w-sm mx-auto">
          Your personal AI sommelier to help you discover and pair the perfect wines for any occasion.
        </p>
        
        <Link 
          href="/home" 
          className="inline-block bg-pink-500 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-pink-600 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
