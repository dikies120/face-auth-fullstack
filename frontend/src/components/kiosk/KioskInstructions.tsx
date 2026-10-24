export default function KioskInstructions() {
  return (
    <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs text-zinc-600">
      <div className="p-3.5 bg-white rounded-2xl border border-zinc-200/90 shadow-xs flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold text-xs shrink-0">
          1
        </div>
        <span>Posisikan wajah Anda tegak menghadap kamera</span>
      </div>
      <div className="p-3.5 bg-white rounded-2xl border border-zinc-200/90 shadow-xs flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold text-xs shrink-0">
          2
        </div>
        <span>Sistem otomatis mendeteksi tanpa perlu klik tombol</span>
      </div>
      <div className="p-3.5 bg-white rounded-2xl border border-zinc-200/90 shadow-xs flex items-center gap-3">
        <div className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold text-xs shrink-0">
          3
        </div>
        <span>Absen Masuk (IN) / Pulang (OUT) tercatat seketika</span>
      </div>
    </div>
  );
}
