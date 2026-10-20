"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  ScanFace,
  LayoutDashboard,
  Scan,
  Cpu,
  ShieldCheck,
  Database,
  Loader2,
  Sparkles,
} from "lucide-react";

const AttendanceKiosk = dynamic(() => import("@/components/AttendanceKiosk"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-16 text-slate-400 gap-3 text-sm">
      <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      Memuat modul Kiosk Presensi Wajah...
    </div>
  ),
});

const AdminPortal = dynamic(() => import("@/components/AdminPortal"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center p-16 text-slate-400 gap-3 text-sm">
      <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      Memuat Portal Admin & Rekapitulasi...
    </div>
  ),
});

export default function Home() {
  const [activePortal, setActivePortal] = useState<"kiosk" | "admin">("kiosk");

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 bg-[#070b14] overflow-hidden text-slate-100">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-sky-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />

      {/* Top Application Header */}
      <header className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-4 py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <ScanFace className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              AutoFace <span className="text-[10px] font-mono uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">Attendance AI</span>
            </h1>
            <p className="text-xs text-slate-400">Sistem Presensi Kiosk Otomatis & Manajemen Wajah</p>
          </div>
        </div>

        {/* Portal Switcher Buttons */}
        <div className="inline-flex p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-inner">
          <button
            type="button"
            onClick={() => setActivePortal("kiosk")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activePortal === "kiosk"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Scan className="w-4 h-4" /> Kiosk Presensi (User)
          </button>
          <button
            type="button"
            onClick={() => setActivePortal("admin")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activePortal === "admin"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Portal Admin
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl my-6">
        {activePortal === "kiosk" ? <AttendanceKiosk /> : <AdminPortal />}
      </section>

      {/* Technical Feature Badges Footer */}
      <footer className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
          <Cpu className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <div className="font-semibold text-slate-200">1:N Real-Time Face Match</div>
            <div className="text-[11px] text-slate-500">Pencarian identitas otomatis tanpa input manual</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold text-slate-200">Anti-Duplikasi & Cooldown</div>
            <div className="text-[11px] text-slate-500">Proteksi spam presensi & verifikasi keaslian</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
          <Database className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <div className="font-semibold text-slate-200">PostgreSQL + Prisma</div>
            <div className="text-[11px] text-slate-500">Penyimpanan aman embedding & log absensi</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
