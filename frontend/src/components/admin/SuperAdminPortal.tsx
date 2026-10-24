"use client";

import { useEffect, useState, useCallback } from "react";
import { BarChart3, Users, Activity, Shield } from "lucide-react";
import PlatformStatsTab from "./PlatformStatsTab";
import ManageUsersTab from "./ManageUsersTab";
import GlobalLogsTab from "./GlobalLogsTab";
import { PlatformStats, AdminManagedUser, AttendanceLog } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

type SuperAdminTab = "stats" | "users" | "logs";

export default function SuperAdminPortal() {
  const [activeTab, setActiveTab] = useState<SuperAdminTab>("stats");

  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const [users, setUsers] = useState<AdminManagedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [globalLogs, setGlobalLogs] = useState<AttendanceLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/stats`);
      const json = await res.json();
      if (res.ok && json.success) {
        setStats(json.stats);
      }
    } catch {
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      if (userSearch) params.append("search", userSearch);
      if (roleFilter !== "ALL") params.append("role", roleFilter);

      const res = await fetch(`${BACKEND_URL}/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setUsers(json.users || []);
      }
    } catch {
    } finally {
      setIsLoadingUsers(false);
    }
  }, [userSearch, roleFilter]);

  const fetchLogs = useCallback(async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/logs`);
      const json = await res.json();
      if (res.ok && json.success) {
        setGlobalLogs(json.logs || []);
      }
    } catch {
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "stats") {
      fetchStats();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "logs") {
      fetchLogs();
    }
  }, [activeTab, fetchStats, fetchUsers, fetchLogs]);

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Hapus akun pengguna "${name}" beserta seluruh data riwayatnya?`)) {
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        fetchUsers();
        fetchStats();
      } else {
        alert(json.message || "Gagal menghapus akun pengguna.");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat menghapus akun.");
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        fetchUsers();
      } else {
        alert(json.message || "Gagal memperbarui peran akun.");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat memperbarui peran akun.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="p-2 bg-white border border-zinc-200/90 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "stats"
                ? "bg-orange-500 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistik Platform</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "users"
                ? "bg-orange-500 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kelola Akun Pengguna</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "logs"
                ? "bg-orange-500 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Pemantauan Presensi Global</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 px-3 py-1 font-medium">
          <Shield className="w-3.5 h-3.5 text-orange-600" />
          <span>Super Admin Mode</span>
        </div>
      </div>

      {activeTab === "stats" && (
        <PlatformStatsTab stats={stats} isLoading={isLoadingStats} onRefresh={fetchStats} />
      )}

      {activeTab === "users" && (
        <ManageUsersTab
          users={users}
          isLoading={isLoadingUsers}
          searchTerm={userSearch}
          setSearchTerm={setUserSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          onRefresh={fetchUsers}
          onDeleteUser={handleDeleteUser}
          onUpdateRole={handleUpdateRole}
        />
      )}

      {activeTab === "logs" && (
        <GlobalLogsTab logs={globalLogs} isLoading={isLoadingLogs} onRefresh={fetchLogs} />
      )}
    </div>
  );
}
