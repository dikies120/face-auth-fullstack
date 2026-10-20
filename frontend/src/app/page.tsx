import Link from "next/link";
import {
  ScanFace,
  Scan,
  Shield,
  ArrowRight,
  Cpu,
  ShieldCheck,
  Database,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 bg-[#070b14] overflow-hidden text-slate-100">
      {/* Background Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-sky-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />

      {/* Main Header */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <ScanFace className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              AutoFace <span className="text-[10px] font-mono uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">Attendance AI</span>
            </h1>
            <p className="text-xs text-slate-400">Sistem Presensi Wajah Terdistribusi (User Kiosk & Admin)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 rounded-full border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Backend Port 5000 Online
          </div>
        </div>
      </header>

      {/* Center Gateway Selection */}
      <section className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl my-10">
        <div className="text-center max-w-xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Pilih Akses Portal
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Sistem Presensi Biometrik Wajah
          </h2>
          <p className="text-sm text-slate-400">
            Aplikasi terbagi menjadi dua alamat URL independen: layar kiosk untuk karyawan/siswa dan portal manajemen untuk admin.
          </p>
        </div>

        {/* 2 Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Card 1: Kiosk Mesin Absen User */}
          <Link
            href="/kiosk"
            className="group relative p-7 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-3xl backdrop-blur-md transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all pointer-events-none" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25 mb-6 group-hover:scale-105 transition-transform">
                <Scan className="w-7 h-7 text-white" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  URL: /kiosk
                </span>
                <span className="text-xs text-slate-500">• Khusus User</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                Kiosk Mesin Absensi
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Layar standby kamera untuk dipasang di lobi atau meja presensi. Pengguna cukup berdiri menatap kamera — sistem otomatis mendeteksi wajah dan mencatat Absen Masuk (IN) / Pulang (OUT).
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 group-hover:text-sky-300 group-hover:translate-x-1 transition-all">
              <span>Buka Layar Mesin Kiosk</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Portal Admin */}
          <Link
            href="/admin"
            className="group relative p-7 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl backdrop-blur-md transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-6 group-hover:scale-105 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  URL: /admin
                </span>
                <span className="text-xs text-slate-500">• Khusus Admin</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                Portal Administrator
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Panel pengelolaan: Daftarkan verifikasi muka (Vermuk) anggota baru, pantau rekapitulasi kehadiran hari ini secara real-time, kelola data master anggota, dan unduh riwayat presensi.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all">
              <span>Buka Portal Admin</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* Feature Badges Footer */}
      <footer className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
          <Cpu className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <div className="font-semibold text-slate-200">Terpisah & Mandiri</div>
            <div className="text-[11px] text-slate-500">Kiosk bebas gangguan menu admin</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold text-slate-200">Anti-Duplikasi Wajah</div>
            <div className="text-[11px] text-slate-500">Mencegah satu orang punya 2 akun</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
          <Database className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <div className="font-semibold text-slate-200">PostgreSQL + Prisma</div>
            <div className="text-[11px] text-slate-500">Data tersimpan aman di database</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
