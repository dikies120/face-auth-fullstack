import { RefreshCw, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { TodayStats, AttendanceLog } from "./types";

interface TodaySummaryTabProps {
  stats: TodayStats | null;
  logs: AttendanceLog[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function TodaySummaryTab({
  stats,
  logs,
  isLoading,
  onRefresh,
}: TodaySummaryTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-zinc-200/90 rounded-2xl flex flex-col gap-1 shadow-xs">
          <span className="text-xs text-zinc-500 font-medium">Total Anggota</span>
          <span className="text-2xl font-bold text-zinc-900 font-mono">
            {stats ? stats.totalMembers : 0}
          </span>
          <span className="text-[11px] text-zinc-400">Terdaftar di database</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/90 rounded-2xl flex flex-col gap-1 shadow-xs">
          <span className="text-xs text-zinc-500 font-medium">Hadir Hari Ini</span>
          <span className="text-2xl font-bold text-orange-600 font-mono">
            {stats ? stats.presentToday : 0}
          </span>
          <span className="text-[11px] text-orange-700 font-medium">
            {stats && stats.totalMembers > 0
              ? `${Math.round((stats.presentToday / stats.totalMembers) * 100)}% kehadiran`
              : "0%"}
          </span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/90 rounded-2xl flex flex-col gap-1 shadow-xs">
          <span className="text-xs text-zinc-500 font-medium">Tepat Waktu</span>
          <span className="text-2xl font-bold text-emerald-600 font-mono">
            {stats ? stats.onTimeCount : 0}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Sebelum 08:30 WIB</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/90 rounded-2xl flex flex-col gap-1 shadow-xs">
          <span className="text-xs text-zinc-500 font-medium">Terlambat</span>
          <span className="text-2xl font-bold text-amber-600 font-mono">
            {stats ? stats.lateCount : 0}
          </span>
          <span className="text-[11px] text-amber-700 font-medium">Setelah 08:30 WIB</span>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Log Presensi Hari Ini</h3>
            <p className="text-xs text-zinc-500">Pembaruan otomatis real-time dari Kiosk</p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl transition-colors border border-zinc-200 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-orange-600" : ""}`} />
            Segarkan
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-sm flex flex-col items-center gap-2">
            <Clock className="w-8 h-8 text-zinc-300" />
            Belum ada data presensi hari ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-700">
              <thead className="bg-zinc-50 text-zinc-500 uppercase font-semibold text-[11px] tracking-wider border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Foto Bukti</th>
                  <th className="py-3 px-4">Nama &amp; ID</th>
                  <th className="py-3 px-4">Departemen</th>
                  <th className="py-3 px-4">Jenis</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Skor Wajah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-zinc-900 font-semibold whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-xs">
                        <img
                          src={log.snapshotUrl || log.user.faceImageUrl || "/placeholder-avatar.png"}
                          alt={log.user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-zinc-900 text-sm">{log.user.name}</div>
                      {log.user.memberCode && (
                        <div className="text-[11px] text-zinc-500 font-mono">
                          ID: {log.user.memberCode}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-zinc-600">
                      {log.user.department || "-"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {log.type === "IN" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ArrowUpRight className="w-3 h-3" /> MASUK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                          <ArrowDownRight className="w-3 h-3" /> PULANG
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          log.status === "ON_TIME"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {log.status === "ON_TIME" ? "Tepat Waktu" : "Terlambat"}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-zinc-500">
                      {Math.round((1 - log.similarityDistance) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
