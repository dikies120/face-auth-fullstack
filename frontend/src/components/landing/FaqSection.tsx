"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      q: "Apakah pendaftaran akun di web ini memerlukan scan wajah?",
      a: "Tidak. Pendaftaran di web info ini adalah untuk membuat akun pengelola/pengguna menggunakan nama, email, dan kata sandi. Setelah masuk ke Dasbor Pengguna, Anda dapat mendaftarkan wajah anggota tim/karyawan yang akan melakukan absensi di terminal Kiosk."
    },
    {
      q: "Apakah perlu membeli kamera atau alat scanner khusus yang mahal?",
      a: "Tidak sama sekali. Sistem ini 100% berbasis browser web modern. Anda cukup membuka URL Kiosk (/kiosk) di smartphone Android, iPhone, tablet kantor, atau laptop yang ditaruh di meja presensi."
    },
    {
      q: "Kenapa Layar Kiosk dibuat terpisah dari Dasbor Pengguna?",
      a: "Layar Kiosk dirancang steril khusus untuk diletakkan di lobi atau meja kantor tanpa tombol administratif, sehingga karyawan tidak bisa mengedit atau menghapus data. Pengelola mengakses Dasbor Pengguna secara aman dari komputer masing-masing."
    },
    {
      q: "Apakah foto wajah anggota tim disimpan mentah dan rawan disalahgunakan?",
      a: "Tidak. Model kecerdasan buatan mengekstrak 128 koordinat numerik biometrik (embedding vector). Sistem mencocokkan angka matematis tersebut menggunakan jarak Euclidean, bukan menyimpan foto mentah karyawan."
    },
    {
      q: "Bagaimana jika ada karyawan yang berdiri berlama-lama di depan kamera?",
      a: "Sistem dilengkapi fitur Cooldown otomatis selama 20 detik setelah absensi berhasil dicatat, sehingga data tidak akan terinput berulang kali atau menyebabkan spam pencatatan."
    }
  ];

  return (
    <section id="faq" className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-24 scroll-mt-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 mb-3 shadow-xs">
          <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
          Pertanyaan Umum
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mb-2">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600">
          Semua hal yang perlu Anda ketahui mengenai pengoperasian sistem AutoFace.
        </p>
      </div>

      <div className="space-y-3">
        {faqItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-orange-300 transition-colors"
          >
            <button
              type="button"
              onClick={() => toggleFaq(idx)}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-zinc-800 hover:text-orange-600 transition-colors"
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform ${
                  openFaq === idx ? "rotate-180 text-orange-600" : ""
                }`}
              />
            </button>
            {openFaq === idx && (
              <div className="px-5 pb-4 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
