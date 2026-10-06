"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Custom Tooltip for Water Level Chart
function CustomWaterLevelTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const val = Number(payload[0].value || 0);
    return (
      <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 px-4 py-3 text-xs select-none">
        <p className="text-slate-400 font-semibold mb-1">Waktu: {label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
          <span className="font-bold text-slate-300">Water Level:</span>
          <span className="font-mono font-extrabold text-cyan-400 text-sm">
            {Math.max(0, val).toFixed(1)}%
          </span>
        </div>
      </div>
    );
  }
  return null;
}

// Custom Tooltip for Consumption Chart
function CustomConsumptionTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const val = Number(payload[0].value || 0);
    return (
      <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 px-4 py-3 text-xs select-none">
        <p className="text-slate-400 font-semibold mb-1">Waktu: {label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
          <span className="font-bold text-slate-300">Konsumsi Air:</span>
          <span className="font-mono font-extrabold text-emerald-400 text-sm">
            {Math.max(0, val).toFixed(2)} Liter
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function MonitoringChart({
  type = "waterlevel",
  data = [],
}) {
  const sanitizedData = data.map((item) => {
    const rawVal = item.percentage !== undefined ? item.percentage : item.level;
    const rawVol = item.volume_used !== undefined ? item.volume_used : item.volume;
    const val = Math.max(0, Math.min(100, Number(rawVal || 0)));
    const vol = Math.max(0, Number(rawVol || 0));

    return {
      ...item,
      percentage: val,
      level: val,
      volume_used: vol,
    };
  });

  // GRAFIK WATER LEVEL
  if (type === "waterlevel") {
    return (
      <div className="w-full h-full overflow-hidden relative">
        {sanitizedData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs font-semibold">
            Belum ada data water level
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sanitizedData}
              margin={{ top: 15, right: 20, left: -5, bottom: 20 }}
            >
              <defs>
                <linearGradient
                  id="waterLevelGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />

              <XAxis dataKey="time" hide={true} />

              <YAxis
                domain={[0, 100]}
                allowDataOverflow={true}
                tickFormatter={(val) => `${val}%`}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickMargin={8}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomWaterLevelTooltip />} />

              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#06b6d4"
                strokeWidth={3}
                fill="url(#waterLevelGradient)"
                dot={false}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "#ffffff",
                  fill: "#06b6d4",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }

  // GRAFIK WATER CONSUMPTION
  if (type === "consumption") {
    return (
      <div className="w-full h-full overflow-hidden relative">
        {sanitizedData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs font-semibold">
            Belum ada data konsumsi air
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sanitizedData}
              margin={{ top: 15, right: 20, left: -5, bottom: 20 }}
            >
              <defs>
                <linearGradient
                  id="consumptionGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />

              <XAxis dataKey="time" hide={true} />

              <YAxis
                domain={[0, "auto"]}
                allowDataOverflow={true}
                tickFormatter={(val) => `${val} L`}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickMargin={8}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<CustomConsumptionTooltip />} />

              <Area
                type="monotone"
                dataKey="volume_used"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#consumptionGradient)"
                dot={false}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "#ffffff",
                  fill: "#10b981",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  }

  return null;
}


