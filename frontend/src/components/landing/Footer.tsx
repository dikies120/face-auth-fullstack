import Link from "next/link";
import { ScanFace } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-zinc-200 bg-zinc-50/80 py-10 text-xs text-zinc-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold shadow-xs">
            <ScanFace className="w-3.5 h-3.5" />
          </div>
          <span className="text-zinc-800 font-semibold">AutoFace Biometric Attendance</span>
          <span>• Node.js &amp; PostgreSQL Engine</span>
        </div>

        <div className="flex items-center gap-5 font-medium">
          <a href="#fitur" className="hover:text-orange-600 transition-colors">Fitur</a>
          <a href="#arsitektur" className="hover:text-orange-600 transition-colors">Arsitektur</a>
          <a href="#perbandingan" className="hover:text-orange-600 transition-colors">Perbandingan</a>
          <a href="#faq" className="hover:text-orange-600 transition-colors">FAQ</a>
          <Link href="/daftar" className="hover:text-orange-600 transition-colors">Daftar Akun</Link>
          <Link href="/login" className="hover:text-orange-600 transition-colors">Masuk</Link>
        </div>
      </div>
    </footer>
  );
}
