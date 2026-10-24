"use client";

import { useState } from "react";
import { User, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import FaceScanner from "@/components/scanner/FaceScanner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [faceData, setFaceData] = useState<{
    descriptor: number[];
    imageBase64: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    user: { id: string; name: string; email: string; role?: string; faceImageUrl: string };
    token: string;
  } | null>(null);

  const handleFaceCaptured = (data: { descriptor: number[]; imageBase64: string }) => {
    setFaceData(data);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("Silakan lengkapi nama, email, dan password Anda.");
      return;
    }

    if (!faceData) {
      setErrorMessage("Pindai dan ambil sampel wajah terlebih dahulu sebelum mendaftar.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register-face`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          faceDescriptor: faceData.descriptor,
          faceImageUrl: faceData.imageBase64,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal melakukan registrasi.");
      }

      setSuccessData(result.data);

      if (typeof window !== "undefined") {
        localStorage.setItem("face_auth_user", JSON.stringify(result.data.user));
        localStorage.setItem("face_auth_token", result.data.token);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="bg-white border border-emerald-300 rounded-3xl p-8 max-w-lg w-full text-center shadow-lg animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 mb-2">Registrasi Berhasil!</h3>
        <p className="text-sm text-zinc-500 mb-6">
          Akun Anda telah terdaftar dan terhubung secara biometrik dengan model wajah Anda.
        </p>

        {successData.user.faceImageUrl && (
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-500 mx-auto mb-5 shadow-sm">
            <img
              src={successData.user.faceImageUrl}
              alt={successData.user.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="bg-zinc-50 rounded-2xl p-4 text-left border border-zinc-200 space-y-2 mb-6">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Nama:</span>
            <span className="font-semibold text-zinc-900">{successData.user.name}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Email:</span>
            <span className="font-semibold text-zinc-900">{successData.user.email}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Status Wajah:</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Terverifikasi
            </span>
          </div>
        </div>

        <a
          href="/dashboard"
          className="w-full py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-2"
        >
          <span>Masuk ke Dasbor Web Pengguna</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-lg text-zinc-900">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Daftar Akun Baru</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Lengkapi identitas Anda dan lakukan pemindaian wajah untuk mengaktifkan presensi biometrik.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">Nama Lengkap / Organisasi</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama lengkap atau tim"
                className="w-full bg-white border border-zinc-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimal 6 karakter"
                className="w-full bg-white border border-zinc-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-200">
          <label className="block text-xs font-semibold text-zinc-800 mb-2">
            Pemindaian Wajah Biometrik
          </label>
          <FaceScanner onFaceCaptured={handleFaceCaptured} isProcessing={isLoading} />
        </div>

        <button
          type="submit"
          disabled={isLoading || !faceData}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm ${
            faceData && !isLoading
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25 active:scale-[0.99]"
              : "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan Data &amp; Wajah...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Selesaikan Pendaftaran &amp; Masuk ke Dasbor
            </>
          )}
        </button>
      </form>
    </div>
  );
}
