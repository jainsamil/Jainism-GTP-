import { useState, useRef, useEffect } from 'react';
import { Camera, Video, VideoOff, Sparkles, UploadCloud, X, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

interface ManuscriptCameraScanProps {
  onScanResult: (result: {
    literalHi: string;
    literalEn: string;
    scientificHi: string;
    src: string;
    originText: string;
  }) => void;
  onClose: () => void;
}

export default function ManuscriptCameraScan({ onScanResult, onClose }: ManuscriptCameraScanProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load video devices
  useEffect(() => {
    if (activeTab === 'camera') {
      navigator.mediaDevices.enumerateDevices()
        .then(deviceList => {
          const videoDevices = deviceList.filter(d => d.kind === 'videoinput');
          setDevices(videoDevices);
          if (videoDevices.length > 0 && !selectedDeviceId) {
            // Prefer environment (back) camera if found
            const backCam = videoDevices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
            setSelectedDeviceId(backCam ? backCam.deviceId : videoDevices[0].deviceId);
          }
        })
        .catch(err => {
          console.error("Error listing devices:", err);
        });
    }
    return () => stopCamera();
  }, [activeTab]);

  // Start Camera when selected device or tab changes
  useEffect(() => {
    if (activeTab === 'camera' && selectedDeviceId) {
      startCamera(selectedDeviceId);
    } else {
      stopCamera();
    }
  }, [activeTab, selectedDeviceId]);

  const startCamera = async (deviceId?: string) => {
    setError(null);
    stopCamera();
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId 
          ? { deviceId: { exact: deviceId } } 
          : { facingMode: { ideal: 'environment' } }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(e => console.error("Video play failed:", e));
      }
    } catch (err: any) {
      console.error("Camera open error:", err);
      setError(
        language === 'en' 
          ? "Unable to access camera. Please allow camera permissions or upload an image instead." 
          : "कैमरा खोलने में असमर्थ। कृपया कैमरा अनुमति प्रदान करें या इसके स्थान पर फोटो अपलोड करें।"
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        // Set canvas dimensions equal to video stream layout size
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        // Mirror check if it's front facing may not be strictly needed here
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const base64Data = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(base64Data);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAnalyze = async () => {
    if (!capturedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/manuscript/translate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: capturedImage }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        onScanResult(data.result);
        onClose();
      } else {
        throw new Error(data.error || 'Server returned unsuccessful result');
      }
    } catch (err: any) {
      console.error("Scanning translation error:", err);
      setError(
        language === 'en'
          ? `Analysis failed: ${err.message || 'Check your internet or Gemini keys'}`
          : `विश्लेषण विफल हुआ: ${err.message || 'कृपया इंटरनेट सम्बन्ध या जैमिनि चाबी जांचें'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setError(null);
    if (activeTab === 'camera') {
      startCamera(selectedDeviceId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000ed] backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-[#120a1c] border border-purple-500/30 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-6 border-b border-purple-500/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-purple-500/20 text-purple-400 rounded-2xl">
              <Camera size={20} className="animate-pulse" />
            </span>
            <div>
              <h2 className="font-display font-black text-base text-white uppercase tracking-wider">
                {language === 'en' ? 'LIVE MANUSCRIPT SCANNER' : 'पांडुलिपि लाइव कैमरा स्कैनर'}
              </h2>
              <p className="text-[10px] text-purple-300 font-bold">
                {language === 'en' ? 'Capture and OCR Decode Original Ancient Gatha' : 'ग्रंथ के श्लोक/गाथा पृष्ठ को लाइव स्कैन या अपलोड करें'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-4 flex gap-4 border-b border-purple-500/10 bg-purple-950/20">
          <button
            onClick={() => {
              setActiveTab('camera');
              setCapturedImage(null);
            }}
            className={cn(
              "pb-3 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all",
              activeTab === 'camera' 
                ? "border-purple-500 text-purple-300" 
                : "border-transparent text-gray-550 hover:text-gray-300"
            )}
          >
            📹 {language === 'en' ? 'Live Camera Feed' : 'कैमरा लाइव वीडियो'}
          </button>
          <button
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
              setCapturedImage(null);
            }}
            className={cn(
              "pb-3 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all",
              activeTab === 'upload' 
                ? "border-purple-500 text-purple-300" 
                : "border-transparent text-gray-550 hover:text-gray-300"
            )}
          >
            📁 {language === 'en' ? 'Upload Image / Drop' : 'फ़ाइल अपलोड / ड्रैग'}
          </button>
        </div>

        {/* Media Container Box */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-start gap-3">
              <AlertTriangle className="shrink-0 mt-0.5" size={16} />
              <div>{error}</div>
            </div>
          )}

          {!capturedImage ? (
            activeTab === 'camera' ? (
              // Live camera panel with beautiful simulation lines
              <div className="space-y-4">
                {/* Camera Source dropdown selector */}
                {devices.length > 1 && (
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                    <span>Camera source:</span>
                    <select
                      value={selectedDeviceId}
                      onChange={(e) => setSelectedDeviceId(e.target.value)}
                      className="bg-purple-900/40 border border-purple-500/25 rounded-lg p-1.5 focus:outline-none"
                    >
                      {devices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Device ${device.deviceId.substring(0, 5)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="aspect-video w-full rounded-2xl bg-black border border-purple-550/20 relative overflow-hidden flex items-center justify-center">
                  <video 
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Neon laser scan animation overlay */}
                  <div className="absolute inset-0 pointer-events-none border border-purple-500/30 rounded-2xl">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent absolute left-0 top-0 animate-[bounce_3s_infinite]" />
                    {/* Targeting reticles */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-purple-400" />
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-purple-400" />
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-purple-400" />
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-purple-400" />
                  </div>

                  {!stream && !error && (
                    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-xs font-bold text-purple-300 gap-2">
                      <RefreshCw size={24} className="animate-spin" />
                      Loading camera stream...
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={capturePhoto}
                    disabled={!stream}
                    className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Camera size={16} />
                    {language === 'en' ? 'Capture Snapshot' : 'फोटो खींचे'}
                  </button>
                </div>
              </div>
            ) : (
              // Drag & drop file upload panel
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video w-full border-2 border-dashed border-purple-500/20 hover:border-purple-500/50 bg-purple-950/10 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer p-6 transition-all"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="p-4 bg-purple-500/10 text-purple-400 rounded-full">
                  <UploadCloud size={34} />
                </div>
                <div className="text-center">
                  <p className="text-sm text-white font-black">
                    {language === 'en' ? 'Drag & Drop Manuscript Page Image' : 'शास्त्र पृष्ठ की फोटो यहाँ ड्रैग करें'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">
                    {language === 'en' ? 'Or click here to select from local storage. Supported: JPG, PNG, WEBP.' : 'या मैनुअली चुनने हेतु यहाँ क्लिक करें। स्वीकृत: जेपीजी, पीएनजी, वेबपी।'}
                  </p>
                </div>
              </div>
            )
          ) : (
            // Layout preview after capturing or uploading snapshot image source
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-2xl bg-black border border-purple-500/25 overflow-hidden relative">
                <img 
                  src={capturedImage} 
                  alt="Captured Manuscript preview" 
                  className="w-full h-full object-contain"
                />
                
                {isLoading && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-xs text-purple-300 font-bold gap-3">
                    <RefreshCw size={32} className="animate-spin text-purple-400" />
                    <div className="animate-pulse tracking-wide uppercase">
                      {language === 'en' ? 'Jain-GPT deciphering original text...' : 'प्राचीन गाथा डिकोड कर रहे हैं...'}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={resetScanner}
                  disabled={isLoading}
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-gray-300 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  {language === 'en' ? 'Retake / Go Back' : 'पुनः प्रयास'}
                </button>
                <button
                  type="button"
                  onClick={triggerAnalyze}
                  disabled={isLoading}
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-500/10 cursor-pointer"
                >
                  <Sparkles size={16} />
                  {language === 'en' ? 'Analyze & Translate' : 'तथ्य डिकोड करें'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Hidden Canvas tag */}
        <canvas ref={canvasRef} className="hidden" />

      </div>
    </div>
  );
}
