
import React, { useState, useRef, useEffect, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendImage: (base64ImageData: string, mimeType: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = React.memo(({ isOpen, onClose, onSendImage }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const startCamera = useCallback(async () => {
    if (stream) { // If stream already exists, just ensure video is playing
        if (videoRef.current && videoRef.current.paused) videoRef.current.play().catch(console.error);
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(err => {
            console.error("Error playing video stream:", err);
            setError("Could not play video stream. Ensure permissions are granted.");
        });
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            setError("Camera permission denied. Please enable camera access in your browser settings.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            setError("No camera found. Please ensure a camera is connected and enabled.");
        } else {
            setError(`Error accessing camera: ${err.message}`);
        }
      } else {
        setError("An unknown error occurred while accessing the camera.");
      }
      setStream(null);
    } finally {
        setIsLoading(false);
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null); // Reset captured image when modal closes
      setError(null); // Reset error when modal closes
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, startCamera, stopCamera]); // Added dependencies

  // Cleanup stream on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9); // Use JPEG for smaller size
        setCapturedImage(imageDataUrl);
        // Keep the stream active for retake
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (!stream && isOpen) { // If stream was somehow lost but modal is open
        startCamera();
    } else if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(console.error); // Ensure video is playing for retake
    }
  };

  const handleSendImage = () => {
    if (capturedImage) {
      onSendImage(capturedImage.split(',')[1], 'image/jpeg'); // Send base64 data only
      onClose(); // Close modal after sending
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-40 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gpt-light p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all text-gpt-text flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Capture Image</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close camera modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
            {error && <p className="text-red-400 mb-3 bg-red-900 p-3 rounded-md">{error}</p>}
            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner /> 
                    <span className="ml-2">Starting camera...</span>
                </div>
            )}

            {!capturedImage && stream && (
                <video ref={videoRef} className="w-full rounded-md bg-black mb-3" playsInline muted autoPlay />
            )}
            {capturedImage && (
                <img src={capturedImage} alt="Captured" className="w-full rounded-md mb-3" />
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>


        <div className="mt-4 pt-4 border-t border-gpt-gray flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          {!capturedImage && stream && (
            <button
              onClick={handleCapture}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Capture
            </button>
          )}
          {capturedImage && (
            <>
              <button
                onClick={handleRetake}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
              >
                Retake
              </button>
              <button
                onClick={handleSendImage}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Send Image
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #202123;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #444654;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555869;
          }
        `}</style>
      </div>
    </div>
  );
});

export default CameraModal;
