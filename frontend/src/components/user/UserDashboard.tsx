"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ExternalLink, Smartphone } from "lucide-react";
import UserSidebarNav, { UserTab } from "./UserSidebarNav";
import TodaySummaryTab from "@/components/admin/TodaySummaryTab";
import RegisterMemberTab from "@/components/admin/RegisterMemberTab";
import MembersListTab from "@/components/admin/MembersListTab";
import AttendanceHistoryTab from "@/components/admin/AttendanceHistoryTab";
import { Member, TodayStats, AttendanceLog } from "@/components/admin/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  faceImageUrl?: string | null;
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<UserTab>("today");
  const [user, setUser] = useState<CurrentUser | null>(null);

  const [name, setName] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [faceData, setFaceData] = useState<{
    descriptor: number[];
    imageBase64: string;
  } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [todayLogs, setTodayLogs] = useState<AttendanceLog[]>([]);
  const [isLoadingToday, setIsLoadingToday] = useState(false);

  const [members, setMembers] = useState<Member[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [historyLogs, setHistoryLogs] = useState<AttendanceLog[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterSearch, setFilterSearch] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("face_auth_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
        }
      } else {
        setUser({
          id: "demo-user",
          name: "Pengguna FacePass",
          email: "user@perusahaan.com",
          role: "USER",
          faceImageUrl: null,
        });
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("face_auth_user");
      localStorage.removeItem("face_auth_token");
      window.location.href = "/";
    }
  };

  const fetchTodayData = useCallback(async () => {
    setIsLoadingToday(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/attendance/today`);
      const json = await res.json();
      if (res.ok && json.success) {
        setTodayStats(json.stats);
        setTodayLogs(json.logs || []);
      }
    } catch {
    } finally {
      setIsLoadingToday(false);
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    setIsLoadingMembers(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/attendance/members`);
      const json = await res.json();
      if (res.ok && json.success) {
        setMembers(json.data || json.members || []);
      }
    } catch {
    } finally {
      setIsLoadingMembers(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.append("date", filterDate);
      if (filterSearch) params.append("search", filterSearch);

      const res = await fetch(`${BACKEND_URL}/api/attendance/history?${params.toString()}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setHistoryLogs(json.data || json.logs || []);
      }
    } catch {
    } finally {
      setIsLoadingHistory(false);
    }
  }, [filterDate, filterSearch]);

  useEffect(() => {
    if (activeTab === "today") {
      fetchTodayData();
    } else if (activeTab === "members") {
      fetchMembers();
    } else if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab, fetchTodayData, fetchMembers, fetchHistory]);

  const handleRegisterMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterSuccess(null);
    setRegisterError(null);

    if (!name.trim()) {
      setRegisterError("Nama anggota wajib diisi.");
      return;
    }

    if (!faceData) {
      setRegisterError("Ambil sampel wajah anggota terlebih dahulu.");
      return;
    }

    setIsRegistering(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/attendance/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          memberCode: memberCode.trim() || undefined,
          department: department.trim() || undefined,
          email: email.trim() || undefined,
          faceDescriptor: faceData.descriptor,
          faceImageUrl: faceData.imageBase64,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setRegisterSuccess(`Anggota ${name} berhasil didaftarkan.`);
        setName("");
        setMemberCode("");
        setDepartment("");
        setEmail("");
        setFaceData(null);
      } else {
        setRegisterError(json.message || "Gagal mendaftarkan anggota.");
      }
    } catch {
      setRegisterError("Terjadi kesalahan sistem saat mendaftarkan.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDeleteMember = async (id: string, memberName: string) => {
    if (!confirm(`Hapus anggota "${memberName}" beserta seluruh riwayat presensinya?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`${BACKEND_URL}/api/attendance/members/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        fetchMembers();
      } else {
        alert(json.message || "Gagal menghapus anggota.");
      }
    } catch {
      alert("Terjadi kesalahan saat menghapus data anggota.");
    } finally {
      setDeletingId(null);
    }
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case "today":
        return "Presensi Hari Ini";
      case "register":
        return "Daftarkan Wajah Tim (Vermuk)";
      case "members":
        return "Data Anggota Tim";
      case "history":
        return "Riwayat & Laporan Presensi";
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50/60 text-zinc-900">
      <UserSidebarNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 px-6 sm:px-8 bg-white border-b border-zinc-200 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 font-medium">Dasbor</span>
            <span className="text-zinc-300">/</span>
            <span className="font-bold text-zinc-800">{getBreadcrumbTitle()}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/kiosk"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Buka Layar Kiosk</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </Link>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
                  {getBreadcrumbTitle()}
                </h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Kelola dan pantau presensi karyawan dengan sistem verifikasi biometrik terpusat.
                </p>
              </div>
            </div>

            {activeTab === "today" && (
              <TodaySummaryTab
                stats={todayStats}
                logs={todayLogs}
                isLoading={isLoadingToday}
                onRefresh={fetchTodayData}
              />
            )}

            {activeTab === "register" && (
              <RegisterMemberTab
                name={name}
                setName={setName}
                memberCode={memberCode}
                setMemberCode={setMemberCode}
                department={department}
                setDepartment={setDepartment}
                email={email}
                setEmail={setEmail}
                faceData={faceData}
                setFaceData={setFaceData}
                isRegistering={isRegistering}
                registerSuccess={registerSuccess}
                registerError={registerError}
                onSubmit={handleRegisterMember}
              />
            )}

            {activeTab === "members" && (
              <MembersListTab
                members={members}
                isLoading={isLoadingMembers}
                deletingId={deletingId}
                onRefresh={fetchMembers}
                onDelete={handleDeleteMember}
              />
            )}

            {activeTab === "history" && (
              <AttendanceHistoryTab
                logs={historyLogs}
                isLoading={isLoadingHistory}
                filterDate={filterDate}
                setFilterDate={setFilterDate}
                filterSearch={filterSearch}
                setFilterSearch={setFilterSearch}
                onFilter={fetchHistory}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
