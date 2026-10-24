import Link from "next/link";
import { UserPlus, ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-20">
      <div className="p-8 sm:p-12 rounded-3xl bg-orange-500 border border-orange-400 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="max-w-xl text-white">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Mulai Digitalisasi Presensi Tim Anda
          </h3>
          <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
            Daftarkan akun sekarang, masuk ke dasbor pengguna, dan pasang URL Kiosk di HP meja kantor dalam hitungan menit.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            href="/daftar"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-semibold text-orange-600 bg-white hover:bg-orange-50 shadow-xs transition-all text-center"
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar Akun Sekarang</span>
          </Link>
          <a
            href="#fitur"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-semibold text-white bg-orange-600/90 hover:bg-orange-700 border border-orange-400 transition-all text-center"
          >
            <span>Pelajari Fitur</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
