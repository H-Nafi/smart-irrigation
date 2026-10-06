"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaSeedling, FaShieldAlt, FaArrowRight } from "react-icons/fa";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (result.success) {
        sessionStorage.setItem("isLoggedIn", "true");
        if (result.user?.name) {
          sessionStorage.setItem("userName", result.user.name);
        }
        router.push("/dashboard");
      } else {
        setError(result.message || "Email atau password salah.");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center p-4 select-none overflow-hidden"
      style={{
        backgroundImage: "url('/images/bg-login.png')",
      }}
    >
      {/* Dynamic Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/75 to-teal-950/80 backdrop-blur-xs"></div>

      {/* Decorative Light Orbs */}
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Hero Info */}
        <div className="lg:col-span-7 text-white p-6 md:p-8 space-y-6 hidden sm:block">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <FaSeedling className="text-emerald-400 text-sm animate-bounce" />
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
              Smart IoT Agriculture v2.0
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-md">
            Smart <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Irrigation</span> System
          </h1>

          <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
            Sistem monitoring ketinggian air tandon dan kontrol penyiraman otomatis secara real-time berbasis ESP32, MQTT, dan Dashboard Next.js.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-lg">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
              <p className="text-xs text-slate-400 font-semibold">Real-Time</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">MQTT Stream</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
              <p className="text-xs text-slate-400 font-semibold">Hardware</p>
              <p className="text-sm font-bold text-cyan-400 mt-0.5">ESP32 IoT</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
              <p className="text-xs text-slate-400 font-semibold">Security</p>
              <p className="text-sm font-bold text-teal-300 mt-0.5">Auth System</p>
            </div>
          </div>
        </div>

        {/* Right Side: Sleek Glass Login Card */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="w-full max-w-md bg-slate-900/70 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8 sm:p-10 space-y-6 relative overflow-hidden transition-all duration-300 hover:border-emerald-500/40"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"></div>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-500/30 mb-4">
                <FaShieldAlt />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Sign In Operator
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Masukkan akun untuk mengontrol sistem irigasi
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-shake">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">
                  Email Address
                </label>
                <div className="flex items-center rounded-2xl px-4 bg-slate-800/80 border border-slate-700/80 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all duration-200">
                  <FaEnvelope className="text-slate-400 text-sm" />
                  <input
                    type="email"
                    placeholder="admin@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3.5 bg-transparent outline-none text-white text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">
                  Password
                </label>
                <div className="flex items-center rounded-2xl px-4 bg-slate-800/80 border border-slate-700/80 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all duration-200">
                  <FaLock className="text-slate-400 text-sm" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3.5 bg-transparent outline-none text-white text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>MASUK DASHBOARD</span>
                  <FaArrowRight className="text-xs" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}