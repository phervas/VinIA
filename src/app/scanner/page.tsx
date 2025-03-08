'use client';

import { useState, useRef } from 'react';
import { useChat } from 'ai/react';
import { Camera, Loader2, AlertCircle } from 'lucide-react';
import PhotoCapture from '../components/PhotoCapture';

interface ScanResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Custom hook to handle wine label scanning logic
 */
const useWineScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanWineLabel = async (imageData: string): Promise<ScanResult> => {
    try {
      setIsScanning(true);
      setError(null);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        message: "I've detected a wine label! This appears to be a 2021 Luberon 'Chemin des Loups' by Amédée."
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process the image';
      setError(errorMessage);
      return {
        success: false,
        message: '',
        error: errorMessage
      };
    } finally {
      setIsScanning(false);
    }
  };

  return {
    isScanning,
    error,
    scanWineLabel,
    setError
  };
};

/**
 * Scanner Page Component
 * 
 * Provides functionality to capture wine label images and get AI-powered
 * information about the wine. Uses the PhotoCapture component for image
 * capture and the OpenAI API for wine analysis.
 */
export default function ScannerPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isPhotoCaptureOpen, setIsPhotoCaptureOpen] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const { isScanning, error, scanWineLabel, setError } = useWineScanner();
  const { messages, input, handleInputChange, handleSubmit, isLoading: isChatLoading } = useChat({
    api: '/api/openai/chat',
  });

  const handleCapture = async () => {
    if (!capturedImage) return;
    
    const result = await scanWineLabel(capturedImage);
    if (result.success) {
      // Add the scan result to the chat
      handleSubmit(new Event('submit') as any);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Image Capture Section */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center max-w-xs">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                  <button
                    onClick={() => setIsPhotoCaptureOpen(true)}
                    className="w-full bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Try Again
                  </button>
                </div>
              </div>
            ) : capturedImage ? (
              <div className="relative">
                <img
                  ref={imageRef}
                  src={capturedImage}
                  alt="Captured wine label"
                  className="w-full h-full object-contain"
                  onError={() => setError('Failed to display the image. Please try again.')}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <button
                    onClick={handleCapture}
                    disabled={isScanning}
                    className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Scanning...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        <span>Scan Label</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4 space-y-4">
                  <button
                    onClick={() => setIsPhotoCaptureOpen(true)}
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

        {/* Chat Messages */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
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
            disabled={isChatLoading}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>

      {/* Photo Capture Component */}
      <PhotoCapture
        isOpen={isPhotoCaptureOpen}
        onAccept={(imageData) => {
          setCapturedImage(imageData);
          setIsPhotoCaptureOpen(false);
        }}
        onCancel={() => setIsPhotoCaptureOpen(false)}
      />
    </div>
  );
} 