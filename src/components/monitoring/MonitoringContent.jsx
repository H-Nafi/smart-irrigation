"use client";

import { useCallback, useEffect, useState } from "react";
import MonitoringChart from "./MonitoringChart";
import { useWatering } from "@/context/WateringContext";
import { FaTint, FaChartLine, FaCalendarAlt, FaWater } from "react-icons/fa";

export default function MonitoringContent() {
  const { waterLevel: realtimeLevel } = useWatering();

  const [waterLevel, setWaterLevel] = useState(realtimeLevel || 0);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [waterLevelHistory, setWaterLevelHistory] = useState([]);

  const [consumptionToday, setConsumptionToday] = useState(0);
  const [consumptionWeek, setConsumptionWeek] = useState(0);
  const [averageConsumption, setAverageConsumption] = useState(0);
  const [consumptionHistory, setConsumptionHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

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

  const fetchMonitoringData = useCallback(async () => {
    try {
      // Fetch Water Level
      const waterLevelResponse = await fetch("/api/water-level?hours=24", {
        cache: "no-store",
      });

      if (waterLevelResponse.ok) {
        const waterLevelData = await waterLevelResponse.json();
        if (Array.isArray(waterLevelData)) {
          setWaterLevelHistory(waterLevelData);
          if (waterLevelData.length > 0) {
            const latest = waterLevelData[waterLevelData.length - 1];
            setWaterLevel(Number(latest.percentage || 0));
            setCurrentVolume(Number(latest.current_volume || 0));
          }
        }
      }

      // Fetch Water Consumption
      const consumptionResponse = await fetch("/api/water-consumption", {
        cache: "no-store",
      });

      if (consumptionResponse.ok) {
        const consumptionData = await consumptionResponse.json();
        setConsumptionToday(Number(consumptionData.today || 0));
        setConsumptionWeek(Number(consumptionData.week || 0));
        setAverageConsumption(Number(consumptionData.average || 0));

        if (Array.isArray(consumptionData.history)) {
          const history = consumptionData.history.map((item) => ({
            ...item,
            time: formatTime(item.created_at),
            volume_used: Number(item.volume_used || 0),
          }));
          setConsumptionHistory(history);
        }
      }
    } catch (err) {
      console.error("Monitoring Error:", err);
      setError(err.message || "Terjadi kesalahan saat mengambil data monitoring");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchMonitoringData();
    };
    loadData();

    const interval = setInterval(fetchMonitoringData, 8000);
    return () => clearInterval(interval);
  }, [fetchMonitoringData]);

  const waterLevelChartData = waterLevelHistory.map((item) => ({
    time: formatTime(item.recorded_at),
    percentage: Number(item.percentage || 0),
  }));

  const consumptionChartData = consumptionHistory.map((item) => ({
    time: formatTime(item.created_at),
    volume_used: Number(item.volume_used || 0),
  }));

  // Estimate monthly consumption = week total * 4
  const estimatedMonthConsumption = consumptionWeek * 4;

  if (loading && waterLevelHistory.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center py-24">
        <div className="inline-block p-4 rounded-full bg-blue-50 text-blue-600 mb-3 animate-spin">
          💧
        </div>
        <p className="text-gray-500 font-semibold">Memuat data monitoring...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-16">
      {/* HEADER */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-black text-white tracking-tight">
          <span>📊</span> Monitoring Air Real-Time
        </h1>
        <p className="mt-1 text-xs md:text-sm text-slate-400 font-medium">
          Pantau kondisi real-time level air tandon dan statistik penggunaan air tanaman.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-2xl p-4 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* TOP REALTIME CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Realtime Water Level */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Water Level Realtime
              </p>
              <h2 className="text-4xl font-black text-cyan-400 mt-2 tracking-tight">
                {(realtimeLevel || waterLevel).toFixed(1)}%
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Volume Air: <span className="font-bold text-slate-200">{currentVolume.toFixed(2)} Liter</span>
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <FaWater />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
              <span>Kapasitas Tandon</span>
              <span>{(realtimeLevel || waterLevel).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(Math.max(realtimeLevel || waterLevel, 0), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Total Today Consumption */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Total Konsumsi Hari Ini 💧
              </p>
              <h2 className="text-4xl font-black text-emerald-400 mt-2 tracking-tight">
                {consumptionToday.toFixed(2)} L
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Rata-rata Harian: <span className="font-bold text-slate-200">{averageConsumption.toFixed(2)} Liter</span>
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <FaTint />
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Perkiraan Bulan Ini:</span>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 font-mono">
              ~{estimatedMonthConsumption.toFixed(1)} L
            </span>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Konsumsi Hari Ini</p>
          <h3 className="text-2xl font-black text-emerald-400 mt-1 font-mono">
            {consumptionToday.toFixed(2)} L
          </h3>
        </div>

        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Konsumsi 7 Hari Terakhir</p>
          <h3 className="text-2xl font-black text-cyan-400 mt-1 font-mono">
            {consumptionWeek.toFixed(2)} L
          </h3>
        </div>

        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Konsumsi Harian</p>
          <h3 className="text-2xl font-black text-teal-300 mt-1 font-mono">
            {averageConsumption.toFixed(2)} L
          </h3>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Level Chart */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6 overflow-hidden">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">Grafik Water Level (24 Jam)</h2>
            <p className="text-xs text-slate-400">Perubahan persentase air dalam tandon</p>
          </div>
          <div className="h-64 sm:h-72 overflow-hidden">
            <MonitoringChart type="waterlevel" data={waterLevelChartData} />
          </div>
        </div>

        {/* Consumption Chart */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6 overflow-hidden">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">Grafik Konsumsi Air</h2>
            <p className="text-xs text-slate-400">Estimasi penggunaan air saat penyiraman</p>
          </div>
          <div className="h-64 sm:h-72 overflow-hidden">
            <MonitoringChart type="consumption" data={consumptionChartData} />
          </div>
        </div>
      </div>

      {/* DETAILED READINGS TABLE */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 shadow-xl p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white">Detail Pembacaan Water Level</h2>
          <p className="text-xs text-slate-400">20 log data terbaru dari sensor ultrasonik</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4 rounded-l-2xl">Waktu Recording</th>
                <th className="p-4">Level Air (%)</th>
                <th className="p-4 rounded-r-2xl">Volume (Liter)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {waterLevelHistory
                .slice()
                .reverse()
                .slice(0, 20)
                .map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-800/50 transition">
                    <td className="p-4 text-slate-300 font-medium">{formatDateTime(item.recorded_at)}</td>
                    <td className="p-4 font-bold text-cyan-400 font-mono">{Number(item.percentage || 0).toFixed(1)}%</td>
                    <td className="p-4 text-slate-300 font-semibold font-mono">{Number(item.current_volume || 0).toFixed(2)} L</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}