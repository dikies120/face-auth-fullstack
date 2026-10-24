import { Scan, Volume2, VolumeX } from "lucide-react";

interface KioskHeaderProps {
  currentTime: string;
  currentDate: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function KioskHeader({
  currentTime,
  currentDate,
  soundEnabled,
  onToggleSound,
}: KioskHeaderProps) {
  return (
    <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-4 p-4 mb-4 bg-white border border-zinc-200/90 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center shadow-xs text-white">
          <Scan className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-900 tracking-wide">Kiosk Presensi Wajah</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Standby
            </span>
          </div>
          <p className="text-xs text-zinc-500">Pencocokan 1:N Vektor Biometrik AI Otomatis</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-zinc-900 tracking-wider">
            {currentTime || "00:00:00"}{" "}
            <span className="text-xs font-semibold text-orange-600">WIB</span>
          </div>
          <div className="text-xs text-zinc-500">{currentDate || "Memuat tanggal..."}</div>
        </div>

        <button
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? "Matikan Suara" : "Aktifkan Suara"}
          className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 transition-colors border border-zinc-200 shadow-xs"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-orange-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-400" />
          )}
        </button>
      </div>
    </div>
  );
}
