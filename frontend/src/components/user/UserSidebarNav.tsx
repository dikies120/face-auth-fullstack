"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  UserPlus,
  Users,
  History,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  LogOut,
  ScanFace,
  User as UserIcon,
  Shield,
} from "lucide-react";

export type UserTab = "today" | "register" | "members" | "history";

interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  faceImageUrl?: string | null;
}

interface UserSidebarNavProps {
  activeTab: UserTab;
  onChangeTab: (tab: UserTab) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export default function UserSidebarNav({
  activeTab,
  onChangeTab,
  user,
  onLogout,
}: UserSidebarNavProps) {
  const [copied, setCopied] = useState(false);

  const kioskUrl = typeof window !== "undefined"
    ? `${window.location.origin}/kiosk`
    : "http://localhost:3000/kiosk";

  const handleCopyKioskUrl = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(kioskUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-zinc-200 min-h-screen flex flex-col justify-between p-4 sm:p-5">
      <div className="flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-xs text-white">
            <ScanFace className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-zinc-900">AutoFace</span>
              <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Dasbor Presensi Tim</p>
          </div>
        </Link>

        <div>
          <div className="px-2.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Menu Utama
          </div>
          <nav className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => onChangeTab("today")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "today"
                  ? "bg-orange-500 text-white shadow-xs font-bold"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <CalendarCheck className="w-4 h-4 shrink-0" />
              <span>Presensi Hari Ini</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTab("register")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "register"
                  ? "bg-orange-500 text-white shadow-xs font-bold"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>Daftarkan Wajah Tim</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTab("members")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "members"
                  ? "bg-orange-500 text-white shadow-xs font-bold"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Data Anggota Tim</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTab("history")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                activeTab === "history"
                  ? "bg-orange-500 text-white shadow-xs font-bold"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <History className="w-4 h-4 shrink-0" />
              <span>Riwayat &amp; Laporan</span>
            </button>
          </nav>
        </div>

        <div className="p-3.5 bg-orange-50/60 border border-orange-200/90 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800 mb-1">
            <Smartphone className="w-3.5 h-3.5 text-orange-600" />
            Layar Presensi Kiosk
          </div>
          <p className="text-[11px] text-zinc-600 mb-2 leading-relaxed">
            Pasang link ini di HP / tablet meja absensi:
          </p>

          <div className="flex items-center gap-1.5 p-1.5 bg-white border border-orange-200 rounded-xl mb-2">
            <span className="text-[10px] font-mono text-zinc-600 truncate flex-1 select-all">
              {kioskUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyKioskUrl}
              className="p-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 transition shrink-0"
              title="Salin URL"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex gap-1.5">
            <Link
              href="/kiosk"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold rounded-lg shadow-xs transition"
            >
              <ExternalLink className="w-3 h-3" />
              Buka Kiosk
            </Link>
            <button
              type="button"
              onClick={handleCopyKioskUrl}
              className="py-1.5 px-2.5 bg-white hover:bg-zinc-50 text-zinc-700 text-[11px] font-semibold rounded-lg border border-zinc-200 transition"
            >
              {copied ? "Tersalin!" : "Salin"}
            </button>
          </div>
        </div>

        {user?.role === "ADMIN" && (
          <div className="px-2">
            <Link
              href="/admin"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Portal Super Admin</span>
            </Link>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-zinc-200 mt-6 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center overflow-hidden shrink-0">
            {user?.faceImageUrl ? (
              <img
                src={user.faceImageUrl}
                alt={user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-orange-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-zinc-900 truncate">
              {user?.name || "Pengguna Terdaftar"}
            </div>
            <div className="text-[11px] text-zinc-400 truncate">
              {user?.email || "user@autoface.local"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar (Logout)
        </button>
      </div>
    </aside>
  );
}
