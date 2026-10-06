"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import StatCard from "./StatCard";
import WaterLevelChart from "../charts/WaterLevelChart";
import WaterTank from "../tank/WaterTank";
import { useWatering } from "@/context/WateringContext";
import { FaPlay, FaStop, FaClock, FaTint, FaArrowRight, FaChartLine } from "react-icons/fa";
import Link from "next/link";

export default function DashboardContent() {
  const {
    pumpStatus,
    deviceOnline,
    waterLevel,
    todayConsumption,
    weekConsumption,
    realtimeHistory,
    timerMode,
    selectedDuration,
    countdown,
    timerRunning,
    loading,
    startManual,
    stopManual,
    startTimer,
    setSelectedDuration,
    formatCountdown,
  } = useWatering();

  const [dbHistory, setDbHistory] = useState([]);
  const [chartMode, setChartMode] = useState("realtime");
  const [filterHour, setFilterHour] = useState(1);

  useEffect(() => {
    if (chartMode !== "history") return;
    async function loadHistory() {
      try {
        const res = await fetch(`/api/water-level?hours=${filterHour}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const chartData = data.map((item) => ({
            time: new Date(item.recorded_at).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            level: item.percentage,
          }));
          setDbHistory(chartData);
        }
      } catch (error) {
        console.error("Gagal load history chart:", error);
      }
    }
    loadHistory();
  }, [filterHour, chartMode]);

  const tableHistory = chartMode === "realtime" ? realtimeHistory : dbHistory;

  return (
    <div className="flex-1 bg-slate-950 min-h-screen text-slate-100 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* ===== TOP WELCOME & QUICK ACTIONS ===== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Sistem Penyiraman Otomatis</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Ringkasan Sistem Irigasi 🌾
            </h2>
            <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">
              Pantau kondisi air, aktivitas pompa, dan penggunaan air secara real-time.
            </p>
          </div>

          <Link
            href="/watering"
            className="relative z-10 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition cursor-pointer self-start md:self-auto"
          >
            <span>KONTROL PENYIRAMAN</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {/* ===== STAT CARDS GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Water Level"
            value={`${waterLevel.toFixed(1)}%`}
            subtitle="Level Air Saat Ini"
            progress={waterLevel}
            color="bg-gradient-to-tr from-cyan-500 to-emerald-400"
          />

          <StatCard
            title="Water Consumption"
            value={`${Number(todayConsumption ?? 0).toFixed(2)} L`}
            subtitle="Konsumsi Hari Ini"
            footer={`Total Minggu Ini : ${Number(weekConsumption ?? 0).toFixed(2)} L`}
            color="bg-gradient-to-tr from-teal-500 to-emerald-400"
          />

          <StatCard
            title="Device Status"
            value={deviceOnline ? "Online" : "Offline"}
            subtitle={deviceOnline ? "ESP32 Terhubung ke HiveMQ" : "ESP32 Tidak Terhubung"}
            badge={deviceOnline ? "🟢 Terhubung" : "🔴 Offline"}
            badgeColor={deviceOnline ? "green" : "red"}
            color={deviceOnline ? "bg-gradient-to-tr from-emerald-500 to-teal-400" : "bg-gradient-to-tr from-rose-500 to-pink-500"}
          />

          <StatCard
            title="Pump Status"
            value={pumpStatus ? "ON" : "OFF"}
            subtitle="Status Pompa Saat Ini"
            badge={pumpStatus ? "🟢 Aktif (Menyiram)" : "🔴 Nonaktif"}
            badgeColor={pumpStatus ? "green" : "red"}
            color={pumpStatus ? "bg-gradient-to-tr from-emerald-500 to-teal-400" : "bg-gradient-to-tr from-slate-700 to-slate-800"}
          />
        </div>

        {/* ===== KONTROL PENYIRAMAN (MANUAL & TIMER) ON DASHBOARD ===== */}
        <div className="bg-slate-900/90 rounded-3xl p-6 md:p-8 border border-slate-800/90 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
                <FaTint className="text-emerald-400" />
                <span>Panel Kontrol Pompa</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Aktivitas Penyiraman & Manual Override
              </h3>
              <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">
                Kendalikan status pompa secara manual atau atur timer penyiraman presisi.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold border ${pumpStatus
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-md shadow-emerald-500/10"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${pumpStatus ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
                {pumpStatus ? (timerRunning ? "Menyiram (Timer)" : "Menyiram (Manual)") : "Pompa Nonaktif"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* MANUAL CONTROL BUTTONS */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                💦 Penyiraman Manual
              </p>
              <div className="flex gap-3">
                <button
                  onClick={startManual}
                  disabled={loading || pumpStatus}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <FaPlay className="text-[10px]" />
                  <span>START POMPA</span>
                </button>

                <button
                  onClick={stopManual}
                  disabled={loading || !pumpStatus}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-rose-600/20 transition cursor-pointer"
                >
                  <FaStop className="text-[10px]" />
                  <span>STOP POMPA</span>
                </button>
              </div>
            </div>

            {/* TIMER DURATION SELECTOR */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ⏱️ Durasi Timer Penyiraman
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 30].map((item) => (
                  <button
                    key={item}
                    disabled={timerRunning}
                    onClick={() => setSelectedDuration(item)}
                    className={`py-2.5 rounded-xl font-extrabold text-xs transition cursor-pointer border ${selectedDuration === item
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-md shadow-emerald-500/10"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
                      } disabled:opacity-50`}
                  >
                    {item}m
                  </button>
                ))}
              </div>
            </div>

            {/* COUNTDOWN DISPLAY & TIMER ACTION */}
            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-5 rounded-2xl text-white flex items-center justify-between gap-4 shadow-xl border border-teal-500/20">
              <div>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Countdown Timer
                </p>
                <div className="text-3xl font-mono font-black text-emerald-300 tracking-tight mt-0.5">
                  {timerRunning ? formatCountdown(countdown) : "00:00"}
                </div>
              </div>

              <div>
                {!timerRunning ? (
                  <button
                    onClick={() => startTimer(selectedDuration)}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                  >
                    <FaPlay className="text-[10px]" />
                    <span>MULAI TIMER</span>
                  </button>
                ) : (
                  <button
                    onClick={stopManual}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition cursor-pointer"
                  >
                    <FaStop className="text-[10px]" />
                    <span>BATALKAN</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== MONITORING + HISTORY TABLE + WATER TANK GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Water Level Chart */}
          <div className="lg:col-span-2 bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6 flex flex-col justify-between">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Monitoring Water Level
                </h3>
                <p className="text-xs text-slate-400">Grafik persentase air real-time & riwayat</p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setChartMode("realtime")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${chartMode === "realtime"
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  Realtime
                </button>

                {[1, 6, 12, 24].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setChartMode("history");
                      setFilterHour(item);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${chartMode === "history" && filterHour === item
                        ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                        : "text-slate-400 hover:text-white"
                      }`}
                  >
                    {item}H
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <WaterLevelChart history={tableHistory} chartMode={chartMode} />
            </div>
          </div>

          {/* Recent History Log */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-1">
              Riwayat Pembacaan
            </h3>
            <p className="text-xs text-slate-400 mb-4">Log data level air terbaru</p>

            <div className="flex-1 overflow-y-auto max-h-72 pr-1 space-y-2">
              {tableHistory.length === 0 ? (
                <div className="text-center text-slate-500 text-xs py-8">
                  Belum ada data riwayat.
                </div>
              ) : (
                [...tableHistory].reverse().map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800/80 transition border border-slate-800/80 text-xs"
                  >
                    <span className="text-slate-300 font-medium">{item.time}</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 font-mono">
                      {item.level}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Water Tank Component */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6 flex flex-col items-center justify-between">
            <div className="w-full text-center">
              <h3 className="text-lg font-bold text-white">Visualisasi Tandon</h3>
              <p className="text-xs text-slate-400">Estimasi fisik level air</p>
            </div>

            <div className="my-4 flex items-center justify-center">
              <WaterTank level={waterLevel} />
            </div>

            <div className="w-full bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className={`text-xs font-bold ${waterLevel > 70 ? "text-emerald-400" : waterLevel > 30 ? "text-amber-400" : "text-rose-400"}`}>
                Status Kapasitas: {waterLevel > 70 ? "Cukup ✅" : waterLevel > 30 ? "Sedang ⚠️" : "Hampir Habis 🔴"}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
