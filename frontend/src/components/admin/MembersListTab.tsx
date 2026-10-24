import { Users, RefreshCw, Trash2 } from "lucide-react";
import { Member } from "./types";

interface MembersListTabProps {
  members: Member[];
  isLoading: boolean;
  deletingId: string | null;
  onRefresh: () => void;
  onDelete: (id: string, name: string) => void;
}

export default function MembersListTab({
  members,
  isLoading,
  deletingId,
  onRefresh,
  onDelete,
}: MembersListTabProps) {
  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-zinc-900">Daftar Anggota Terdaftar</h3>
          <p className="text-xs text-zinc-500">
            Total {members.length} anggota dengan verifikasi wajah aktif
          </p>
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

      {members.length === 0 ? (
        <div className="text-center py-12 text-zinc-400 text-sm flex flex-col items-center gap-2">
          <Users className="w-8 h-8 text-zinc-300" />
          Belum ada anggota terdaftar. Buka tab &quot;Daftarkan Wajah&quot; untuk menambahkan.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-semibold text-[11px] tracking-wider border-b border-zinc-200">
              <tr>
                <th className="py-3 px-4">Foto Wajah</th>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Nomor ID</th>
                <th className="py-3 px-4">Departemen</th>
                <th className="py-3 px-4">Total Absensi</th>
                <th className="py-3 px-4">Tanggal Daftar</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-xs">
                      <img
                        src={m.faceImageUrl || "/placeholder-avatar.png"}
                        alt={m.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-zinc-900 text-sm">{m.name}</div>
                    {m.email && <div className="text-[11px] text-zinc-400">{m.email}</div>}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-zinc-700">
                    {m.memberCode || "-"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-zinc-600">
                    {m.department || "-"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                      {m._count?.attendances || 0} kali
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-zinc-500 text-[11px]">
                    {new Date(m.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onDelete(m.id, m.name)}
                      disabled={deletingId === m.id}
                      className="p-2 rounded-xl text-rose-600 hover:text-white hover:bg-rose-500 transition-colors"
                      title="Hapus Anggota"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
