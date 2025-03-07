'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { CameraIcon, Camera, Loader2, X, AlertCircle } from 'lucide-react';

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading: isChatLoading } = useChat({
    api: '/api/openai/chat',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if running on iOS or mobile
  const isIOS = isClient && typeof navigator !== 'undefined' && 
    /iPad|iPhone|iPod/.test(navigator.userAgent) && 
    !(window as any).MSStream;

  const isMobile = isClient && typeof navigator !== 'undefined' && 
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

  const handleCapture = async () => {
    if (!capturedImage) return;
    
    setIsScanning(true);
    setError(null);
    
    try {
      // Here we would send the image to our API for processing
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful scan
      const response = "I've detected a wine label! This appears to be a 2021 Luberon 'Chemin des Loups' by Amédée.";
      // Add the response to the chat
      handleSubmit(new Event('submit') as any);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process the image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Camera/Image Selection Section */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center max-w-xs">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
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
                  ref={imageRef}
                  src={capturedImage}
                  alt="Captured wine label"
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
                  <button
                    onClick={handleCapture}
                    disabled={isScanning}
                    className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50"
                  >
                    {isScanning ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <CameraIcon className="w-6 h-6" />
                    )}
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
                    Tap to scan a wine label
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Chat Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'assistant'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-pink-500 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about wine scanning..."
            className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 