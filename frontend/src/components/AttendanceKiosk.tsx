"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Scan,
  RefreshCw,
  Building,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { loadFaceApiModels, detectSingleFaceDescriptor, detectAllFaces, getFaceApi } from "@/lib/faceApi";
import { playSound } from "@/lib/sound";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface AttendanceResult {
  type: "IN" | "OUT";
  status: "ON_TIME" | "LATE";
  time: string;
  userName: string;
  memberCode?: string | null;
  department?: string | null;
  userImage?: string | null;
  snapshotUrl?: string | null;
  matchedScore?: number;
  message: string;
}

export default function AttendanceKiosk() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  const [scanState, setScanState] = useState<"searching" | "stabilizing" | "processing" | "success" | "error" | "cooldown">("searching");
  const [statusMessage, setStatusMessage] = useState<string>("Arahkan wajah Anda ke dalam bingkai kamera");
  const [lastResult, setLastResult] = useState<AttendanceResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldownCountdown, setCooldownCountdown] = useState<number>(0);

  // Lock flag to prevent simultaneous overlapping API requests
  const isRequestingRef = useRef(false);
  const isCooldownRef = useRef(false);

  // Update clock every second
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
        setModelError("Gagal memuat model pengenalan wajah biometrik.");
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

  // Handle Face Submission to Attendance API
  const submitFaceForAttendance = useCallback(
    async (descriptor: number[], snapshotBase64: string) => {
      if (isRequestingRef.current || isCooldownRef.current) return;
      isRequestingRef.current = true;
      setScanState("processing");
      setStatusMessage("Wajah terdeteksi! Memverifikasi ke database...");

      try {
        const response = await fetch(`${BACKEND_URL}/api/attendance/scan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            faceDescriptor: descriptor,
            snapshotUrl: snapshotBase64,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          if (soundEnabled) playSound("success");

          const att = data.data;
          setLastResult({
            type: att.type,
            status: att.status,
            time: new Date(att.createdAt).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            userName: att.user.name,
            memberCode: att.user.memberCode,
            department: att.user.department,
            userImage: att.user.faceImageUrl,
            snapshotUrl: att.snapshotUrl,
            matchedScore: data.matchedScore ? Math.round(data.matchedScore) : 95,
            message: data.message,
          });

          setScanState("success");
          setStatusMessage(data.message);

          // Cooldown 4 seconds showing success banner
          isCooldownRef.current = true;
          let count = 4;
          setCooldownCountdown(count);

          const timer = setInterval(() => {
            count -= 1;
            setCooldownCountdown(count);
            if (count <= 0) {
              clearInterval(timer);
              setLastResult(null);
              setScanState("searching");
              setStatusMessage("Arahkan wajah Anda ke dalam bingkai kamera");
              isCooldownRef.current = false;
              isRequestingRef.current = false;
            }
          }, 1000);
        } else {
          // Gagal / tidak cocok / cooldown
          if (data.isCooldown) {
            if (soundEnabled) playSound("warning");
            setScanState("cooldown");
            setStatusMessage(data.message);
            setErrorMessage(data.message);
          } else {
            if (soundEnabled) playSound("error");
            setScanState("error");
            setErrorMessage(data.message || "Wajah tidak dikenali dalam sistem.");
            setStatusMessage("Wajah tidak dikenali! Silakan hubungi Admin.");
          }

          // Reset error after 3 seconds
          isCooldownRef.current = true;
          setTimeout(() => {
            setErrorMessage(null);
            setScanState("searching");
            setStatusMessage("Arahkan wajah Anda ke dalam bingkai kamera");
            isCooldownRef.current = false;
            isRequestingRef.current = false;
          }, 3000);
        }
      } catch (err) {
        if (soundEnabled) playSound("error");
        setScanState("error");
        setErrorMessage("Gagal terhubung ke server backend.");
        setStatusMessage("Server tidak dapat dijangkau.");

        isCooldownRef.current = true;
        setTimeout(() => {
          setErrorMessage(null);
          setScanState("searching");
          setStatusMessage("Arahkan wajah Anda ke dalam bingkai kamera");
          isCooldownRef.current = false;
          isRequestingRef.current = false;
        }, 3000);
      }
    },
    [soundEnabled]
  );

  // Main Detection Loop: Watches camera and triggers attendance when single face is centered
  useEffect(() => {
    if (!cameraActive || isLoadingModels || isCooldownRef.current) return;

    let animationFrameId: number;
    let steadyFaceCounter = 0;

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

          const faces = await detectAllFaces(video);
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }

          if (faces.length === 1 && !isRequestingRef.current && !isCooldownRef.current) {
            const resizedDetections = faceapi.resizeResults(faces, displaySize);
            faceapi.draw.drawDetections(canvas, resizedDetections);

            steadyFaceCounter++;
            if (steadyFaceCounter === 1) {
              setScanState("stabilizing");
              setStatusMessage("Tahan posisi wajah Anda sejenak...");
            }

            // Once face has been steady for a few frames (e.g. ~8-10 frames)
            if (steadyFaceCounter >= 8) {
              steadyFaceCounter = 0;

              // Capture snapshot image
              const tempCanvas = document.createElement("canvas");
              tempCanvas.width = video.videoWidth || 640;
              tempCanvas.height = video.videoHeight || 480;
              const tempCtx = tempCanvas.getContext("2d");
              if (tempCtx) {
                tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
                const snapshotBase64 = tempCanvas.toDataURL("image/jpeg", 0.85);

                const singleFace = await detectSingleFaceDescriptor(video);
                if (singleFace) {
                  const descriptor = Array.from(singleFace.descriptor);
                  submitFaceForAttendance(descriptor, snapshotBase64);
                }
              }
            }
          } else {
            steadyFaceCounter = 0;
            if (faces.length > 1) {
              setScanState("error");
              setStatusMessage("Hanya 1 orang yang diperbolehkan di depan kamera!");
            } else if (!isRequestingRef.current && !isCooldownRef.current) {
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
      {/* Top Banner / Time Header */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-4 p-4 mb-4 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <Scan className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">Kiosk Presensi Wajah</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Standby
              </span>
            </div>
            <p className="text-xs text-slate-400">Pencocokan 1:N Vektor Biometrik AI Otomatis</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-white tracking-wider">{currentTime || "00:00:00"} <span className="text-xs font-normal text-sky-400">WIB</span></div>
            <div className="text-xs text-slate-400">{currentDate || "Memuat tanggal..."}</div>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Matikan Suara" : "Aktifkan Suara"}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Main Kiosk Camera & Viewfinder Container */}
      <div className="relative w-full max-w-4xl aspect-[16/10] sm:aspect-[16/9] bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl flex items-center justify-center">
        {/* Success Modal Overlay */}
        {scanState === "success" && lastResult && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-400 shadow-2xl shadow-emerald-500/30">
                <img
                  src={lastResult.snapshotUrl || lastResult.userImage || "/placeholder-avatar.png"}
                  alt={lastResult.userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-bold uppercase tracking-wider shadow-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              {lastResult.type === "IN" ? "Absen Masuk Berhasil" : "Absen Pulang Berhasil"}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 tracking-tight">
              {lastResult.userName}
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300 mb-4">
              {lastResult.memberCode && (
                <span className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 font-mono">
                  ID: {lastResult.memberCode}
                </span>
              )}
              {lastResult.department && (
                <span className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-1">
                  <Building className="w-3 h-3 text-sky-400" />
                  {lastResult.department}
                </span>
              )}
              <span className={`px-2.5 py-1 rounded-lg font-semibold ${
                lastResult.status === "ON_TIME"
                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                  : "bg-amber-950/80 text-amber-400 border border-amber-800"
              }`}>
                {lastResult.status === "ON_TIME" ? "Tepat Waktu" : "Terlambat"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-sm font-mono mb-6">
              <Clock className="w-4 h-4 text-sky-400" />
              Waktu Presensi: <span className="text-white font-bold">{lastResult.time} WIB</span>
            </div>

            <div className="text-xs text-slate-500">
              Layar siap kembali dalam <span className="text-sky-400 font-bold text-sm">{cooldownCountdown}</span> detik
            </div>
          </div>
        )}

        {/* Error / Not Recognized Overlay */}
        {(scanState === "error" || scanState === "cooldown") && errorMessage && (
          <div className="absolute top-6 left-6 right-6 z-20 flex items-center gap-3 p-4 bg-rose-950/90 border border-rose-500/50 rounded-2xl backdrop-blur-md shadow-2xl animate-shake">
            <div className="p-2 bg-rose-500/20 rounded-xl shrink-0">
              <AlertCircle className="w-6 h-6 text-rose-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-rose-200">Perhatian Presensi</div>
              <div className="text-xs text-rose-300">{errorMessage}</div>
            </div>
          </div>
        )}

        {/* Live Camera Video Feed */}
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

        {/* Viewfinder Target / Overlay Guides */}
        {cameraActive && !lastResult && (
          <>
            <div className="animate-scan-line pointer-events-none" />

            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-56 h-72 sm:w-64 sm:h-80 border-2 border-dashed border-sky-400/40 rounded-[40px] flex items-center justify-center transition-all duration-300">
                {/* 4 Corner Markers */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-sky-400 rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-sky-400 rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-sky-400 rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-sky-400 rounded-br-xl" />

                {scanState === "stabilizing" && (
                  <div className="text-xs text-sky-300 font-medium px-3 py-1 bg-sky-950/80 rounded-full border border-sky-500/40 animate-pulse">
                    Tahan Wajah...
                  </div>
                )}
                {scanState === "processing" && (
                  <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium px-3 py-1.5 bg-indigo-950/90 rounded-full border border-indigo-500/40 shadow-lg">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                    Memproses AI...
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Loading Models Screen */}
        {isLoadingModels && (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
            <div className="text-sm font-semibold text-slate-200">Menyiapkan Engine AI Biometrik...</div>
            <div className="text-xs text-slate-400">Memuat bobot model Face-API 128-D</div>
          </div>
        )}

        {/* Camera Permission / Error Screen */}
        {cameraError && (
          <div className="flex flex-col items-center gap-3 p-6 text-center max-w-sm">
            <AlertCircle className="w-10 h-10 text-rose-400" />
            <div className="text-sm font-semibold text-slate-200">{cameraError}</div>
            <button
              onClick={startCamera}
              className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
            </button>
          </div>
        )}

        {/* Bottom Status Bar in Camera */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                scanState === "processing"
                  ? "bg-indigo-400 animate-ping"
                  : scanState === "stabilizing"
                  ? "bg-amber-400 animate-pulse"
                  : scanState === "success"
                  ? "bg-emerald-400"
                  : scanState === "error"
                  ? "bg-rose-400"
                  : "bg-sky-400 animate-pulse"
              }`}
            />
            <span className="text-xs font-medium text-slate-200">{statusMessage}</span>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Anti-Duplikasi Aktif
          </div>
        </div>
      </div>

      {/* Quick Instructions Footer */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs text-slate-400">
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">1</div>
          <span>Posisikan wajah Anda tegak menghadap kamera</span>
        </div>
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">2</div>
          <span>Sistem otomatis mendeteksi tanpa perlu klik tombol</span>
        </div>
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">3</div>
          <span>Absen Masuk (IN) / Pulang (OUT) tercatat seketika</span>
        </div>
      </div>
    </div>
  );
}
