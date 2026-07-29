"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Camera, X, RefreshCw, Check, SwitchCamera, ShieldAlert, Lock } from "lucide-react";
import { generateFramedImage } from "@/lib/frameHelper";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (framedDataUrl: string, framedFile: File) => void;
}

export default function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errorType, setErrorType] = useState<"permission" | "insecure" | "notfound" | "generic" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Frame image natural dimensions and aspect ratio (Default portrait 1080x1350 = 4:5 ratio)
  const [frameDimensions, setFrameDimensions] = useState<{ width: number; height: number; aspectRatio: number }>({
    width: 1080,
    height: 1350,
    aspectRatio: 1080 / 1350,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-load frame to extract exact natural dimensions & aspect ratio
  useEffect(() => {
    const img = new window.Image();
    img.src = "/assets/frame/frame_photobooth.png";
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setFrameDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
        });
      }
    };
  }, []);

  // Disable background page/canvas scroll & turn off auto-scroll when Camera modal is active
  useEffect(() => {
    if (isOpen) {
      if (typeof window !== "undefined") {
        (window as any).isModalOpen = true;
        window.dispatchEvent(new CustomEvent("pause-auto-scroll"));
      }
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      startCamera(facingMode);
    } else {
      stopCamera();
      setCapturedPreview(null);
      setCapturedFile(null);
      setErrorType(null);
      setErrorMsg(null);

      if (typeof window !== "undefined") {
        (window as any).isModalOpen = false;
        window.dispatchEvent(new CustomEvent("resume-auto-scroll"));
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      stopCamera();
      if (typeof window !== "undefined") {
        (window as any).isModalOpen = false;
        window.dispatchEvent(new CustomEvent("resume-auto-scroll"));
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, facingMode]);

  const startCamera = async (facing: "user" | "environment") => {
    stopCamera();
    setErrorType(null);
    setErrorMsg(null);

    // Check if mediaDevices API is available
    if (typeof window !== "undefined" && (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)) {
      const isHttp = window.location.protocol !== "https:" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
      if (isHttp) {
        setErrorType("insecure");
        setErrorMsg("Akses kamera diblokir peramban karena menggunakan koneksi HTTP (bukan HTTPS). Gunakan localhost atau alamat HTTPS yang aman.");
      } else {
        setErrorType("generic");
        setErrorMsg("Peramban web ini tidak mendukung akses kamera langsung.");
      }
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: frameDimensions.width },
          height: { ideal: frameDimensions.height },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera access error details:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorType("permission");
        setErrorMsg("Izin akses kamera belum diberikan. Klik tombol 'Izinkan Kamera' dan pilih Allow/Izinkan pada pop-up peramban.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorType("notfound");
        setErrorMsg("Kamera tidak ditemukan di perangkat Anda.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setErrorType("generic");
        setErrorMsg("Kamera sedang digunakan oleh aplikasi lain (seperti Zoom/Teams). Tutup aplikasi tersebut dan coba lagi.");
      } else if (err.name === "SecurityError") {
        setErrorType("insecure");
        setErrorMsg("Peramban menolak kamera karena koneksi jaringan belum aman (HTTPS diperlukan).");
      } else {
        setErrorType("permission");
        setErrorMsg("Gagal membuka kamera. Silakan izinkan akses kamera pada peramban Anda.");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleTakeSnapshot = async () => {
    if (!videoRef.current) return;
    setProcessing(true);
    try {
      const isFrontCamera = facingMode === "user";
      const { dataUrl, file } = await generateFramedImage(
        videoRef.current,
        "/assets/frame/frame_photobooth.png",
        isFrontCamera
      );
      setCapturedPreview(dataUrl);
      setCapturedFile(file);
    } catch (err: any) {
      console.error("Framing error:", err);
      alert("Gagal memproses foto ter-frame. Silakan coba lagi.");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (capturedPreview && capturedFile) {
      onCapture(capturedPreview, capturedFile);
      stopCamera();
      onClose();
    }
  };

  const handleRetry = () => {
    setCapturedPreview(null);
    setCapturedFile(null);
    startCamera(facingMode);
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none font-kalam"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopCamera();
          onClose();
        }
      }}
    >
      <div className="bg-[#FAF9F6] border-2 border-[#743951]/30 rounded-3xl w-full max-w-sm sm:max-w-md overflow-hidden shadow-2xl flex flex-col items-center p-4 sm:p-5 relative max-h-[95vh] my-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-[#743951]/20 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#743951]" />
            <h3 className="text-base sm:text-lg font-bold text-[#743951]">Kamera Photo Booth</h3>
          </div>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-[#743951] transition-colors cursor-pointer"
            title="Tutup Kamera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Container: Portrait 4:5 Ratio matching 1080x1350 frame asset */}
        <div
          style={{ aspectRatio: `${frameDimensions.aspectRatio}` }}
          className="relative w-full max-h-[65vh] bg-stone-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-[#743951]/20"
        >
          {errorMsg ? (
            // User-friendly Permission Request & Error UI
            <div className="p-6 text-center text-white/90 flex flex-col items-center justify-center gap-3 h-full w-full bg-stone-900/95">
              <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/40 rounded-full flex items-center justify-center">
                {errorType === "insecure" ? (
                  <Lock className="w-6 h-6 text-amber-400" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-amber-400" />
                )}
              </div>

              <div className="flex flex-col gap-1 max-w-xs">
                <h4 className="text-sm font-bold text-amber-300 font-sans">
                  {errorType === "permission"
                    ? "Konfirmasi Izin Kamera"
                    : errorType === "insecure"
                    ? "Koneksi Keamanan (HTTPS)"
                    : "Kendala Kamera"}
                </h4>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  {errorMsg}
                </p>
              </div>

              {errorType === "permission" && (
                <div className="p-2.5 bg-white/10 rounded-xl border border-white/15 text-[11px] font-sans text-stone-300 text-left mt-1">
                  💡 <strong>Tips:</strong> Klik ikon gembok/kamera pada alamat web browser di bagian atas, lalu aktifkan akses <strong>"Camera / Kamera"</strong>.
                </div>
              )}

              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="mt-2 px-5 py-2.5 bg-[#743951] hover:bg-[#5c2d40] text-white font-bold text-xs rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer font-kalam"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Minta Izin / Coba Lagi</span>
              </button>
            </div>
          ) : capturedPreview ? (
            // Captured Framed Result Preview in Portrait 4:5
            <img
              src={capturedPreview}
              alt="Framed Photo Preview"
              className="w-full h-full object-contain animate-fadeIn"
            />
          ) : (
            // Live Video Stream with Portrait Real-time Frame Overlay
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  facingMode === "user" ? "scale-x-[-1]" : ""
                }`}
              />

              {/* Real-time Portrait Frame Overlay */}
              <img
                src="/assets/frame/frame_photobooth.png"
                alt="Frame Photobooth Overlay"
                className="absolute inset-0 w-full h-full pointer-events-none object-contain z-10"
              />
            </>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="w-full mt-4 flex items-center justify-between gap-3">
          {capturedPreview ? (
            <>
              <button
                type="button"
                onClick={handleRetry}
                className="flex-1 py-2.5 px-4 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Foto Ulang</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 px-4 bg-[#743951] hover:bg-[#5c2d40] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-colors cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Gunakan Foto</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleCamera}
                disabled={!!errorMsg}
                className="py-2.5 px-4 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-xl flex items-center gap-1.5 text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50"
                title="Ganti Kamera"
              >
                <SwitchCamera className="w-4 h-4" />
                <span className="hidden sm:inline">Ganti Kamera</span>
              </button>

              <button
                type="button"
                onClick={handleTakeSnapshot}
                disabled={processing || !!errorMsg}
                className="flex-1 py-2.5 px-5 bg-[#743951] hover:bg-[#5c2d40] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-50 shadow-md"
              >
                <Camera className="w-4 h-4" />
                <span>{processing ? "Memproses Frame..." : "Ambil Foto"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
