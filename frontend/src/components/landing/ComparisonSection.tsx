import { Check, X, Sparkles } from "lucide-react";

export default function ComparisonSection() {
  const comparisons = [
    {
      feature: "Biaya Pengadaan Alat",
      autoface: "Rp 0 (Gunakan HP / Tablet yang ada)",
      fingerprint: "Rp 2.500.000 - Rp 7.000.000",
      rfid: "Rp 1.500.000 + Biaya cetak kartu",
    },
    {
      feature: "Higienitas & Kebersihan",
      autoface: "100% Bebas Sentuhan (Touchless)",
      fingerprint: "Sensor fisik sering kotor & kuman",
      rfid: "Kartu sering dipegang & hilang",
    },
    {
      feature: "Risiko Titip Absen",
      autoface: "Nol (Verifikasi Biometrik Wajah Asli)",
      fingerprint: "Rendah, tapi sering gagal jika jari basah",
      rfid: "Sangat Tinggi (Bisa titip kartu)",
    },
    {
      feature: "Kecepatan Pemindaian",
      autoface: "< 0.3 Detik per orang",
      fingerprint: "2 - 5 Detik per orang (Sering antre)",
      rfid: "1 - 2 Detik per orang",
    },
    {
      feature: "Akses Data Kehadiran",
      autoface: "Real-time via Dasbor Web & PostgreSQL",
      fingerprint: "Manual colok flashdisk / kabel LAN",
      rfid: "Perlu server lokal khusus",
    },
    {
      feature: "Pemasangan & Instalasi",
      autoface: "Siap dalam 3 menit di browser web",
      fingerprint: "Harus pasang bor & teknisi listrik",
      rfid: "Konfigurasi reader & jaringan rumit",
    },
  ];

  return (
    <section id="perbandingan" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-24 scroll-mt-20">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
          Analisis Efisiensi
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1 mb-2">
          Mengapa AutoFace Lebih Unggul?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600">
          Perbandingan langsung sistem presensi web kami dengan mesin absensi konvensional.
        </p>
      </div>

      <div className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="py-4 px-5 font-semibold text-zinc-600 w-1/4">Parameter</th>
                <th className="py-4 px-5 font-bold text-orange-700 bg-orange-50/70 w-1/3 border-x border-orange-200/70">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span>AutoFace Web Kiosk</span>
                  </div>
                </th>
                <th className="py-4 px-5 font-semibold text-zinc-600 w-1/5">Mesin Sidik Jari</th>
                <th className="py-4 px-5 font-semibold text-zinc-600 w-1/5">Kartu RFID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {comparisons.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-zinc-900">{item.feature}</td>
                  <td className="py-3.5 px-5 font-semibold text-zinc-900 bg-orange-50/30 border-x border-orange-200/40">
                    <div className="flex items-center gap-2 text-orange-900">
                      <Check className="w-4 h-4 text-orange-600 shrink-0" />
                      <span>{item.autoface}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-zinc-600">
                    <div className="flex items-center gap-2">
                      <X className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{item.fingerprint}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-zinc-600">
                    <div className="flex items-center gap-2">
                      <X className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{item.rfid}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
