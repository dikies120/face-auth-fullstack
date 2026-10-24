import { History, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AttendanceLog } from "./types";

interface AttendanceHistoryTabProps {
  logs: AttendanceLog[];
  isLoading: boolean;
  filterDate: string;
  setFilterDate: (v: string) => void;
  filterSearch: string;
  setFilterSearch: (v: string) => void;
  onFilter: () => void;
}

export default function AttendanceHistoryTab({
  logs,
  isLoading,
  filterDate,
  setFilterDate,
  filterSearch,
  setFilterSearch,
  onFilter,
}: AttendanceHistoryTabProps) {
  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-zinc-900">Riwayat Presensi Lengkap</h3>
          <p className="text-xs text-zinc-500">Pencarian dan filter data presensi</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-zinc-800 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />

          <input
            type="text"
            placeholder="Cari nama / ID..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-zinc-800 placeholder:text-zinc-400 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />

          <button
            type="button"
            onClick={onFilter}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" /> Filter
          </button>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-zinc-400 text-sm flex flex-col items-center gap-2">
          <History className="w-8 h-8 text-zinc-300" />
          Tidak ada data riwayat presensi yang cocok dengan filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-semibold text-[11px] tracking-wider border-b border-zinc-200">
              <tr>
                <th className="py-3 px-4">Tanggal &amp; Waktu</th>
                <th className="py-3 px-4">Snapshot</th>
                <th className="py-3 px-4">Nama Anggota</th>
                <th className="py-3 px-4">Nomor ID</th>
                <th className="py-3 px-4">Departemen</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Skor Kecocokan</th>
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
                  <td className="py-3 px-4 whitespace-nowrap font-bold text-zinc-900 text-sm">
                    {log.user.name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-zinc-600">
                    {log.user.memberCode || "-"}
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
