"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, Loader2, KeyRound } from "lucide-react";
import FaceScanner from "./FaceScanner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [useEmailVerification, setUseEmailVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifiedUser, setVerifiedUser] = useState<{
    id: string;
    name: string;
    email: string;
    faceImageUrl?: string;
  } | null>(null);
  const [distanceScore, setDistanceScore] = useState<number | null>(null);

  const handleFaceCaptured = async (data: { descriptor: number[]; imageBase64: string }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setVerifiedUser(null);

    try {
      const payload: { faceDescriptor: number[]; email?: string } = {
        faceDescriptor: data.descriptor,
      };

      if (useEmailVerification && email.trim()) {
        payload.email = email.trim();
      }

      const response = await fetch(`${BACKEND_URL}/api/auth/verify-face`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Wajah tidak cocok dengan akun manapun.");
      }

      setVerifiedUser(result.user);
      setDistanceScore(result.distance);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal memverifikasi wajah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Login dengan Wajah</h2>
        <p className="text-sm text-slate-400 mt-1">
          Arahkan wajah Anda ke kamera untuk masuk secara instan tanpa perlu mengetik password.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-4 bg-rose-950/50 border border-rose-500/40 rounded-2xl flex items-start gap-3 text-rose-300 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {verifiedUser ? (
        <div className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Login Berhasil!</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Identitas terkonfirmasi dengan tingkat kecocokan Euclidean:{" "}
              <span className="text-emerald-400 font-mono font-semibold">
                {distanceScore !== null ? distanceScore.toFixed(3) : "OK"}
              </span>
            </p>
          </div>

          {verifiedUser.faceImageUrl && (
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500 mx-auto">
              <img
                src={verifiedUser.faceImageUrl}
                alt={verifiedUser.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-sm font-semibold text-slate-200">
            Halo, {verifiedUser.name} ({verifiedUser.email})
          </div>

          <button
            type="button"
            onClick={() => setVerifiedUser(null)}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition"
          >
            Coba Login Lagi
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-sky-400" /> Sertakan Email untuk Verifikasi 1:1
            </span>
            <input
              type="checkbox"
              checked={useEmailVerification}
              onChange={(e) => setUseEmailVerification(e.target.checked)}
              className="accent-sky-500 w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {useEmailVerification && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Alamat Email Terdaftar</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
                />
              </div>
            </div>
          )}

          <FaceScanner onFaceCaptured={handleFaceCaptured} isProcessing={isLoading} />

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-xs text-sky-400 font-medium py-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Mencocokkan vektor wajah dengan database...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
