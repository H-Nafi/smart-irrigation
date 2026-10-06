export default function WaterTank({ level }) {
  const safeLevel = Math.max(0, Math.min(100, Number(level || 0)));

  return (
    <div className="flex flex-col items-center select-none">
      {/* Tangki Glass Container */}
      <div className="relative w-36 h-64 border-4 border-slate-700/80 rounded-b-3xl rounded-t-2xl overflow-hidden bg-slate-950/80 shadow-2xl backdrop-blur-md p-1 group">
        
        {/* Air Liquid with Gradient & Smooth Animation */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600 via-teal-500 to-emerald-400 transition-all duration-700 ease-out shadow-lg shadow-teal-500/30"
          style={{
            height: `${safeLevel}%`,
          }}
        >
          {/* Permukaan Gelombang Air */}
          <div className="absolute -top-3 left-0 w-[200%] h-6 bg-emerald-200/50 rounded-full animate-wave"></div>
          <div className="absolute -top-2.5 left-0 w-[200%] h-5 bg-cyan-300/30 rounded-full animate-wave" style={{ animationDirection: "reverse", animationDuration: "2.5s" }}></div>

          {/* Dynamic Bubbles */}
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/70 rounded-full animate-ping"></div>
          <div className="absolute bottom-12 right-6 w-2.5 h-2.5 bg-white/50 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-8 w-1.5 h-1.5 bg-white/60 rounded-full animate-ping" style={{ animationDuration: "2s" }}></div>
        </div>

        {/* Efek Kilatan Kaca (Glass Shine Reflection) */}
        <div className="absolute left-2 top-2 bottom-2 w-3 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-full pointer-events-none"></div>
        <div className="absolute right-2 top-4 w-1.5 h-12 bg-white/20 rounded-full pointer-events-none"></div>

        {/* Center Overlay Level Percentage */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-3 py-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-xl text-center">
            <span className="text-xl font-black bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent font-mono">
              {safeLevel.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Tank Footer Badge */}
      <div className="mt-3 text-center">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Kapasitas Tandon
        </span>
      </div>
    </div>
  );
}