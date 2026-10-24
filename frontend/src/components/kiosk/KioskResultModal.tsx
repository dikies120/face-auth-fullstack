import { CheckCircle2, Sparkles, Building, Clock } from "lucide-react";

export interface AttendanceResult {
  type: "IN" | "OUT";
  status: "ON_TIME" | "LATE";
  time: string;
  userName: string;
  memberCode?: string | null;
  department?: string | null;
  userImage?: string | null;
  snapshotUrl?: string | null;
  matchedScore?: number;
  message: string;
}

interface KioskResultModalProps {
  result: AttendanceResult;
  cooldownCountdown: number;
}

export default function KioskResultModal({ result, cooldownCountdown }: KioskResultModalProps) {
  return (
    <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="relative mb-4">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-500 shadow-xl shadow-emerald-500/20">
          <img
            src={result.snapshotUrl || result.userImage || "/placeholder-avatar.png"}
            alt={result.userName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-bold uppercase tracking-wider shadow-xs bg-emerald-50 text-emerald-800 border border-emerald-300">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        {result.type === "IN" ? "Absen Masuk Berhasil" : "Absen Pulang Berhasil"}
      </div>

      <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mb-1 tracking-tight">
        {result.userName}
      </h3>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-600 mb-4">
        {result.memberCode && (
          <span className="px-2.5 py-1 bg-zinc-100 rounded-lg border border-zinc-200 font-mono text-zinc-800">
            ID: {result.memberCode}
          </span>
        )}
        {result.department && (
          <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 flex items-center gap-1 font-medium">
            <Building className="w-3 h-3 text-orange-600" />
            {result.department}
          </span>
        )}
        <span
          className={`px-2.5 py-1 rounded-lg font-semibold ${
            result.status === "ON_TIME"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {result.status === "ON_TIME" ? "Tepat Waktu" : "Terlambat"}
        </span>
      </div>

      <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono mb-6">
        <Clock className="w-4 h-4 text-orange-600" />
        Waktu Presensi: <span className="text-zinc-900 font-bold">{result.time} WIB</span>
      </div>

      <div className="text-xs text-zinc-500">
        Layar siap kembali dalam <span className="text-orange-600 font-bold text-sm">{cooldownCountdown}</span> detik
      </div>
    </div>
  );
}
