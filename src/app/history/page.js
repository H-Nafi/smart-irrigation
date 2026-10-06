"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import HistoryContent from "@/components/history/HistoryContent";

export default function HistoryPage() {
  const router = useRouter();

  useEffect(() => {
    const login = sessionStorage.getItem("isLoggedIn");
    if (!login) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <HistoryContent />
      </div>
    </div>
  );
}
