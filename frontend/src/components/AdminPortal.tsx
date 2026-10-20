"use client";

import { useEffect, useState, useCallback } from "react";
import {
  UserPlus,
  Users,
  CalendarCheck,
  History,
  RefreshCw,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import FaceScanner from "@/components/FaceScanner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Member {
  id: string;
  name: string;
  memberCode?: string | null;
  department?: string | null;
  email?: string | null;
  faceImageUrl?: string | null;
  createdAt: string;
  _count?: { attendances: number };
}

interface TodayStats {
  totalMembers: number;
  presentToday: number;
  inCount: number;
  outCount: number;
  lateCount: number;
  onTimeCount: number;
}

interface AttendanceLog {
  id: string;
  userId: string;
  type: "IN" | "OUT";
  status: "ON_TIME" | "LATE";
  similarityDistance: number;
  snapshotUrl?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    memberCode?: string | null;
    department?: string | null;
    faceImageUrl?: string | null;
  };
}

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState<"register" | "today" | "members" | "history">("today");

  // Registration Form State
  const [name, setName] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [faceData, setFaceData] = useState<{ descriptor: number[]; imageBase64: string } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Today Summary State
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [todayLogs, setTodayLogs] = useState<AttendanceLog[]>([]);
  const [isLoadingToday, setIsLoadingToday] = useState(false);

  // Members List State
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // History State
  const [historyLogs, setHistoryLogs] = useState<AttendanceLog[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");

  // Fetch Today's Summary
  const fetchTodayData = useCallback(async () => {
    setIsLoadingToday(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/attendance/today`);
      const json = await res.json();
      if (res.ok && json.success) {
        setTodayStats(json.stats);
        setTodayLogs(json.logs || []);
      }
    } catch (e) {
      console.error("Failed to fetch today data", e);
    } finally {
      setIsLoadingToday(false);
    }
  }, []);

  // Fetch Members List
  const fetchMembers = useCallback(async () => {
    setIsLoadingMembers(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/attendance/members`);
      const json = await res.json();
      if (res.ok && json.success) {
        setMembers(json.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch members", e);
    } finally {
      setIsLoadingMembers(false);
    }
  }, []);

  // Fetch Attendance History
  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.append("date", filterDate);
      if (filterSearch) params.append("search", filterSearch);
      if (filterDepartment && filterDepartment !== "all") params.append("department", filterDepartment);

      const res = await fetch(`${BACKEND_URL}/api/attendance/history?${params.toString()}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setHistoryLogs(json.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch history", e);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [filterDate, filterSearch, filterDepartment]);

  useEffect(() => {
    if (activeTab === "today") {
      fetchTodayData();
      const interval = setInterval(fetchTodayData, 10000); // Auto-refresh every 10 seconds
      return () => clearInterval(interval);
    } else if (activeTab === "members") {
      fetchMembers();
    } else if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab, fetchTodayData, fetchMembers, fetchHistory]);

  // Handle Register Member
  const handleRegisterMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setRegisterSuccess(null);

    if (!name.trim()) {
      setRegisterError("Nama anggota wajib diisi.");
      return;
    }

    if (!faceData) {
      setRegisterError("Silakan lakukan verifikasi wajah (vermuk) menggunakan kamera.");
      return;
    }

    setIsRegistering(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/attendance/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        setRegisterSuccess(`Anggota "${name}" berhasil didaftarkan ke sistem presensi!`);
        setName("");
        setMemberCode("");
        setDepartment("");
        setEmail("");
        setFaceData(null);
      } else {
        setRegisterError(json.message || "Gagal mendaftarkan anggota.");
      }
    } catch {
      setRegisterError("Gagal menghubungi server backend.");
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle Delete Member
  const handleDeleteMember = async (id: string, memberName: string) => {
    if (!confirm(`Yakin ingin menghapus data anggota "${memberName}"? Semua data presensinya juga akan terhapus.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`${BACKEND_URL}/api/attendance/members/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(json.message || "Gagal menghapus anggota.");
      }
    } catch {
      alert("Terjadi kesalahan saat menghapus data.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6">
      {/* Admin Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("today")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "today"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <CalendarCheck className="w-4 h-4" /> Presensi Hari Ini
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "register"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <UserPlus className="w-4 h-4" /> Daftarkan Wajah (Vermuk)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "members"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Users className="w-4 h-4" /> Data Anggota
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "history"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <History className="w-4 h-4" /> Riwayat & Laporan
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Admin Portal Aktif</span>
        </div>
      </div>

      {/* TAB 1: REKAP HARI INI */}
      {activeTab === "today" && (
        <div className="flex flex-col gap-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-medium">Total Anggota</span>
              <span className="text-2xl font-bold text-white font-mono">
                {todayStats ? todayStats.totalMembers : 0}
              </span>
              <span className="text-[11px] text-slate-500">Terdaftar di database</span>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-medium">Hadir Hari Ini</span>
              <span className="text-2xl font-bold text-sky-400 font-mono">
                {todayStats ? todayStats.presentToday : 0}
              </span>
              <span className="text-[11px] text-sky-500/80">
                {todayStats && todayStats.totalMembers > 0
                  ? `${Math.round((todayStats.presentToday / todayStats.totalMembers) * 100)}% kehadiran`
                  : "0%"}
              </span>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-medium">Tepat Waktu</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">
                {todayStats ? todayStats.onTimeCount : 0}
              </span>
              <span className="text-[11px] text-emerald-500/80">Sebelum 08:30 WIB</span>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col gap-1">
              <span className="text-xs text-slate-400 font-medium">Terlambat</span>
              <span className="text-2xl font-bold text-amber-400 font-mono">
                {todayStats ? todayStats.lateCount : 0}
              </span>
              <span className="text-[11px] text-amber-500/80">Setelah 08:30 WIB</span>
            </div>
          </div>

          {/* Today Attendance Log Table */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Log Presensi Hari Ini</h3>
                <p className="text-xs text-slate-400">Pembaruan otomatis real-time dari Kiosk</p>
              </div>

              <button
                type="button"
                onClick={fetchTodayData}
                disabled={isLoadingToday}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingToday ? "animate-spin text-sky-400" : ""}`} />
                Segarkan
              </button>
            </div>

            {todayLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm flex flex-col items-center gap-2">
                <Clock className="w-8 h-8 text-slate-600" />
                Belum ada data presensi hari ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Waktu</th>
                      <th className="py-3 px-4">Foto Bukti</th>
                      <th className="py-3 px-4">Nama & ID</th>
                      <th className="py-3 px-4">Departemen</th>
                      <th className="py-3 px-4">Jenis</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Skor Wajah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {todayLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono text-white font-semibold whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                            <img
                              src={log.snapshotUrl || log.user.faceImageUrl || "/placeholder-avatar.png"}
                              alt={log.user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-white text-sm">{log.user.name}</div>
                          {log.user.memberCode && (
                            <div className="text-[11px] text-slate-400 font-mono">ID: {log.user.memberCode}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                          {log.user.department || "-"}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {log.type === "IN" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <ArrowUpRight className="w-3 h-3" /> MASUK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                              <ArrowDownRight className="w-3 h-3" /> PULANG
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                              log.status === "ON_TIME"
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800/80"
                                : "bg-amber-950 text-amber-300 border border-amber-800/80"
                            }`}
                          >
                            {log.status === "ON_TIME" ? "Tepat Waktu" : "Terlambat"}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-400">
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
      )}

      {/* TAB 2: DAFTARKAN WAJAH (VERMUK) */}
      {activeTab === "register" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          {/* Sisi Kiri: Scanner Kamera Biometrik */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-full flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Pengambilan Vektor Wajah (128-D)
              </span>
              <span className="text-[11px] text-slate-400">Pastikan wajah terlihat jelas</span>
            </div>

            <FaceScanner
              onFaceCaptured={(data) => {
                setFaceData(data);
                setRegisterError(null);
              }}
              isProcessing={isRegistering}
            />

            {faceData && (
              <div className="w-full flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Vektor 128 dimensi & foto wajah berhasil terekstraksi.
              </div>
            )}
          </div>

          {/* Sisi Kanan: Form Data Anggota */}
          <form onSubmit={handleRegisterMember} className="flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Data Anggota Baru</h3>
              <p className="text-xs text-slate-400 mb-4">
                Wajah yang didaftarkan akan tersimpan sebagai acuan saat absensi di Kiosk.
              </p>

              {registerSuccess && (
                <div className="mb-4 p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {registerSuccess}
                </div>
              )}

              {registerError && (
                <div className="mb-4 p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  {registerError}
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nama Lengkap <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nomor Induk / ID / NIM / NIK
                  </label>
                  <input
                    type="text"
                    value={memberCode}
                    onChange={(e) => setMemberCode(e.target.value)}
                    placeholder="Contoh: EMP-0012 atau 22010199"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Divisi / Departemen / Kelas
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Contoh: IT Development / HR / Kelas 12"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="budi@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isRegistering || !faceData || !name.trim()}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isRegistering ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Mendaftarkan ke Database...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Simpan & Daftarkan Wajah
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: DATA ANGGOTA */}
      {activeTab === "members" && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Daftar Anggota Terdaftar</h3>
              <p className="text-xs text-slate-400">Total {members.length} anggota dengan verifikasi wajah aktif</p>
            </div>

            <button
              type="button"
              onClick={fetchMembers}
              disabled={isLoadingMembers}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMembers ? "animate-spin text-sky-400" : ""}`} />
              Segarkan
            </button>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm flex flex-col items-center gap-2">
              <Users className="w-8 h-8 text-slate-600" />
              Belum ada anggota terdaftar. Buka tab &quot;Daftarkan Wajah&quot; untuk menambahkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
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
                <tbody className="divide-y divide-slate-800/60">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                          <img
                            src={m.faceImageUrl || "/placeholder-avatar.png"}
                            alt={m.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-white text-sm whitespace-nowrap">{m.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">{m.memberCode || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{m.department || "-"}</td>
                      <td className="py-3 px-4 font-mono text-sky-400 font-bold whitespace-nowrap">
                        {m._count?.attendances || 0}x
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDeleteMember(m.id, m.name)}
                          disabled={deletingId === m.id}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded-lg transition-colors"
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
      )}

      {/* TAB 4: RIWAYAT & LAPORAN */}
      {activeTab === "history" && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Riwayat Presensi Lengkap</h3>
              <p className="text-xs text-slate-400">Pencarian dan filter data presensi</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500"
              />

              <input
                type="text"
                placeholder="Cari nama / ID..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />

              <button
                type="button"
                onClick={fetchHistory}
                disabled={isLoadingHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-colors"
              >
                <Search className="w-3.5 h-3.5" /> Filter
              </button>
            </div>
          </div>

          {historyLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm flex flex-col items-center gap-2">
              <History className="w-8 h-8 text-slate-600" />
              Tidak ada rekaman data presensi untuk filter ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tanggal & Jam</th>
                    <th className="py-3 px-4">Nama & ID</th>
                    <th className="py-3 px-4">Departemen</th>
                    <th className="py-3 px-4">Jenis</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Skor Kecocokan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {historyLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-white whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-white text-sm">{log.user.name}</div>
                        {log.user.memberCode && (
                          <div className="text-[11px] text-slate-400 font-mono">ID: {log.user.memberCode}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{log.user.department || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {log.type === "IN" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <ArrowUpRight className="w-3 h-3" /> MASUK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                            <ArrowDownRight className="w-3 h-3" /> PULANG
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                            log.status === "ON_TIME"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800/80"
                              : "bg-amber-950 text-amber-300 border border-amber-800/80"
                          }`}
                        >
                          {log.status === "ON_TIME" ? "Tepat Waktu" : "Terlambat"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {Math.round((1 - log.similarityDistance) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
