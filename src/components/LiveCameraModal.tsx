import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, AlertCircle, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: { base64: string; mimeType: string; url: string; name: string }) => void;
  title?: string;
  subtitle?: string;
}

export default function LiveCameraModal({
  isOpen,
  onClose,
  onCapture,
  title = 'Live Camera (कैमरा)',
  subtitle = 'Take a clear photo for Jainism GPT analysis'
}: LiveCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isFlashActive, setIsFlashActive] = useState(false);

  // Stop camera tracks cleanly
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
  };

  // Start live camera stream
  const startCamera = async (mode: 'environment' | 'user') => {
    stopCamera();
    setIsInitializing(true);
    setError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported in this browser/webview');
      }

      // Check available devices to see if flip is possible
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      } catch {
        setHasMultipleCameras(true);
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch((err) => {
          console.warn('Video play auto-resume error:', err);
        });
      }
      setIsInitializing(false);
    } catch (err: any) {
      console.error('Camera stream error:', err);
      setIsInitializing(false);
      let errMsg = 'Camera access was not granted or is not available.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errMsg = 'कैमरा अनुमति (Permission) अस्वीकृत है। कृपया सेटिंग में जाकर परमिशन Allow करें या फ़ाइल विकल्प का उपयोग करें।';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errMsg = 'कोई कैमरा डिवाइस नहीं मिला।';
      }
      setError(errMsg);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPreviewImage(null);
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // Flip camera between front and back
  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture snapshot from live stream
  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Trigger visual flash
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, mirror image for natural selfie look
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setPreviewImage(dataUrl);
  };

  // Confirm and use captured photo
  const handleConfirmPhoto = () => {
    if (!previewImage) return;
    const base64 = previewImage.split(',')[1];
    onCapture({
      base64,
      mimeType: 'image/jpeg',
      url: previewImage,
      name: `camera_capture_${Date.now()}.jpg`,
    });
    stopCamera();
    onClose();
  };

  // Retake photo
  const handleRetake = () => {
    setPreviewImage(null);
    if (videoRef.current && stream) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Fallback file input change
  const handleFallbackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      onCapture({
        base64,
        mimeType: file.type || 'image/jpeg',
        url: dataUrl,
        name: file.name,
      });
      stopCamera();
      onClose();
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Native fallback file input */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fallbackInputRef}
        onChange={handleFallbackFileChange}
        className="hidden"
      />

      {/* Top Bar Header */}
      <div className="w-full max-w-lg flex items-center justify-between z-10 pt-2 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FF6D00]/20 border border-[#FF6D00]/40 flex items-center justify-center text-[#FF8A65]">
            <Camera size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{title}</h3>
            <p className="text-[10px] text-gray-400 font-medium">{subtitle}</p>
          </div>
        </div>

        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Camera Viewfinder Box */}
      <div className="w-full max-w-lg flex-1 relative rounded-3xl overflow-hidden bg-zinc-950 border border-white/15 flex items-center justify-center shadow-2xl my-2">
        {/* Flash Effect */}
        {isFlashActive && <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-200" />}

        {/* Viewfinder Corners Overlay */}
        <div className="absolute inset-4 pointer-events-none z-20 flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="w-6 h-6 border-t-2 border-l-2 border-[#FF6D00] rounded-tl-lg" />
            <div className="w-6 h-6 border-t-2 border-r-2 border-[#FF6D00] rounded-tr-lg" />
          </div>
          <div className="flex justify-between">
            <div className="w-6 h-6 border-b-2 border-l-2 border-[#FF6D00] rounded-bl-lg" />
            <div className="w-6 h-6 border-b-2 border-r-2 border-[#FF6D00] rounded-br-lg" />
          </div>
        </div>

        {/* Live Stream Video */}
        {!previewImage && !error && (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className={cn(
              "w-full h-full object-cover",
              facingMode === 'user' && "scale-x-[-1]"
            )}
          />
        )}

        {/* Captured Preview Image */}
        {previewImage && (
          <img
            src={previewImage}
            alt="Captured Snapshot"
            className="w-full h-full object-cover animate-in zoom-in-95 duration-150"
          />
        )}

        {/* Loading Spinner */}
        {isInitializing && !error && !previewImage && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 z-30">
            <RefreshCw size={28} className="text-[#FF8A65] animate-spin" />
            <span className="text-xs font-bold text-gray-200 tracking-wide">कैमरा शुरू हो रहा है...</span>
          </div>
        )}

        {/* Camera Permission / Error Fallback */}
        {error && (
          <div className="absolute inset-0 bg-zinc-900/95 p-6 flex flex-col items-center justify-center text-center gap-4 z-30">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle size={28} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-white">कैमरा एक्सेस की आवश्यकता है</h4>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs">{error}</p>
            </div>
            <div className="flex flex-col gap-2.5 w-full max-w-xs mt-2">
              <button
                onClick={() => startCamera(facingMode)}
                className="py-2.5 px-4 bg-[#FF6D00] hover:bg-[#E65100] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF6D00]/25 transition-all"
              >
                <RefreshCw size={14} /> पुनः प्रयास करें (Retry)
              </button>
              <button
                onClick={() => fallbackInputRef.current?.click()}
                className="py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-all"
              >
                <ImageIcon size={14} /> गैलरी / फ़ाइल से चुनें
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="w-full max-w-lg flex items-center justify-between px-4 py-3 z-10">
        {!previewImage ? (
          <>
            {/* Gallery / File Picker button */}
            <button
              onClick={() => fallbackInputRef.current?.click()}
              className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95"
              title="Upload from gallery"
            >
              <ImageIcon size={18} />
              <span className="text-[8px] font-bold uppercase">Files</span>
            </button>

            {/* Main Shutter / Capture Button */}
            <button
              onClick={handleCaptureSnapshot}
              disabled={isInitializing || !!error}
              className="w-18 h-18 rounded-full bg-gradient-to-tr from-[#FF6D00] to-[#FFB300] p-1.5 shadow-[0_0_25px_rgba(255,109,0,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center"
            >
              <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center bg-white/20">
                <div className="w-10 h-10 rounded-full bg-white shadow-md" />
              </div>
            </button>

            {/* Flip / Switch Camera Button */}
            <button
              onClick={handleToggleCamera}
              disabled={isInitializing || !hasMultipleCameras}
              className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 disabled:opacity-30"
              title="Flip camera"
            >
              <RefreshCw size={18} />
              <span className="text-[8px] font-bold uppercase">Flip</span>
            </button>
          </>
        ) : (
          <>
            {/* Retake Button */}
            <button
              onClick={handleRetake}
              className="flex-1 mr-2 py-3.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <RefreshCw size={15} /> दोबारा लें (Retake)
            </button>

            {/* Confirm & Use Photo Button */}
            <button
              onClick={handleConfirmPhoto}
              className="flex-1 ml-2 py-3.5 bg-gradient-to-r from-[#FF6D00] to-[#FFB300] text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF6D00]/30 transition-all active:scale-98 hover:brightness-110"
            >
              <Check size={16} /> फ़ोटो जोड़ें (Use Photo)
            </button>
          </>
        )}
      </div>
    </div>
  );
}
