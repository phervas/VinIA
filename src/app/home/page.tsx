import { UtensilsIcon, CameraIcon } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="p-4 space-y-6">
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to VinAI</h1>
        <p className="text-gray-600">
          What would you like to do today?
        </p>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/scanner"
          className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-2"
        >
          <CameraIcon className="w-8 h-8 text-pink-500" />
          <span className="text-sm font-medium text-gray-900">Scan Wine</span>
        </Link>

        <Link
          href="/food-wine"
          className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-2"
        >
          <UtensilsIcon className="w-8 h-8 text-pink-500" />
          <span className="text-sm font-medium text-gray-900">Find Pairing</span>
        </Link>
      </div>

      <section className="bg-white rounded-xl p-4 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Scans</h2>
        <div className="text-gray-500 text-center py-8">
          No recent scans yet. Try scanning a wine bottle!
        </div>
      </section>
    </div>
  );
} 