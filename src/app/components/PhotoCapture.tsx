'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Loader2, X, Upload, Check } from 'lucide-react';
import Webcam from 'react-webcam';

interface PhotoCaptureProps {
  onAccept: (imageData: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

/**
 * PhotoCapture Component
 * 
 * A reusable component that provides photo capturing functionality using react-webcam.
 * Can be used as a modal/full-screen overlay for taking photos or uploading images.
 * 
 * @param onAccept - Callback function when image is accepted (receives image data as base64)
 * @param onCancel - Callback function when capture is cancelled
 * @param isOpen - Boolean to control component visibility
 */
export default function PhotoCapture({ onAccept, onCancel, isOpen }: PhotoCaptureProps) {
  // State Management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  
  // Refs
  const webcamRef = useRef<Webcam>(null);
  
  // Reset state when component is closed
  useEffect(() => {
    if (!isOpen) {
      setCapturedImage(null);
      setError(null);
      setIsCameraActive(false);
    }
  }, [isOpen]);

  // Client-side detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Automatically activate camera when component is opened
  useEffect(() => {
    if (isOpen) {
      setIsCameraActive(true);
    }
  }, [isOpen]);
  
  /**
   * Captures a photo from the webcam
   */
  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return;
    
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setIsCameraActive(false);
      } else {
        setError('Failed to capture image. Please try again.');
      }
    } catch (err) {
      console.error('Error capturing webcam image:', err);
      setError('Failed to capture image. Please try again.');
    }
  }, [webcamRef]);

  /**
   * Opens file picker for image upload
   */
  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      setIsLoading(true);
      
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && typeof e.target.result === 'string') {
            setCapturedImage(e.target.result);
            setError(null);
            setIsCameraActive(false);
          }
          setIsLoading(false);
        };
        
        reader.onerror = () => {
          setError('Failed to read the selected image.');
          setIsLoading(false);
        };
        
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Error handling upload:', err);
        setError('Failed to process the uploaded image.');
        setIsLoading(false);
      }
    };
    
    input.click();
  };

  /**
   * Clears the captured image and restarts the camera
   */
  const retakePhoto = () => {
    setCapturedImage(null);
    setError(null);
    setIsCameraActive(true);
  };

  /**
   * Handles webcam access errors with specific error messages
   */
  const handleWebcamError = useCallback((err: string | Error) => {
    console.error('Webcam error:', err);
    setCameraPermission(false);
    
    if (err instanceof Error) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access was denied. Please allow access when prompted.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera found. Please ensure your device has a camera.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is in use by another application.');
      } else if (err.name === 'NotSupportedError') {
        setError('Camera API is not supported in this browser. Please try using HTTPS.');
      } else {
        setError(`Camera error: ${err.message}`);
      }
    } else {
      setError('Failed to access camera. Please try again.');
    }
    
    setIsCameraActive(false);
  }, []);

  /**
   * Handles successful camera access
   */
  const handleUserMedia = useCallback(() => {
    setCameraPermission(true);
    setError(null);
  }, []);

  // Camera configuration
  const videoConstraints = {
    facingMode: "environment", // Use back camera
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative h-full">
        {/* Error State */}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center max-w-xs">
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={() => setIsCameraActive(true)}
                className="w-full bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        ) : isLoading ? (
          // Loading State
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        ) : capturedImage ? (
          // Image Review State
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Captured image"
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-8">
              <button
                onClick={retakePhoto}
                className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
              <button
                onClick={() => onAccept(capturedImage)}
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors shadow-lg"
              >
                <Check className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : isCameraActive ? (
          // Active Camera State
          <div className="relative w-full h-full">
            {/* Camera */}
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.92}
              videoConstraints={videoConstraints}
              onUserMediaError={handleWebcamError}
              onUserMedia={handleUserMedia}
              className="absolute inset-0 w-full h-full object-cover"
              mirrored={false}
              forceScreenshotSourceSize={true}
            />
            
            {/* Wine label positioning guides */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full flex items-center justify-center -translate-y-12">
                {/* Rectangle frame for label */}
                <div className="w-3/4 h-1/2 border-2 border-white rounded-lg"></div>
                
                {/* Corner guides */}
                <div className="absolute top-1/4 left-[12.5%] w-8 h-8 border-l-2 border-t-2 border-white"></div>
                <div className="absolute top-1/4 right-[12.5%] w-8 h-8 border-r-2 border-t-2 border-white"></div>
                <div className="absolute bottom-1/4 left-[12.5%] w-8 h-8 border-l-2 border-b-2 border-white"></div>
                <div className="absolute bottom-1/4 right-[12.5%] w-8 h-8 border-r-2 border-b-2 border-white"></div>
              </div>
            </div>
            
            {/* Camera controls */}
            <div className="absolute bottom-16 left-0 right-0 flex justify-between px-8">
              <button
                onClick={handleUpload}
                className="bg-gray-800 bg-opacity-50 text-white p-3 rounded-full"
              >
                <Upload className="w-6 h-6" />
              </button>
              
              <button
                onClick={capturePhoto}
                className="bg-white p-4 rounded-full shadow-lg"
              >
                <div className="w-10 h-10 rounded-full border-2 border-gray-300"></div>
              </button>
              
              <button
                onClick={onCancel}
                className="bg-gray-800 bg-opacity-50 text-white p-3 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Bottom info banner */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white py-2">
              <div className="flex items-center justify-center gap-1 px-3">
                <Camera className="w-4 h-4" />
                <p className="text-xs">
                  Position the image within the frame and tap the white button
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 