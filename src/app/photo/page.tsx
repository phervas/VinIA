'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Loader2, X, Upload, Info, Check } from 'lucide-react';
import Webcam from 'react-webcam';

export default function PhotoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [acceptedImage, setAcceptedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Detect iOS/mobile
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const isIOS = isClient && typeof navigator !== 'undefined' && 
    /iPad|iPhone|iPod/.test(navigator.userAgent) && 
    !(window as any).MSStream;

  const isMobile = isClient && typeof navigator !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Handle camera button click - simplified to just activate the camera
  const handleCameraClick = () => {
    setIsCameraActive(true);
  };

  // Open native camera on iOS
  const openNativeCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsLoading(true);
      
      try {
        const imageData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to read image as string'));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read the image'));
          reader.readAsDataURL(file);
        });

        // Create a new image to ensure it's loaded before showing
        const img = new Image();
        img.onload = () => {
          setCapturedImage(imageData);
          setError(null);
          setIsLoading(false);
        };
        img.onerror = () => {
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

  // Take photo from webcam
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

  // Handle upload button
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

  const retakePhoto = () => {
    setCapturedImage(null);
    setError(null);
    
    // If not iOS, restart the camera
    if (!isIOS) {
      setIsCameraActive(true);
    }
  };

  // Handle webcam errors with more specific messages
  const handleWebcamError = useCallback((err: string | Error) => {
    console.error('Webcam error:', err);
    setCameraPermission(false);
    
    // More specific error messages based on the error
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

  // Handle successful camera access
  const handleUserMedia = useCallback(() => {
    setCameraPermission(true);
    setError(null);
  }, []);

  // Video constraints for webcam - simplified to match working example
  const videoConstraints = {
    facingMode: "environment",
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Photo</h1>
        
        {/* Camera/Image Display Container */}
        <div className="bg-black rounded-xl overflow-hidden relative aspect-[9/16] max-h-[70vh]">
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
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured wine label"
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
                  onClick={() => {
                    setAcceptedImage(capturedImage);
                    setCapturedImage(null);
                    setIsCameraActive(false);
                  }}
                  className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors shadow-lg"
                >
                  <Check className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : acceptedImage ? (
            <div className="relative w-full h-full">
              <img
                src={acceptedImage}
                alt="Accepted wine label"
                className="w-full h-full object-contain"
              />
            </div>
          ) : isCameraActive ? (
            <div className="relative w-full h-full">
              {/* React-Webcam component */}
              <Webcam
                audio={false}
                ref={webcamRef}
                width={1920}
                height={1080}
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
                  onClick={() => setIsCameraActive(false)}
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
                    Position the wine label within the frame and tap the white button
                  </p>
                </div>
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
                <p className="text-sm text-gray-100 max-w-xs">
                  Tap to scan a wine label
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
} 