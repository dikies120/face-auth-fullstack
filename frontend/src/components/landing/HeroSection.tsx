import Link from "next/link";
import { UserPlus, ArrowRight, ShieldCheck, Zap, Database, Smartphone } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative z-10 pt-14 pb-16 sm:pt-20 sm:pb-24 max-w-5xl mx-auto px-4 sm:px-6 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-50 border border-orange-200 text-orange-800 mb-6 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span>Sistem Presensi Biometrik Wajah Bebas Sentuhan</span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 max-w-4xl mx-auto leading-[1.14] mb-6">
        Absensi Wajah Kantor &amp; Sekolah. <br />
        <span className="text-orange-600">
          Cukup Kamera HP, Tanpa Mesin Mahal.
        </span>
      </h1>

      <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed mb-9">
        Ubah smartphone atau tablet bekas kantor menjadi terminal presensi otomatis. Karyawan cukup berdiri di depan kamera, absensi tercatat dalam 0.3 detik, dan pimpinan dapat memantau kehadiran secara real-time dari dasbor terpusat.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
        <Link
          href="/daftar"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>Daftar Akun Pengguna</span>
        </Link>

        <a
          href="#arsitektur"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-zinc-800 bg-white hover:bg-orange-50/60 border border-zinc-200 hover:border-orange-300 transition"
        >
          <span>Pelajari Cara Kerja</span>
          <ArrowRight className="w-4 h-4 text-orange-600" />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 max-w-4xl mx-auto text-left">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100/80 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900">Rp 0 Biaya Alat</div>
            <div className="text-[11px] text-zinc-500">Gunakan HP / tablet kantor</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100/80 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900">&lt; 0.3 Detik</div>
            <div className="text-[11px] text-zinc-500">Scan instan bebas antre</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100/80 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900">Vektor 128-D</div>
            <div className="text-[11px] text-zinc-500">Privasi aman tanpa foto mentah</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100/80 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900">PostgreSQL Cloud</div>
            <div className="text-[11px] text-zinc-500">Data rekap terpusat &amp; aman</div>
          </div>
        </div>
      </div>
    </section>
  );
}
