"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaChartLine,
  FaTint,
  FaHistory,
  FaSignOutAlt,
  FaSeedling,
  FaTimes,
} from "react-icons/fa";
import { useWatering } from "@/context/WateringContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mobileMenuOpen, closeMobileMenu } = useWatering();

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userRole");
    closeMobileMenu();
    router.replace("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: FaHome },
    { label: "Monitoring", path: "/monitoring", icon: FaChartLine },
    { label: "Watering", path: "/watering", icon: FaTint },
    { label: "History", path: "/history", icon: FaHistory },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full select-none">
      {/* BRAND HEADER */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/25">
            <FaSeedling />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white leading-snug">
              Smart Irrigation
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                SYSTEM CONTROL
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={closeMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Tutup Menu"
        >
          <FaTimes className="text-lg" />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Menu Utama
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={closeMobileMenu}
              className={`
                group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/20"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 hover:border-slate-800 border border-transparent"
                }
              `}
            >
              <Icon
                className={`text-lg transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-400"
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER & LOGOUT */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Versi Sistem</span>
          <span className="font-mono text-emerald-400 font-bold">v2.4 IoT</span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer hover:shadow-lg hover:shadow-rose-500/10"
        >
          <FaSignOutAlt className="text-sm" />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR (Visible on lg screens >= 1024px) */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-slate-950 text-slate-100 flex-col border-r border-slate-800/80 shadow-2xl transition-all select-none relative z-20 shrink-0">
        <SidebarContent />
      </aside>

      {/* MOBILE OVERLAY DRAWER (Visible on mobile/tablet screens < 1024px when open) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Drawer Slide-in Container */}
          <div className="relative z-10 w-72 max-w-[85vw] bg-slate-950 text-slate-100 h-full shadow-2xl border-r border-slate-800 flex flex-col transform transition-transform duration-300">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}