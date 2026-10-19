"use client";

import { useState } from "react";
import { User, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import FaceScanner from "./FaceScanner";

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
    user: { id: string; name: string; email: string; faceImageUrl: string };
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
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Registrasi Berhasil!</h3>
        <p className="text-sm text-slate-400 mb-6">
          Akun Anda telah terdaftar dan terhubung secara biometrik dengan model wajah Anda.
        </p>

        {successData.user.faceImageUrl && (
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/50 mx-auto mb-5 shadow-lg">
            <img
              src={successData.user.faceImageUrl}
              alt={successData.user.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="bg-slate-950/70 rounded-2xl p-4 text-left border border-slate-800 space-y-2 mb-6">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Nama:</span>
            <span className="font-semibold text-slate-200">{successData.user.name}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Email:</span>
            <span className="font-semibold text-slate-200">{successData.user.email}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Status Wajah:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSuccessData(null);
            setFormData({ name: "", email: "", password: "" });
            setFaceData(null);
          }}
          className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition"
        >
          Daftarkan Akun Lain
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Registrasi dengan Wajah</h2>
        <p className="text-sm text-slate-400 mt-1">
          Lengkapi identitas Anda dan lakukan pemindaian wajah untuk mengaktifkan login biometrik.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-4 bg-rose-950/50 border border-rose-500/40 rounded-2xl flex items-start gap-3 text-rose-300 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Nama Lengkap</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama lengkap"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="nama@email.com"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimal 6 karakter"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Pemindaian Wajah Biometrik
          </label>
          <FaceScanner onFaceCaptured={handleFaceCaptured} isProcessing={isLoading} />
        </div>

        <button
          type="submit"
          disabled={isLoading || !faceData}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-xl ${
            faceData && !isLoading
              ? "bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white shadow-indigo-500/25 active:scale-[0.99]"
              : "bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan Data & Wajah...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Selesaikan Pendaftaran Wajah
            </>
          )}
        </button>
      </form>
    </div>
  );
}
