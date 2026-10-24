"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ScanFace, ArrowLeft, LayoutDashboard, Shield, Loader2 } from "lucide-react";

const AttendanceKiosk = dynamic(() => import("@/components/kiosk/AttendanceKiosk"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-20 text-zinc-500 gap-3 text-sm">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      Memuat Kiosk Mesin Presensi...
    </div>
  ),
});

export default function KioskPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 bg-white overflow-hidden text-zinc-900">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-gradient-to-b from-orange-100/60 via-amber-50/20 to-transparent blur-[80px] rounded-full" />
      </div>

      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between py-3 border-b border-zinc-200/80 mb-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-xs text-white">
            <ScanFace className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              AutoFace <span className="text-[10px] font-mono uppercase bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-semibold">Kiosk Presensi</span>
            </h1>
            <p className="text-xs text-zinc-500">Layar Mesin Presensi Mandiri (HP / Tablet)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Web Pengguna (/dashboard)
          </Link>
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/70 border border-zinc-200 rounded-xl text-xs font-semibold transition"
          >
            <Shield className="w-3.5 h-3.5 text-orange-600" />
            Super Admin
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-500 hover:text-zinc-800 text-xs font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Beranda
          </Link>
        </div>
      </header>

      <section className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-5xl">
        <AttendanceKiosk />
      </section>

      <footer className="relative z-10 w-full max-w-5xl py-4 border-t border-zinc-200 text-center text-xs text-zinc-500">
        Mesin Presensi Wajah Otomatis • Standby Mode 1:N Biometric Matching
      </footer>
    </main>
  );
}
