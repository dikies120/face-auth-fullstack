import { UserPlus, Smartphone, LayoutDashboard, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: UserPlus,
      title: "1. Daftar Akun Pengguna",
      desc: "Buat akun pengelola dengan nama, email, dan kata sandi di formulir pendaftaran. Anda langsung diarahkan ke Dasbor Pengguna.",
      badge: "Cukup Email & Password",
    },
    {
      num: "02",
      icon: Smartphone,
      title: "2. Pasang HP di Meja Kantor",
      desc: "Salin link Kiosk (/kiosk) dari dasbor Anda, buka di browser smartphone atau tablet kantor, lalu posisikan di meja resepsionis atau pintu masuk.",
      badge: "URL Kiosk /kiosk",
    },
    {
      num: "03",
      icon: LayoutDashboard,
      title: "3. Daftarkan Wajah Tim & Pantau",
      desc: "Daftarkan wajah karyawan sekali dari dasbor. Selanjutnya, karyawan cukup berdiri di depan HP untuk absensi masuk dan pulang otomatis.",
      badge: "Real-Time di Dasbor",
    },
  ];

  return (
    <section id="cara-kerja" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-24 scroll-mt-20">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
          Alur Implementasi Cepat
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1 mb-2">
          Mulai Presensi Cerdas dalam 3 Menit
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600">
          Tanpa instalasi software rumit, tanpa teknisi khusus, dan tanpa membeli mesin tambahan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="p-6 bg-white rounded-3xl border border-zinc-200/90 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-400">{step.num}</span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 mb-2">{step.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">{step.desc}</p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                  {step.badge}
                </span>
                {idx < 2 && <ArrowRight className="w-4 h-4 text-zinc-300 hidden md:block" />}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
