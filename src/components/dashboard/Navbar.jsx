"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaSignOutAlt, FaWifi, FaSeedling, FaClock, FaBars } from "react-icons/fa";
import { useWatering } from "@/context/WateringContext";

export default function Navbar() {
  const router = useRouter();
  const [time, setTime] = useState("");
  const { deviceOnline, toggleMobileMenu } = useWatering();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleLogout() {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userRole");
    router.replace("/login");
  }

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-30 px-4 md:px-8 py-3.5 flex flex-wrap justify-between items-center shadow-lg shadow-slate-950/20 transition-all select-none">
      {/* Left: Mobile Hamburger Button + Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu (Visible on mobile/tablet < 1024px) */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition cursor-pointer border border-slate-700/80"
          title="Buka Menu"
        >
          <FaBars className="text-lg" />
        </button>

        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-lg shadow-md shadow-emerald-500/20">
          <FaSeedling />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent tracking-tight">
            Smart Irrigation
          </h1>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            Monitoring & Automated Control Panel
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Device Status Pill */}
        <div
          className={`flex items-center gap-1.5 md:gap-2 px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold shadow-md border transition-all ${
            deviceOnline
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10"
              : "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/10"
          }`}
        >
          <FaWifi className={deviceOnline ? "animate-pulse text-emerald-400" : "text-rose-400"} />
          <span>{deviceOnline ? "ESP32 Online" : "ESP32 Offline"}</span>
        </div>

        {/* Time Clock */}
        <div className="text-right hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-700/80 text-xs">
          <FaClock className="text-emerald-400 text-xs" />
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Waktu</p>
            <h3 className="font-mono font-bold text-slate-100 text-xs tracking-wide">{time}</h3>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 md:gap-3 border-l border-slate-800 pl-3 md:pl-6">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-md shadow-emerald-500/20 border border-white/20">
            A
          </div>
          <div className="hidden lg:block text-left">
            <h3 className="text-xs font-bold text-slate-100 leading-tight">Administrator</h3>
            <p className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">Operator</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition cursor-pointer border border-transparent hover:border-rose-500/20"
        >
          <FaSignOutAlt className="text-sm" />
          <span className="hidden md:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}