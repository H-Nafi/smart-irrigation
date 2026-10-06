"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { connectMQTT, publishManualWatering, publishTimer } from "@/lib/mqtt";

const WateringContext = createContext(null);

export function WateringProvider({ children }) {
  // Pump & Device State
  const [pumpStatus, setPumpStatus] = useState(false);
  const [deviceOnline, setDeviceOnline] = useState(false);
  const heartbeatTimeout = useRef(null);
  const lastDbSaveRef = useRef(0);

  // Sensor Data
  const [waterLevel, setWaterLevel] = useState(85);
  const [todayConsumption, setTodayConsumption] = useState(0);
  const [weekConsumption, setWeekConsumption] = useState(0);
  const [realtimeHistory, setRealtimeHistory] = useState([]);

  // Timer & Control State
  const [timerMode, setTimerMode] = useState("manual"); // 'manual' | 'timer'
  const [selectedDuration, setSelectedDuration] = useState(5); // in minutes
  const [countdown, setCountdown] = useState(0); // in seconds
  const [timerRunning, setTimerRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mobile Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // ----------------------------------------------------
  // Sync Timer from localStorage on load & run ticker
  // ----------------------------------------------------
  useEffect(() => {
    const savedEndTime = localStorage.getItem("smart_irrigation_timer_end");
    const savedDuration = localStorage.getItem("smart_irrigation_timer_duration");

    if (!savedDuration && !savedEndTime) return;

    queueMicrotask(() => {
      if (savedDuration) {
        setSelectedDuration(Number(savedDuration));
      }

      if (savedEndTime) {
        const endTime = Number(savedEndTime);
        const remaining = Math.ceil((endTime - Date.now()) / 1000);

        if (remaining > 0) {
          setCountdown(remaining);
          setTimerRunning(true);
          setTimerMode("timer");
        } else {
          localStorage.removeItem("smart_irrigation_timer_end");
          localStorage.removeItem("smart_irrigation_timer_duration");
        }
      }
    });
  }, []);

  // Ticker Effect for countdown
  useEffect(() => {
    let interval = null;

    if (timerRunning) {
      interval = setInterval(() => {
        const savedEndTime = localStorage.getItem("smart_irrigation_timer_end");

        if (savedEndTime) {
          const endTime = Number(savedEndTime);
          const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

          setCountdown(remaining);

          if (remaining <= 0) {
            // Timer completed
            setTimerRunning(false);
            localStorage.removeItem("smart_irrigation_timer_end");
            localStorage.removeItem("smart_irrigation_timer_duration");

            // Turn off pump on timeout
            setPumpStatus(false);
            publishManualWatering("OFF");
            fetch("/api/pump-status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "OFF" }),
            }).catch((err) => console.log("Failed to post pump OFF", err));
          }
        } else {
          setCountdown((prev) => {
            if (prev <= 1) {
              setTimerRunning(false);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  // ----------------------------------------------------
  // Fetch initial pump status from DB
  // ----------------------------------------------------
  useEffect(() => {
    async function loadPumpStatus() {
      try {
        const res = await fetch("/api/pump-status");
        const data = await res.json();
        if (data.success) {
          const isOn = data.status === "ON";
          setPumpStatus(isOn);
        }
      } catch (error) {
        console.error("Gagal mengambil pump status:", error);
      }
    }
    loadPumpStatus();
  }, []);

  // ----------------------------------------------------
  // Fetch Water Consumption periodically
  // ----------------------------------------------------
  const loadConsumption = useCallback(async () => {
    try {
      const res = await fetch("/api/water-consumption");
      const data = await res.json();
      if (data.success) {
        setTodayConsumption(Number(data.today ?? 0));
        setWeekConsumption(Number(data.week ?? 0));
      }
    } catch (error) {
      console.error("Error loading consumption:", error);
    }
  }, []);

  useEffect(() => {
    const fetchInit = async () => {
      await loadConsumption();
    };
    fetchInit();

    const interval = setInterval(loadConsumption, 4000);
    return () => clearInterval(interval);
  }, [loadConsumption]);

  // ----------------------------------------------------
  // Central MQTT Handler
  // ----------------------------------------------------
  useEffect(() => {
    const handleMQTTMessage = (data) => {
      if (!data) return;

      if (data.type === "waterlevel") {
        const level = Number(data.value);
        setWaterLevel(level);

        // Save ke Database: hanya jika sudah berlalu 1 menit (60.000 ms) dari simpanan terakhir
        const nowMs = Date.now();
        if (nowMs - lastDbSaveRef.current >= 60000) {
          lastDbSaveRef.current = nowMs;
          fetch("/api/water-level", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ percentage: level }),
          }).catch((err) => console.log("Gagal simpan DB water-level:", err));
        }

        const now = new Date();
        const currentTime = now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        setRealtimeHistory((prev) =>
          [...prev, { time: currentTime, level: level }].slice(-10)
        );
      }

      if (data.type === "pumpstatus") {
        const status = data.value;
        const isOn = status === "ON";
        setPumpStatus(isOn);

        if (!isOn) {
          setTimerRunning(false);
          setCountdown(0);
          localStorage.removeItem("smart_irrigation_timer_end");
          localStorage.removeItem("smart_irrigation_timer_duration");
        }
      }

      if (data.type === "device") {
        setDeviceOnline(true);
        if (heartbeatTimeout.current) {
          clearTimeout(heartbeatTimeout.current);
        }
        heartbeatTimeout.current = setTimeout(() => {
          setDeviceOnline(false);
        }, 10000);
      }
    };

    connectMQTT(handleMQTTMessage);
  }, []);

  // ----------------------------------------------------
  // Actions: Manual & Timer Control
  // ----------------------------------------------------
  const startManual = async () => {
    if (loading) return;
    setLoading(true);
    try {
      setTimerMode("manual");
      setTimerRunning(false);
      setCountdown(0);
      localStorage.removeItem("smart_irrigation_timer_end");

      setPumpStatus(true);
      publishManualWatering("ON");

      await fetch("/api/pump-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ON" }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stopManual = async () => {
    if (loading) return;
    setLoading(true);
    try {
      setPumpStatus(false);
      setTimerRunning(false);
      setCountdown(0);
      localStorage.removeItem("smart_irrigation_timer_end");
      localStorage.removeItem("smart_irrigation_timer_duration");

      publishManualWatering("OFF");

      await fetch("/api/pump-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "OFF" }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = async (durationMinutes = selectedDuration) => {
    if (loading) return;
    setLoading(true);
    try {
      const minutes = Number(durationMinutes);
      setSelectedDuration(minutes);
      setTimerMode("timer");

      const durationSeconds = minutes * 60;
      const endTime = Date.now() + durationSeconds * 1000;

      localStorage.setItem("smart_irrigation_timer_end", String(endTime));
      localStorage.setItem("smart_irrigation_timer_duration", String(minutes));

      setCountdown(durationSeconds);
      setTimerRunning(true);
      setPumpStatus(true);

      publishTimer(minutes);

      await fetch("/api/pump-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ON" }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <WateringContext.Provider
      value={{
        pumpStatus,
        setPumpStatus,
        deviceOnline,
        waterLevel,
        setWaterLevel,
        todayConsumption,
        weekConsumption,
        realtimeHistory,
        timerMode,
        setTimerMode,
        selectedDuration,
        setSelectedDuration,
        countdown,
        timerRunning,
        loading,
        startManual,
        stopManual,
        startTimer,
        stopTimer: stopManual,
        formatCountdown,
        loadConsumption,
        mobileMenuOpen,
        setMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
      }}
    >
      {children}
    </WateringContext.Provider>
  );
}

export function useWatering() {
  const context = useContext(WateringContext);
  if (!context) {
    throw new Error("useWatering must be used within a WateringProvider");
  }
  return context;
}
