"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ScanFace, UserPlus, LogIn, Cpu, ShieldCheck, Database, Loader2 } from "lucide-react";

const RegisterForm = dynamic(() => import("@/components/RegisterForm"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-12 text-slate-400 gap-2 text-sm">
      <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
      Memuat modul registrasi biometrik...
    </div>
  ),
});

const LoginForm = dynamic(() => import("@/components/LoginForm"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-12 text-slate-400 gap-2 text-sm">
      <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
      Memuat modul login biometrik...
    </div>
  ),
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<"register" | "login">("register");

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 bg-[#070b14] overflow-hidden text-slate-100">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none" />

      <header className="w-full max-w-5xl flex items-center justify-between py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <ScanFace className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              VeriFace <span className="text-[10px] font-mono uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">AI Biometrics</span>
            </h1>
            <p className="text-xs text-slate-400">Next.js & Node.js Face Authentication</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 rounded-full border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Vektor 128-D ResNet
          </div>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl my-8">
        <div className="inline-flex p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-8 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeTab === "register"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <UserPlus className="w-4 h-4" /> Daftar Wajah
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeTab === "login"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <LogIn className="w-4 h-4" /> Masuk Wajah
          </button>
        </div>

        {activeTab === "register" ? <RegisterForm /> : <LoginForm />}
      </section>

      <footer className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
          <Cpu className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <div className="font-semibold text-slate-200">Client-Side AI Extraction</div>
            <div className="text-[11px] text-slate-500">Ekstraksi fitur wajah lokal tanpa lag</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold text-slate-200">Euclidean Distance</div>
            <div className="text-[11px] text-slate-500">Pencocokan biometrik ambang presisi L2</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
          <Database className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <div className="font-semibold text-slate-200">PostgreSQL + Prisma</div>
            <div className="text-[11px] text-slate-500">Penyimpanan aman struktur vektor 128 float</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
