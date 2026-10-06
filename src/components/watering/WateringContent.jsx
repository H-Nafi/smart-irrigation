"use client";

import { useWatering } from "@/context/WateringContext";
import { FaTint, FaPlay, FaStop, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function WateringContent() {
  const {
    pumpStatus,
    timerMode,
    selectedDuration,
    setSelectedDuration,
    countdown,
    timerRunning,
    loading,
    startManual,
    stopManual,
    startTimer,
    formatCountdown,
  } = useWatering();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-16">
      {/* HEADER */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-black text-white tracking-tight">
            <span className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-2xl border border-emerald-500/30">💦</span>
            Kontrol Penyiraman Irigasi
          </h1>
          <p className="mt-1 text-xs md:text-sm text-slate-400 font-medium">
            Kelola aktivitas pompa air secara manual atau otomatis menggunakan timer penyiraman presisi.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
          <FaCheckCircle className="text-emerald-400 text-sm" />
          <span className="text-xs font-bold text-emerald-300">Tersinkronisasi dengan Dashboard</span>
        </div>
      </div>

      {/* STATUS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PUMP STATUS CARD */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Status Pompa Air
              </p>
              <h2
                className={`mt-2 text-3xl sm:text-4xl font-black tracking-tight ${
                  pumpStatus ? "text-emerald-400" : "text-slate-500"
                }`}
              >
                {pumpStatus ? "ON (MENYIRAM)" : "OFF (MATI)"}
              </h2>
            </div>

            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all border ${
                pumpStatus
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/20 animate-pulse"
                  : "bg-slate-950 text-slate-600 border-slate-800"
              }`}
            >
              <FaTint className="text-3xl" />
            </div>
          </div>

          <div className="mt-6">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${
                pumpStatus
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-slate-950 text-slate-400 border-slate-800"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  pumpStatus ? "bg-emerald-400 animate-ping" : "bg-slate-600"
                }`}
              />
              {pumpStatus
                ? "Pompa penyiraman sedang aktif mengalirkan air"
                : "Pompa penyiraman sedang nonaktif"}
            </span>
          </div>
        </div>

        {/* CURRENT WATERING MODE & STATUS */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Status Penyiraman Saat Ini
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                {pumpStatus
                  ? timerRunning
                    ? "Penyiraman dengan Timer"
                    : "Penyiraman Manual"
                  : "Tidak Menyiram"}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <FaClock className="text-2xl" />
            </div>
          </div>

          <div className="mt-6 text-xs text-slate-400 space-y-1 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            <p>
              <span className="font-semibold text-slate-300">Mode Aktif:</span>{" "}
              {timerMode === "timer" ? "Timer Otomatis" : "Manual Direct Control"}
            </p>
            <p>
              <span className="font-semibold text-slate-300">Durasi Terpilih:</span>{" "}
              {selectedDuration} Menit
            </p>
          </div>
        </div>
      </div>

      {/* CONTROLS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MANUAL CONTROL CARD */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Kontrol Manual Pompa</h2>
            <p className="text-xs text-slate-400 mt-1">
              Nyalakan atau matikan pompa penyiraman secara langsung tanpa timer.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              onClick={startManual}
              disabled={loading || pumpStatus}
              className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 transition cursor-pointer"
            >
              <FaPlay className="text-xs" />
              <span>START MANUAL</span>
            </button>

            <button
              onClick={stopManual}
              disabled={loading || !pumpStatus}
              className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-rose-600/30 transition cursor-pointer"
            >
              <FaStop className="text-xs" />
              <span>STOP POMPA</span>
            </button>
          </div>
        </div>

        {/* TIMER CONTROL CARD */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Timer Penyiraman Otomatis</h2>
            <p className="text-xs text-slate-400 mt-1">
              Atur durasi penyiraman. Pompa akan mati otomatis setelah countdown selesai.
            </p>
          </div>

          {/* DURATION SELECTOR */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Pilih Durasi Penyiraman
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 30].map((item) => (
                <button
                  key={item}
                  disabled={timerRunning}
                  onClick={() => setSelectedDuration(item)}
                  className={`py-3 rounded-2xl font-bold text-xs transition cursor-pointer border ${
                    selectedDuration === item
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-md shadow-emerald-500/10"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
                  } disabled:opacity-50`}
                >
                  {item} Menit
                </button>
              ))}
            </div>
          </div>

          {/* COUNTDOWN DISPLAY */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Countdown Timer (Tersinkron)
            </p>
            <h2 className="text-4xl md:text-5xl font-mono font-black text-emerald-300 mt-2">
              {timerRunning ? formatCountdown(countdown) : "00:00"}
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">
              {timerRunning
                ? "Pompa akan berhenti secara otomatis saat hitungan habis."
                : "Tekan tombol di bawah untuk memulai timer."}
            </p>
          </div>

          {/* TIMER BUTTONS */}
          <div>
            {!timerRunning ? (
              <button
                onClick={() => startTimer(selectedDuration)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer disabled:opacity-40"
              >
                <FaPlay className="text-xs" />
                <span>MULAI TIMER ({selectedDuration} MENIT)</span>
              </button>
            ) : (
              <button
                onClick={stopManual}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                <FaStop className="text-xs" />
                <span>BATALKAN & MATIKAN POMPA</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}