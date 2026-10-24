import { useState } from "react";
import { Users, Search, Trash2, RefreshCw, Shield, UserCheck } from "lucide-react";
import { AdminManagedUser } from "./types";

interface ManageUsersTabProps {
  users: AdminManagedUser[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  roleFilter: string;
  setRoleFilter: (v: string) => void;
  onRefresh: () => void;
  onDeleteUser: (id: string, name: string) => void;
  onUpdateRole: (id: string, newRole: string) => void;
}

export default function ManageUsersTab({
  users,
  isLoading,
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  onRefresh,
  onDeleteUser,
  onUpdateRole,
}: ManageUsersTabProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleRole = async (user: AdminManagedUser) => {
    const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    setUpdatingId(user.id);
    await onUpdateRole(user.id, nextRole);
    setUpdatingId(null);
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-zinc-900">Manajemen Akun Pengguna</h3>
          <p className="text-xs text-zinc-500">
            Kelola hak akses, status peran, dan data seluruh akun yang terdaftar di platform
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl transition-colors border border-zinc-200 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-orange-600" : ""}`} />
          Segarkan Data
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, atau ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-zinc-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-700 font-medium focus:border-orange-500 outline-none"
        >
          <option value="ALL">Semua Peran</option>
          <option value="USER">Peran: USER</option>
          <option value="ADMIN">Peran: ADMIN</option>
          <option value="MEMBER">Peran: MEMBER</option>
        </select>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-14 text-zinc-400 text-sm flex flex-col items-center gap-2">
          <Users className="w-8 h-8 text-zinc-300" />
          Tidak ada akun yang sesuai dengan pencarian atau filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-500 uppercase font-semibold text-[11px] tracking-wider border-b border-zinc-200">
              <tr>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Departemen / ID</th>
                <th className="py-3 px-4">Total Absensi</th>
                <th className="py-3 px-4">Tanggal Bergabung</th>
                <th className="py-3 px-4 text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-xs shrink-0">
                        <img
                          src={u.faceImageUrl || "/placeholder-avatar.png"}
                          alt={u.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-zinc-900 text-sm truncate">{u.name}</div>
                        <div className="text-[11px] text-zinc-400 truncate">{u.email || "-"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        u.role === "ADMIN"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : u.role === "USER"
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-zinc-800 font-medium">{u.department || "-"}</div>
                    {u.memberCode && (
                      <div className="text-[10px] text-zinc-400 font-mono">ID: {u.memberCode}</div>
                    )}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-semibold text-zinc-800">
                      {u._count?.attendances || 0}
                    </span>{" "}
                    <span className="text-zinc-400 text-[11px]">kali</span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-mono text-zinc-500 text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleRole(u)}
                        disabled={updatingId === u.id}
                        className="px-2.5 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition"
                        title="Ubah peran akun"
                      >
                        {u.role === "ADMIN" ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-zinc-500" /> Jadikan User
                          </>
                        ) : (
                          <>
                            <Shield className="w-3.5 h-3.5 text-orange-600" /> Jadikan Admin
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteUser(u.id, u.name)}
                        className="p-1.5 rounded-xl text-rose-600 hover:text-white hover:bg-rose-500 transition"
                        title="Hapus akun pengguna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
