"use client";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

// CUSTOM TOOLTIP
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const val = Math.max(0, Number(payload[0].value || 0));
    return (
      <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 px-4 py-3 text-xs select-none">
        <p className="text-slate-400 font-semibold mb-1">Waktu: {label}</p>
        <p className="font-extrabold text-emerald-400 text-sm flex items-center gap-1.5">
          <span>💧 Water Level:</span>
          <span className="font-mono">{val.toFixed(1)}%</span>
        </p>
      </div>
    );
  }
  return null;
}

export default function WaterLevelChart({ history, chartMode }) {
  const sanitizedHistory = (history || []).map((item) => {
    const rawVal = item.level !== undefined ? item.level : item.percentage;
    const val = Math.max(0, Math.min(100, Number(rawVal || 0)));
    return {
      ...item,
      level: val,
      percentage: val,
    };
  });

  return (
    <div className="w-full h-full overflow-hidden relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={sanitizedHistory}
          margin={{
            top: 10,
            right: 15,
            left: -15,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#334155"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            hide={chartMode === "realtime"}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickMargin={8}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />

          <YAxis
            domain={[0, 100]}
            allowDataOverflow={true}
            unit="%"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickMargin={8}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="level"
            fill="url(#waterGradient)"
            stroke="#10b981"
            strokeWidth={3}
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
    </div>
  );
}