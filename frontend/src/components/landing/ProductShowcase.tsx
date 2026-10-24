import { Smartphone, LayoutDashboard, CheckCircle2, ScanFace, CalendarCheck, UserPlus, Users, History, Copy, Clock } from "lucide-react";

export default function ProductShowcase() {
  return (
    <section id="arsitektur" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-24 scroll-mt-20">
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
            Arsitektur Terdistribusi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1 mb-2">
            Dua Antarmuka Khusus untuk Keamanan &amp; Kemudahan
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            Layar Kiosk di meja presensi dan Dasbor Pengguna di laptop terpisah secara terisolasi demi mencegah manipulasi data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 p-5 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-wide">
                  <Smartphone className="w-4 h-4 text-orange-600" />
                  <span>1. Layar Kiosk di Meja Lobi</span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-orange-100/70 text-orange-700">
                  URL /kiosk
                </span>
              </div>

              <div className="bg-white rounded-xl border border-zinc-200 p-3 shadow-xs mb-3">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 text-[11px]">
                  <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-orange-600" /> 08:14:22 WIB
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Kamera Siap 24/7
                  </span>
                </div>

                <div className="aspect-[4/3] rounded-lg bg-zinc-900 relative overflow-hidden flex flex-col items-center justify-center p-3 text-center border border-zinc-800">
                  <div className="w-24 h-28 rounded-2xl border-2 border-dashed border-orange-500/70 flex flex-col items-center justify-center relative">
                    <ScanFace className="w-10 h-10 text-orange-400 animate-pulse" />
                    <span className="text-[9px] text-orange-200 mt-1 font-mono">Deteksi Wajah</span>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 bg-white/95 rounded-lg p-2 border border-emerald-300 flex items-center gap-2 shadow-xs text-left">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-zinc-900 truncate">Budi Santoso</div>
                      <div className="text-[9px] text-emerald-700 font-semibold truncate">
                        Masuk • 08:14 WIB (Tepat Waktu)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 text-center">
              Ditaruh di meja kantor pada smartphone/tablet. Karyawan cukup lewat di depan kamera tanpa menyentuh layar.
            </p>
          </div>

          <div className="lg:col-span-7 p-5 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 uppercase tracking-wide">
                  <LayoutDashboard className="w-4 h-4 text-orange-600" />
                  <span>2. Dasbor Web Pengguna</span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-200/80 text-zinc-700">
                  URL /dashboard
                </span>
              </div>

              <div className="bg-white rounded-xl border border-zinc-200 p-3.5 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
                      A
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Dasbor PT Maju Sejahtera</div>
                      <div className="text-[10px] text-zinc-500">Panel Pengelola Tim</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-1 rounded-lg">
                    <Copy className="w-3 h-3" />
                    Salin URL Kiosk
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100 text-center">
                    <div className="text-[10px] text-zinc-500">Hadir Hari Ini</div>
                    <div className="text-sm font-bold text-orange-600 font-mono">24 / 25</div>
                  </div>
                  <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100 text-center">
                    <div className="text-[10px] text-zinc-500">Tepat Waktu</div>
                    <div className="text-sm font-bold text-emerald-600 font-mono">22</div>
                  </div>
                  <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100 text-center">
                    <div className="text-[10px] text-zinc-500">Terlambat</div>
                    <div className="text-sm font-bold text-amber-600 font-mono">2</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1 text-[10px] text-zinc-600 border-t border-zinc-100 overflow-x-auto">
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-700 font-semibold rounded border border-orange-200 flex items-center gap-1 shrink-0">
                    <CalendarCheck className="w-3 h-3" /> Presensi Hari Ini
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-50 text-zinc-600 rounded border border-zinc-200 flex items-center gap-1 shrink-0">
                    <UserPlus className="w-3 h-3" /> Daftarkan Wajah Tim
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-50 text-zinc-600 rounded border border-zinc-200 flex items-center gap-1 shrink-0">
                    <Users className="w-3 h-3" /> Data Anggota
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-50 text-zinc-600 rounded border border-zinc-200 flex items-center gap-1 shrink-0">
                    <History className="w-3 h-3" /> Riwayat
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 text-center mt-3">
              Dibuka oleh pengelola di laptop untuk mendaftarkan wajah tim, melihat rekap kehadiran, dan menyalin link kiosk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
