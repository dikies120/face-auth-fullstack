"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, Loader2, KeyRound, Lock, ArrowRight, ScanFace, Key } from "lucide-react";
import FaceScanner from "@/components/scanner/FaceScanner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function LoginForm() {
  const [loginMethod, setLoginMethod] = useState<"face" | "password">("face");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useEmailVerification, setUseEmailVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifiedUser, setVerifiedUser] = useState<{
    id: string;
    name: string;
    email: string;
    role?: string;
    faceImageUrl?: string;
  } | null>(null);
  const [distanceScore, setDistanceScore] = useState<number | null>(null);

  const saveSessionAndRedirect = (userData: { id: string; name: string; email: string; role?: string; faceImageUrl?: string }, token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("face_auth_user", JSON.stringify(userData));
      localStorage.setItem("face_auth_token", token);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);
    }
  };

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
      saveSessionAndRedirect(result.user, result.token);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal memverifikasi wajah.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage("Email dan kata sandi wajib diisi.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login gagal. Periksa kembali email dan password Anda.");
      }

      setVerifiedUser(result.user);
      saveSessionAndRedirect(result.user, result.token);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-lg text-zinc-900">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Masuk ke Akun Anda</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Pilih metode login wajah biometrik instan atau login standar dengan email dan sandi.
        </p>

        <div className="flex items-center gap-2 mt-4 p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200/80">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("face");
              setErrorMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              loginMethod === "face"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <ScanFace className="w-3.5 h-3.5 text-orange-600" />
            <span>Scan Wajah</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginMethod("password");
              setErrorMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              loginMethod === "password"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Key className="w-3.5 h-3.5 text-orange-600" />
            <span>Email &amp; Sandi</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {verifiedUser ? (
        <div className="bg-zinc-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-zinc-900">Login Berhasil!</h4>
            <p className="text-xs text-zinc-500 mt-0.5">
              Identitas terkonfirmasi. Mengalihkan Anda ke Dasbor Web Pengguna...
            </p>
          </div>

          {verifiedUser.faceImageUrl && (
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500 mx-auto shadow-sm">
              <img
                src={verifiedUser.faceImageUrl}
                alt={verifiedUser.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-sm font-semibold text-zinc-800">
            Halo, {verifiedUser.name} ({verifiedUser.email})
          </div>

          <a
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <span>Buka Web Pengguna Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      ) : loginMethod === "face" ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
            <span className="text-zinc-700 font-medium flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-orange-600" /> Sertakan Email untuk Verifikasi 1:1
            </span>
            <input
              type="checkbox"
              checked={useEmailVerification}
              onChange={(e) => setUseEmailVerification(e.target.checked)}
              className="accent-orange-500 w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {useEmailVerification && (
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">Alamat Email Terdaftar</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-white border border-zinc-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition"
                />
              </div>
            </div>
          )}

          <FaceScanner onFaceCaptured={handleFaceCaptured} isProcessing={isLoading} />

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-xs text-orange-600 font-medium py-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Mencocokkan vektor wajah dengan database...
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-white border border-zinc-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full bg-white border border-zinc-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Memeriksa Kredensial...
              </>
            ) : (
              <>
                <span>Masuk ke Web Pengguna</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
