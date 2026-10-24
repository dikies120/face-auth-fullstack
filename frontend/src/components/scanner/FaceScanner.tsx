"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, ShieldCheck } from "lucide-react";
import { loadFaceApiModels, detectSingleFaceDescriptor, detectAllFaces, getFaceApi } from "@/lib/faceApi";

export interface FaceScannerProps {
  onFaceCaptured: (data: { descriptor: number[]; imageBase64: string }) => void;
  isProcessing?: boolean;
}

export default function FaceScanner({ onFaceCaptured, isProcessing = false }: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedFacesCount, setDetectedFacesCount] = useState<number>(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<"idle" | "searching" | "ready" | "multiple">("idle");

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch {
      setCameraError("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.");
      setCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      setIsLoadingModels(true);
      const ok = await loadFaceApiModels();
      if (!isMounted) return;

      if (!ok) {
        setModelError("Gagal memuat model pengenalan wajah.");
        setIsLoadingModels(false);
        return;
      }

      setIsLoadingModels(false);
      startCamera();
    }

    init();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (!cameraActive || capturedImage || isLoadingModels) return;

    let animationFrameId: number;

    const detectLoop = async () => {
      if (videoRef.current && videoRef.current.readyState === 4 && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const faceapi = await getFaceApi();

        if (faceapi) {
          const displaySize = { width: video.videoWidth || 640, height: video.videoHeight || 480 };
          faceapi.matchDimensions(canvas, displaySize);

          const faces = await detectAllFaces(video);
          setDetectedFacesCount(faces.length);

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          if (faces.length === 1) {
            setScanStatus("ready");
            const resizedDetections = faceapi.resizeResults(faces, displaySize);
            faceapi.draw.drawDetections(canvas, resizedDetections);
          } else if (faces.length > 1) {
            setScanStatus("multiple");
          } else {
            setScanStatus("searching");
          }
        }
      }

      animationFrameId = requestAnimationFrame(detectLoop);
    };

    animationFrameId = requestAnimationFrame(detectLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [cameraActive, capturedImage, isLoadingModels]);

  const handleCapture = async () => {
    if (!videoRef.current || scanStatus !== "ready") return;

    const video = videoRef.current;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = video.videoWidth || 640;
    tempCanvas.height = video.videoHeight || 480;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    const imageBase64 = tempCanvas.toDataURL("image/jpeg", 0.9);

    const fullDetection = await detectSingleFaceDescriptor(video);

    if (!fullDetection) {
      setScanStatus("searching");
      return;
    }

    const descriptorArray = Array.from(fullDetection.descriptor);

    setCapturedImage(imageBase64);
    stopCamera();

    onFaceCaptured({
      descriptor: descriptorArray,
      imageBase64,
    });
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setScanStatus("searching");
    startCamera();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-md aspect-[4/3] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-300 shadow-md flex items-center justify-center">
        {capturedImage ? (
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Snapshot Wajah"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-orange-500/10 border-4 border-orange-500 rounded-2xl flex flex-col justify-end p-4">
              <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 bg-white/95 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-full shadow-md backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Sampel Wajah Tersimpan
              </span>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              muted
              playsInline
              className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {cameraActive && <div className="animate-scan-line pointer-events-none" />}

            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className={`w-48 h-56 rounded-[45%] border-2 transition-all duration-300 ${
                  scanStatus === "ready"
                    ? "border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.5)]"
                    : scanStatus === "multiple"
                    ? "border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)]"
                    : "border-orange-300/60 border-dashed"
                }`}
              />
            </div>

            {isLoadingModels && (
              <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
                <p className="text-sm font-medium text-zinc-300">Memuat AI Model Pengenalan Wajah...</p>
              </div>
            )}

            {cameraError && (
              <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
                <p className="text-sm font-medium text-rose-300">{cameraError}</p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs text-white rounded-lg transition"
                >
                  Coba Akses Kamera Lagi
                </button>
              </div>
            )}

            {modelError && (
              <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
                <p className="text-sm font-medium text-rose-300">{modelError}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center min-h-[32px]">
        {capturedImage ? (
          <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Vektor biometrik 128-dimensi berhasil diekstrak
          </span>
        ) : scanStatus === "ready" ? (
          <span className="text-xs text-orange-700 flex items-center gap-1.5 font-medium bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" /> Posisi wajah optimal! Siap ambil data
          </span>
        ) : scanStatus === "multiple" ? (
          <span className="text-xs text-amber-700 flex items-center gap-1.5 font-medium bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {detectedFacesCount} wajah terdeteksi. Hanya boleh 1 wajah
          </span>
        ) : (
          <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Posisikan wajah Anda tepat di dalam area elips
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        {capturedImage ? (
          <button
            type="button"
            onClick={handleRetake}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-50 active:scale-95 text-xs font-semibold text-zinc-700 rounded-xl border border-zinc-200 shadow-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Ambil Ulang Wajah
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCapture}
            disabled={scanStatus !== "ready" || isLoadingModels || isProcessing}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition shadow-sm active:scale-95 ${
              scanStatus === "ready" && !isLoadingModels && !isProcessing
                ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25"
                : "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
            }`}
          >
            <Camera className="w-4 h-4" /> Kunci &amp; Ambil Sampel Wajah
          </button>
        )}
      </div>
    </div>
  );
}
