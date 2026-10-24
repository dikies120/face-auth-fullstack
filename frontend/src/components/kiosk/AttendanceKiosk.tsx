"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { loadFaceApiModels, detectSingleFaceDescriptor, detectAllFaces, getFaceApi } from "@/lib/faceApi";
import { playSound } from "@/lib/sound";
import KioskHeader from "./KioskHeader";
import KioskResultModal, { AttendanceResult } from "./KioskResultModal";
import KioskInstructions from "./KioskInstructions";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function AttendanceKiosk() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  const [scanState, setScanState] = useState<
    "searching" | "stabilizing" | "processing" | "success" | "error" | "cooldown"
  >("searching");
  const [statusMessage, setStatusMessage] = useState<string>(
    "Arahkan wajah Anda ke dalam bingkai kamera"
  );
  const [lastResult, setLastResult] = useState<AttendanceResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldownCountdown, setCooldownCountdown] = useState<number>(0);

  const isRequestingRef = useRef(false);
  const isCooldownRef = useRef(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
        setCameraError("Gagal memuat model Face-API.");
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

  const speakGreeting = useCallback(
    (name: string, type: "IN" | "OUT") => {
      if (!soundEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const actionText = type === "IN" ? "selamat datang" : "terima kasih, hati-hati di jalan";
        const utterance = new SpeechSynthesisUtterance(`${actionText}, ${name}`);
        utterance.lang = "id-ID";
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {
      }
    },
    [soundEnabled]
  );

  const startCooldown = useCallback((seconds: number) => {
    isCooldownRef.current = true;
    setScanState("cooldown");
    setCooldownCountdown(seconds);

    const timer = setInterval(() => {
      setCooldownCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          isCooldownRef.current = false;
          setScanState("searching");
          setStatusMessage("Arahkan wajah Anda ke dalam bingkai kamera");
          setLastResult(null);
          setErrorMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const submitFaceForAttendance = useCallback(
    async (descriptor: number[], snapshotBase64: string) => {
      if (isRequestingRef.current || isCooldownRef.current) return;

      isRequestingRef.current = true;
      setScanState("processing");
      setStatusMessage("Mencocokkan biometrik wajah...");

      try {
        const response = await fetch(`${BACKEND_URL}/api/attendance/scan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            faceDescriptor: descriptor,
            snapshotImage: snapshotBase64,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          if (soundEnabled) {
            playSound("success");
          }

          setScanState("success");
          setStatusMessage(result.message);
          setLastResult(result.data);
          setErrorMessage(null);

          speakGreeting(result.data.userName, result.data.type);
          startCooldown(6);
        } else {
          if (soundEnabled) {
            playSound("error");
          }

          setScanState("error");
          setErrorMessage(result.message || "Presensi gagal diverifikasi.");
          setStatusMessage(result.message || "Presensi gagal diverifikasi.");

          setTimeout(() => {
            if (!isCooldownRef.current) {
              setScanState("searching");
              setStatusMessage("Arahkan wajah Anda ke dalam bingkai kamera");
              setErrorMessage(null);
            }
          }, 3500);
        }
      } catch {
        if (soundEnabled) {
          playSound("error");
        }
        setScanState("error");
        setErrorMessage("Gagal terhubung ke server backend.");
        setStatusMessage("Gagal terhubung ke server backend.");

        setTimeout(() => {
          if (!isCooldownRef.current) {
            setScanState("searching");
            setStatusMessage("Arahkan wajah Anda ke dalam bingkai kamera");
            setErrorMessage(null);
          }
        }, 3500);
      } finally {
        isRequestingRef.current = false;
      }
    },
    [soundEnabled, speakGreeting, startCooldown]
  );

  useEffect(() => {
    if (!cameraActive || isLoadingModels) return;

    let animationFrameId: number;
    let consecutiveFaceFrames = 0;
    const requiredFrames = 10;

    const detectLoop = async () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === 4 &&
        canvasRef.current &&
        !isRequestingRef.current &&
        !isCooldownRef.current
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const faceapi = await getFaceApi();

        if (faceapi) {
          const displaySize = {
            width: video.videoWidth || 640,
            height: video.videoHeight || 480,
          };
          faceapi.matchDimensions(canvas, displaySize);

          const detections = await detectAllFaces(video);

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          if (detections.length === 1) {
            const resized = faceapi.resizeResults(detections, displaySize);
            const box = resized[0].box;

            if (ctx) {
              ctx.strokeStyle = "#f97316";
              ctx.lineWidth = 3;
              ctx.strokeRect(box.x, box.y, box.width, box.height);
            }

            consecutiveFaceFrames += 1;

            if (consecutiveFaceFrames >= requiredFrames) {
              consecutiveFaceFrames = 0;
              setScanState("processing");
              setStatusMessage("Wajah terkunci! Mengambil data biometrik...");

              const tempCanvas = document.createElement("canvas");
              tempCanvas.width = video.videoWidth || 640;
              tempCanvas.height = video.videoHeight || 480;
              const tempCtx = tempCanvas.getContext("2d");

              if (tempCtx) {
                tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
                const snapshotBase64 = tempCanvas.toDataURL("image/jpeg", 0.85);

                const fullDetection = await detectSingleFaceDescriptor(video);
                if (fullDetection) {
                  const descriptorArray = Array.from(fullDetection.descriptor);
                  submitFaceForAttendance(descriptorArray, snapshotBase64);
                } else {
                  setScanState("searching");
                  setStatusMessage("Arahkan wajah Anda ke dalam bingkai kamera");
                }
              }
            } else {
              setScanState("stabilizing");
              setStatusMessage("Tahan posisi wajah Anda...");
            }
          } else if (detections.length > 1) {
            consecutiveFaceFrames = 0;
            setScanState("searching");
            setStatusMessage("Terdeteksi lebih dari satu wajah. Harap satu orang.");
          } else {
            consecutiveFaceFrames = 0;
            if (!isRequestingRef.current && !isCooldownRef.current) {
              setScanState("searching");
              setStatusMessage("Arahkan wajah Anda ke dalam bingkai kamera");
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(detectLoop);
    };

    animationFrameId = requestAnimationFrame(detectLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [cameraActive, isLoadingModels, submitFaceForAttendance]);

  return (
    <div className="w-full flex flex-col items-center">
      <KioskHeader
        currentTime={currentTime}
        currentDate={currentDate}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      <div className="relative w-full max-w-4xl aspect-[16/10] sm:aspect-[16/9] bg-zinc-950 rounded-3xl overflow-hidden border-2 border-zinc-300 shadow-xl flex items-center justify-center">
        {scanState === "success" && lastResult && (
          <KioskResultModal result={lastResult} cooldownCountdown={cooldownCountdown} />
        )}

        {(scanState === "error" || scanState === "cooldown") && errorMessage && (
          <div className="absolute top-6 left-6 right-6 z-20 flex items-center gap-3 p-4 bg-white/95 border border-rose-300 rounded-2xl shadow-xl backdrop-blur-md animate-shake">
            <div className="p-2 bg-rose-50 rounded-xl shrink-0">
              <AlertCircle className="w-6 h-6 text-rose-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-rose-900">Perhatian Presensi</div>
              <div className="text-xs text-rose-700">{errorMessage}</div>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          muted
          playsInline
          className={`w-full h-full object-cover transform -scale-x-100 ${
            cameraActive ? "block" : "hidden"
          }`}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100"
        />

        {cameraActive && !lastResult && (
          <>
            <div className="animate-scan-line pointer-events-none" />

            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-56 h-72 sm:w-64 sm:h-80 border-2 border-dashed border-orange-400/50 rounded-[40px] flex items-center justify-center transition-all duration-300">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-orange-500 rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-orange-500 rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-orange-500 rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-orange-500 rounded-br-xl" />

                {scanState === "stabilizing" && (
                  <div className="text-xs text-orange-700 font-semibold px-3 py-1 bg-white/95 rounded-full border border-orange-300 shadow-sm animate-pulse">
                    Tahan Wajah...
                  </div>
                )}
                {scanState === "processing" && (
                  <div className="flex items-center gap-2 text-xs text-orange-700 font-semibold px-3 py-1.5 bg-white/95 rounded-full border border-orange-300 shadow-md">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-500" />
                    Memproses AI...
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {isLoadingModels && (
          <div className="flex flex-col items-center gap-3 p-8 text-center bg-white/95 rounded-2xl shadow-lg border border-zinc-200">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
            <div className="text-sm font-semibold text-zinc-900">
              Menyiapkan Engine AI Biometrik...
            </div>
            <div className="text-xs text-zinc-500">Memuat bobot model Face-API 128-D</div>
          </div>
        )}

        {cameraError && (
          <div className="flex flex-col items-center gap-3 p-6 text-center max-w-sm bg-white/95 rounded-2xl shadow-lg border border-rose-200">
            <AlertCircle className="w-10 h-10 text-rose-500" />
            <div className="text-sm font-semibold text-zinc-900">{cameraError}</div>
            <button
              onClick={startCamera}
              className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
            </button>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between p-3.5 bg-white/95 border border-zinc-200/90 rounded-2xl shadow-md backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                scanState === "processing"
                  ? "bg-orange-500 animate-ping"
                  : scanState === "stabilizing"
                  ? "bg-orange-400 animate-pulse"
                  : scanState === "success"
                  ? "bg-emerald-500"
                  : scanState === "error"
                  ? "bg-rose-500"
                  : "bg-orange-500 animate-pulse"
              }`}
            />
            <span className="text-xs font-semibold text-zinc-800">{statusMessage}</span>
          </div>

          <div className="text-[11px] font-mono text-zinc-600 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Anti-Duplikasi Aktif
          </div>
        </div>
      </div>

      <KioskInstructions />
    </div>
  );
}
