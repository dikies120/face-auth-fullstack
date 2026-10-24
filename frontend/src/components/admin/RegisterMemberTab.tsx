import { Sparkles, CheckCircle2, AlertTriangle, UserPlus, RefreshCw } from "lucide-react";
import FaceScanner from "@/components/scanner/FaceScanner";

interface RegisterMemberTabProps {
  name: string;
  setName: (v: string) => void;
  memberCode: string;
  setMemberCode: (v: string) => void;
  department: string;
  setDepartment: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  faceData: { descriptor: number[]; imageBase64: string } | null;
  setFaceData: (data: { descriptor: number[]; imageBase64: string } | null) => void;
  isRegistering: boolean;
  registerSuccess: string | null;
  registerError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterMemberTab({
  name,
  setName,
  memberCode,
  setMemberCode,
  department,
  setDepartment,
  email,
  setEmail,
  faceData,
  setFaceData,
  isRegistering,
  registerSuccess,
  registerError,
  onSubmit,
}: RegisterMemberTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-full flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-orange-600 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Pengambilan Vektor Wajah (128-D)
          </span>
          <span className="text-[11px] text-zinc-400">Pastikan pencahayaan cukup</span>
        </div>

        <FaceScanner
          onFaceCaptured={(data) => {
            setFaceData(data);
          }}
          isProcessing={isRegistering}
        />

        {faceData && (
          <div className="w-full flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Vektor 128 dimensi &amp; foto wajah berhasil diekstrak.
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">Data Anggota Baru</h3>
          <p className="text-xs text-zinc-500 mb-4">
            Wajah yang didaftarkan akan tersimpan sebagai acuan saat absensi di Kiosk.
          </p>

          {registerSuccess && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {registerSuccess}
            </div>
          )}

          {registerError && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              {registerError}
            </div>
          )}

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Nomor Induk / ID / NIM / NIK
              </label>
              <input
                type="text"
                value={memberCode}
                onChange={(e) => setMemberCode(e.target.value)}
                placeholder="Contoh: EMP-0012 atau 22010199"
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Divisi / Departemen / Kelas
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Contoh: IT Development / HR / Kelas 12"
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Email (Opsional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isRegistering || !faceData || !name.trim()}
          className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
        >
          {isRegistering ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Mendaftarkan ke Database...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Simpan &amp; Daftarkan Wajah
            </>
          )}
        </button>
      </form>
    </div>
  );
}
