"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ScanFace, ArrowLeft, Shield, Loader2 } from "lucide-react";

const AttendanceKiosk = dynamic(() => import("@/components/AttendanceKiosk"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-3 text-sm">
      <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      Memuat Kiosk Mesin Absensi...
    </div>
  ),
});

export default function KioskPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 bg-[#070b14] overflow-hidden text-slate-100">
      {/* Background Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-sky-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />

      {/* Kiosk Header */}
      <header className="w-full max-w-5xl flex items-center justify-between py-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <ScanFace className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              AutoFace <span className="text-[10px] font-mono uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">Kiosk User</span>
            </h1>
            <p className="text-xs text-slate-400">Layar Mesin Presensi Otomatis</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            Portal Admin
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Beranda
          </Link>
        </div>
      </header>

      {/* Kiosk Content */}
      <section className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl">
        <AttendanceKiosk />
      </section>

      {/* Footer */}
      <footer className="w-full max-w-5xl py-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        Mesin Presensi Wajah Otomatis • Standby Mode 1:N Biometric Matching
      </footer>
    </main>
  );
}
