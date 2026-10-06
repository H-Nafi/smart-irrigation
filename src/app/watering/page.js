import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import WateringContent from "@/components/watering/WateringContent";

export default function WateringPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <WateringContent />
      </div>
    </div>
  );
}