"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ScanFace, ArrowLeft, Scan, Loader2 } from "lucide-react";

const AdminPortal = dynamic(() => import("@/components/AdminPortal"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-3 text-sm">
      <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      Memuat Portal Manajemen Admin...
    </div>
  ),
});

export default function AdminPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 bg-[#070b14] overflow-hidden text-slate-100">
      {/* Background Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-sky-500/10 blur-[140px] pointer-events-none" />

      {/* Admin Header */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <ScanFace className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              AutoFace <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full">Admin Dashboard</span>
            </h1>
            <p className="text-xs text-slate-400">Pendaftaran Vermuk & Rekapitulasi Presensi</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/kiosk"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-500/20 transition-all"
          >
            <Scan className="w-3.5 h-3.5" />
            Buka Kiosk Absen
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

      {/* Admin Content */}
      <section className="flex-1 flex flex-col items-center justify-start w-full max-w-5xl mb-8">
        <AdminPortal />
      </section>

      {/* Footer */}
      <footer className="w-full max-w-5xl py-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        Panel Administrator Sistem Presensi Wajah • PostgreSQL & Prisma Engine
      </footer>
    </main>
  );
}
