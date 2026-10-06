"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FaHistory,
  FaCalendarAlt,
  FaFilter,
  FaRedo,
  FaTint,
  FaPowerOff,
  FaWater,
  FaClock,
} from "react-icons/fa";

export default function HistoryContent() {
  const [activeTab, setActiveTab] = useState("watering"); // 'watering' | 'pump' | 'waterlevel'
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [wateringSessions, setWateringSessions] = useState([]);
  const [pumpLogs, setPumpLogs] = useState([]);
  const [waterLevelLogs, setWaterLevelLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const fetchHistoryData = useCallback(async () => {
    try {
      let url = "/api/history?";
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(url + params.toString());
      if (!res.ok) throw new Error("Gagal mengambil data riwayat");

      const data = await res.json();
      if (data.success) {
        setWateringSessions(data.wateringSessions || []);
        setPumpLogs(data.pumpLogs || []);
        setWaterLevelLogs(data.waterLevelHistory || []);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat memuat data riwayat");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const loadData = async () => {
      await fetchHistoryData();
    };
    loadData();
  }, [fetchHistoryData]);

  const handlePreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-16">
      {/* HEADER */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-black text-white tracking-tight">
            <span className="p-2.5 bg-teal-500/15 text-teal-300 rounded-2xl border border-teal-500/30">📜</span>
            Riwayat Sistem & Log Aktivitas
          </h1>
          <p className="mt-1 text-xs md:text-sm text-slate-400 font-medium">
            Rekaman lengkap riwayat penyiraman, status pompa ON/OFF, dan pembacaan level air.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest">
          <FaFilter className="text-emerald-400" />
          <span>Filter Berdasarkan Tanggal</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-400">Dari:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 outline-none focus:border-emerald-400 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-400">Sampai:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 outline-none focus:border-emerald-400 transition"
            />
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
            <button
              onClick={() => handlePreset(0)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white transition border border-slate-800 cursor-pointer"
            >
              Hari Ini
            </button>
            <button
              onClick={() => handlePreset(7)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white transition border border-slate-800 cursor-pointer"
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => handlePreset(30)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white transition border border-slate-800 cursor-pointer"
            >
              30 Hari Terakhir
            </button>
            {(startDate || endDate) && (
              <button
                onClick={handleResetFilter}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition cursor-pointer"
              >
                <FaRedo className="text-[10px]" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab("watering")}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-xs md:text-sm transition cursor-pointer border-t border-x ${
            activeTab === "watering"
              ? "bg-slate-900 text-emerald-400 border-slate-800 shadow-lg"
              : "text-slate-400 hover:text-slate-200 border-transparent bg-transparent"
          }`}
        >
          <FaTint className={activeTab === "watering" ? "text-emerald-400" : "text-slate-500"} />
          <span>Riwayat Penyiraman</span>
          <span className="ml-1 bg-emerald-500/15 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono border border-emerald-500/20">
            {wateringSessions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("pump")}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-xs md:text-sm transition cursor-pointer border-t border-x ${
            activeTab === "pump"
              ? "bg-slate-900 text-cyan-400 border-slate-800 shadow-lg"
              : "text-slate-400 hover:text-slate-200 border-transparent bg-transparent"
          }`}
        >
          <FaPowerOff className={activeTab === "pump" ? "text-cyan-400" : "text-slate-500"} />
          <span>Riwayat Pump ON/OFF</span>
          <span className="ml-1 bg-cyan-500/15 text-cyan-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono border border-cyan-500/20">
            {pumpLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("waterlevel")}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-xs md:text-sm transition cursor-pointer border-t border-x ${
            activeTab === "waterlevel"
              ? "bg-slate-900 text-teal-300 border-slate-800 shadow-lg"
              : "text-slate-400 hover:text-slate-200 border-transparent bg-transparent"
          }`}
        >
          <FaWater className={activeTab === "waterlevel" ? "text-teal-300" : "text-slate-500"} />
          <span>Riwayat Water Level</span>
          <span className="ml-1 bg-teal-500/15 text-teal-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono border border-teal-500/20">
            {waterLevelLogs.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6">
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-xs font-semibold">
            Memuat data riwayat...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-rose-400 text-xs font-semibold">{error}</div>
        ) : activeTab === "watering" ? (
          /* RIWAYAT PENYIRAMAN TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 rounded-l-2xl">Waktu Mulai</th>
                  <th className="p-4">Waktu Berhenti</th>
                  <th className="p-4">Durasi Penyiraman</th>
                  <th className="p-4">Water Consumption</th>
                  <th className="p-4 rounded-r-2xl">Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {wateringSessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      Tidak ada data riwayat penyiraman.
                    </td>
                  </tr>
                ) : (
                  wateringSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-800/50 transition">
                      <td className="p-4 font-medium text-slate-200">
                        {formatDateTime(session.start_time)}
                      </td>
                      <td className="p-4 font-medium text-slate-200">
                        {formatDateTime(session.stop_time)}
                      </td>
                      <td className="p-4 font-bold text-slate-300">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                          <FaClock className="text-slate-400" />
                          {session.duration_minutes} Menit
                        </span>
                      </td>
                      <td className="p-4 font-bold text-emerald-400 font-mono">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          💧 {session.volume_used} Liter
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-400">
                        {session.mode}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === "pump" ? (
          /* RIWAYAT PUMP ON/OFF TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 rounded-l-2xl">Status Pompa</th>
                  <th className="p-4">Waktu Kejadian</th>
                  <th className="p-4 rounded-r-2xl">Keterangan / Trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pumpLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-slate-500">
                      Tidak ada data log pompa.
                    </td>
                  </tr>
                ) : (
                  pumpLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition">
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            log.status === "ON"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {log.status === "ON" ? "🟢 POMPA ON" : "🔴 POMPA OFF"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-200 font-medium font-mono">{formatDateTime(log.timestamp)}</td>
                      <td className="p-4 text-slate-400 font-semibold">{log.trigger}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* RIWAYAT WATER LEVEL TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 rounded-l-2xl">Waktu Recording</th>
                  <th className="p-4">Water Level (%)</th>
                  <th className="p-4">Volume Air (L)</th>
                  <th className="p-4 rounded-r-2xl">Kapasitas Tandon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {waterLevelLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-500">
                      Tidak ada data level air.
                    </td>
                  </tr>
                ) : (
                  waterLevelLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition">
                      <td className="p-4 text-slate-200 font-medium font-mono">{formatDateTime(log.recorded_at)}</td>
                      <td className="p-4 font-bold text-cyan-400 font-mono">{log.percentage}%</td>
                      <td className="p-4 font-bold text-slate-300 font-mono">{log.current_volume} L</td>
                      <td className="p-4 text-slate-400 font-mono">{log.total_capacity} L</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
