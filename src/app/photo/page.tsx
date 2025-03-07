'use client';

import { useState, useRef } from 'react';
import { Camera, Loader2, X } from 'lucide-react';

export default function PhotoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Check if running on iOS or mobile
  const isIOS = typeof navigator !== 'undefined' && 
    /iPad|iPhone|iPod/.test(navigator.userAgent) && 
    !(window as any).MSStream;

  const isMobile = typeof navigator !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleCameraClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    // On iOS/mobile, don't set capture to get the native menu
    if (!isIOS && !isMobile) {
      input.capture = 'environment';
    }
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsLoading(true);
      console.log('File selected:', file.name, 'size:', file.size);

      try {
        const imageData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onloadstart = () => {
            console.log('Started reading file');
          };
          
          reader.onprogress = (event) => {
            if (event.lengthComputable) {
              console.log(`Reading progress: ${Math.round((event.loaded / event.total) * 100)}%`);
            }
          };
          
          reader.onload = () => {
            console.log('File read completed');
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to read image as string'));
            }
          };
          
          reader.onerror = () => {
            console.error('FileReader error:', reader.error);
            reject(new Error('Failed to read the image'));
          };
          
          reader.readAsDataURL(file);
        });

        // Create a new image to ensure it's loaded before showing
        const img = new Image();
        img.onload = () => {
          console.log('Image loaded successfully:', img.width, 'x', img.height);
          setCapturedImage(imageData);
          setError(null);
          setIsLoading(false);
        };
        img.onerror = () => {
          console.error('Image failed to load');
          setError('Failed to load the image. Please try again.');
          setIsLoading(false);
        };
        img.src = imageData;

      } catch (err) {
        console.error('Error handling image:', err);
        setError('Failed to read the image. Please try again.');
        setIsLoading(false);
      }
    };
    
    input.click();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Photo</h1>
        {/* Camera/Image Selection Section */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center max-w-xs">
                  <div className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                  <button
                    onClick={handleCameraClick}
                    className="w-full bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Try Again
                  </button>
                </div>
              </div>
            ) : isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
              </div>
            ) : capturedImage ? (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured image"
                  className="w-full h-full object-contain"
                  onLoad={() => console.log('Image rendered in DOM')}
                  onError={() => {
                    console.error('Image failed to render in DOM');
                    setError('Failed to display the image. Please try again.');
                  }}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <button
                    onClick={retakePhoto}
                    className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4 space-y-4">
                  <button
                    onClick={handleCameraClick}
                    className="bg-pink-500 text-white p-4 rounded-full hover:bg-pink-600 transition-colors shadow-lg"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                  <p className="text-sm text-gray-600 max-w-xs">
                    Tap to take a photo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 