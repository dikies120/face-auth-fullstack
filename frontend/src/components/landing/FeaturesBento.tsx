import { Cpu, Camera, ShieldCheck, Clock, Activity, Database, Check } from "lucide-react";

export default function FeaturesBento() {
  return (
    <section id="fitur" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-24 scroll-mt-20">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
          Fitur &amp; Keandalan Sistem
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1 mb-2">
          Teknologi Canggih untuk Efisiensi Presensi
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600">
          Dirancang untuk kantor startup, instansi pemerintah, pabrik, dan sekolah yang membutuhkan absensi cepat, akurat, dan anti-curang.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 p-7 bg-white rounded-3xl border border-zinc-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200 mb-4">
              <Camera className="w-3.5 h-3.5 text-orange-600" />
              100% Bebas Sentuhan (Touchless)
            </div>

            <h3 className="text-xl font-bold text-zinc-900 mb-3">
              Scan Instan Kurang dari 0.3 Detik saat Karyawan Melintas
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-6">
              Tidak ada antrean panjang di pagi hari. Karyawan cukup berdiri di jarak 40-80 cm dari kamera HP atau tablet. Algoritma biometrik memproses wajah secara instan dan mencatat jam masuk secara akurat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-100">
            <div className="flex items-center gap-2 text-xs text-zinc-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Higienis tanpa kuman</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sensor basah bukan kendala</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-700">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bebas antre pagi hari</span>
            </div>
          </div>
        </div>

        <div className="p-7 bg-white rounded-3xl border border-zinc-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mb-4 shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 mb-2">Vektor Biometrik 128-D</h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-4">
              Wajah dikonversi menjadi 128 angka koordinat matematis. Foto mentah tidak disimpan, sehingga privasi anggota tim terjaga 100%.
            </p>
          </div>
          <div className="text-[11px] font-mono text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 inline-block w-fit">
            Euclidean Distance &lt; 0.5
          </div>
        </div>

        <div className="p-7 bg-white rounded-3xl border border-zinc-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mb-4 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 mb-2">Anti-Duplikasi Wajah</h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-4">
              Pendaftaran anggota memeriksa seluruh database. Wajah yang sama tidak dapat didaftarkan pada dua nama berbeda.
            </p>
          </div>
          <div className="text-[11px] font-mono text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 inline-block w-fit">
            1 Wajah = 1 Akun Valid
          </div>
        </div>

        <div className="p-7 bg-white rounded-3xl border border-zinc-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mb-4 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 mb-2">Proteksi Cooldown 20 Detik</h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-4">
              Jeda cerdas setelah scan sukses mencegah data terinput berulang kali jika karyawan berdiri berlama-lama di depan kamera.
            </p>
          </div>
          <div className="text-[11px] font-mono text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 inline-block w-fit">
            Anti-Multi Scan Spam
          </div>
        </div>

        <div className="p-7 bg-white rounded-3xl border border-zinc-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mb-4 shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 mb-2">Auto Late Classifier</h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-4">
              Sistem otomatis mengelompokkan kehadiran sebagai Tepat Waktu atau Terlambat berdasarkan batas jam operasional.
            </p>
          </div>
          <div className="text-[11px] font-mono text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 inline-block w-fit">
            Real-Time Klasifikasi
          </div>
        </div>
      </div>
    </section>
  );
}
