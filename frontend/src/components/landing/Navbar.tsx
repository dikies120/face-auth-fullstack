"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScanFace, ArrowRight, UserPlus, LogIn } from "lucide-react";

export default function Navbar() {
  const [hasLoggedInUser, setHasLoggedInUser] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("face_auth_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setHasLoggedInUser(true);
          setUserName(parsed.name || "");
        } catch {
          setHasLoggedInUser(false);
        }
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-zinc-200/90 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <ScanFace className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-zinc-900">AutoFace</span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 font-semibold">
              Biometric Presensi
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-600">
          <a href="#fitur" className="hover:text-orange-600 transition-colors">Fitur Utama</a>
          <a href="#arsitektur" className="hover:text-orange-600 transition-colors">Arsitektur Kiosk &amp; Web</a>
          <a href="#perbandingan" className="hover:text-orange-600 transition-colors">Perbandingan</a>
          <a href="#faq" className="hover:text-orange-600 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          {hasLoggedInUser ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/25 transition"
            >
              <span>Dasbor ({userName.split(" ")[0] || "Akun"})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:text-orange-600 hover:bg-orange-50/60 transition"
              >
                <LogIn className="w-3.5 h-3.5 text-zinc-500" />
                <span>Masuk</span>
              </Link>
              <Link
                href="/daftar"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/25 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Daftar Akun</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
