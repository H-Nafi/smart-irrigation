import {
  FaTint,
  FaWifi,
  FaPowerOff,
  FaChartLine,
} from "react-icons/fa";

export default function StatCard({
  title,
  value,
  color,
  progress,
  subtitle,
  badge,
  badgeColor,
  footer,
}) {
  let icon;

  switch (title) {
    case "Water Level":
      icon = <FaTint size={20} />;
      break;
    case "Device Status":
      icon = <FaWifi size={20} />;
      break;
    case "Water Consumption":
      icon = <FaChartLine size={20} />;
      break;
    case "Pump Status":
      icon = <FaPowerOff size={20} />;
      break;
    default:
      icon = null;
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 hover:border-emerald-500/30 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden">
      {/* Subtle Card Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>

      {/* HEADER */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              {title}
            </span>
            <h1 className="text-2xl lg:text-3xl font-black text-white mt-1 tracking-tight">
              {value}
            </h1>
          </div>

          <div
            className={`
              ${color || "bg-gradient-to-tr from-emerald-500 to-teal-400"}
              w-12 h-12
              rounded-2xl
              flex
              items-center
              justify-center
              text-white
              shadow-lg
              shadow-emerald-500/20
              group-hover:scale-110
              transition-transform
              duration-300
            `}
          >
            {icon}
          </div>
        </div>

        {/* SUBTITLE */}
        {subtitle && (
          <p className="text-slate-400 text-xs font-medium mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* FOOTER AREA */}
      <div className="mt-5">
        {/* BADGE */}
        {badge && (
          <div>
            <span
              className={`
                inline-flex items-center gap-1.5
                px-3 py-1
                rounded-full
                text-xs
                font-bold
                ${
                  badgeColor === "green"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : badgeColor === "red"
                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                    : badgeColor === "blue"
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                    : "bg-slate-800 text-slate-300 border border-slate-700"
                }
              `}
            >
              {badge}
            </span>
          </div>
        )}

        {/* PROGRESS */}
        {progress !== undefined && (
          <div className="mt-3">
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
              <div
                className={`${color || "bg-gradient-to-r from-emerald-500 to-teal-400"} h-full rounded-full transition-all duration-700`}
                style={{
                  width: `${Math.min(Math.max(progress, 0), 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* FOOTER */}
        {footer && (
          <p className="text-[11px] text-slate-400 font-medium mt-3 pt-2.5 border-t border-slate-800/80">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}