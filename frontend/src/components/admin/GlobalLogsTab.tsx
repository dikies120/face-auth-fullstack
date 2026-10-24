import { Activity, RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AttendanceLog } from "./types";

interface GlobalLogsTabProps {
  logs: AttendanceLog[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function GlobalLogsTab({ logs, isLoading, onRefresh }: GlobalLogsTabProps) {
  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-zinc-900">Pemantauan Presensi Global Se-Sistem</h3>
          <p className="text-xs text-zinc-500">
            Aktivitas scan kehadiran dari seluruh perangkat Kiosk dan anggota tim secara real-time
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl transition-colors border border-zinc-200 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-orange-600" : ""}`} />
          Segarkan Feed
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-14 text-zinc-400 text-sm flex flex-col items-center gap-2">
          <Activity className="w-8 h-8 text-zinc-300" />
          Belum ada riwayat aktivitas presensi yang tercatat di platform.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-semibold text-[11px] tracking-wider border-b border-zinc-200">
              <tr>
                <th className="py-3 px-4">Waktu Presensi</th>
                <th className="py-3 px-4">Snapshot Foto</th>
                <th className="py-3 px-4">Nama &amp; Akun</th>
                <th className="py-3 px-4">Departemen</th>
                <th className="py-3 px-4">Jenis Scan</th>
                <th className="py-3 px-4">Status Ketepatan</th>
                <th className="py-3 px-4">Skor Biometrik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-zinc-900 whitespace-nowrap">
                    <div>
                      {new Date(log.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })} WIB
                    </div>
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
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {log.user.email || log.user.memberCode || "Member"}
                    </div>
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
  );
}
