import { Users, CalendarCheck, Clock, ScanFace, RefreshCw, Server, Database, Cpu } from "lucide-react";
import { PlatformStats } from "./types";

interface PlatformStatsTabProps {
  stats: PlatformStats | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function PlatformStatsTab({ stats, isLoading, onRefresh }: PlatformStatsTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-zinc-200/90 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-medium">Total Akun Terdaftar</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-zinc-900">
              {stats?.totalUsers || 0}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Akun pengguna &amp; organisasi</div>
          </div>
        </div>

        <div className="p-5 bg-white border border-zinc-200/90 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-medium">Total Presensi Se-Platform</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-orange-600">
              {stats?.totalAttendances || 0}
            </div>
            <div className="text-[11px] text-orange-700 font-medium mt-1">Akumulasi seluruh scan</div>
          </div>
        </div>

        <div className="p-5 bg-white border border-zinc-200/90 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-medium">Presensi Hari Ini</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-emerald-600">
              {stats?.todayAttendances || 0}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">Aktivitas presensi hari ini</div>
          </div>
        </div>

        <div className="p-5 bg-white border border-zinc-200/90 rounded-2xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-medium">Log Verifikasi Wajah</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <ScanFace className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-amber-600">
              {stats?.totalFaceLogins || 0}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">Riwayat login biometrik</div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border border-zinc-200/90 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Status Infrastruktur Sistem</h3>
            <p className="text-xs text-zinc-500">Status operasional backend Node.js dan basis data PostgreSQL</p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl transition-colors border border-zinc-200 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-orange-600" : ""}`} />
            Segarkan Status
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-2xl flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-zinc-900">Node.js Express Server</div>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">Port 5000 • CORS Enabled</div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Running Aktif
              </span>
            </div>
          </div>

          <div className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-2xl flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-zinc-900">PostgreSQL Prisma ORM</div>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">Relational DB • Migrated</div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Terhubung
              </span>
            </div>
          </div>

          <div className="p-4 bg-zinc-50/70 border border-zinc-200 rounded-2xl flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-zinc-900">AI Face Recognition Engine</div>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">TinyFace 128-D Euclidean</div>
              <span className="inline-flex items-center gap-1 text-[10px] text-indigo-700 font-semibold mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /> Siap Deteksi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
