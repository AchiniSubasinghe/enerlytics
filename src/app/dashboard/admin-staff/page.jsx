"use client";

import { Users, Zap, ClipboardList, Wrench } from "lucide-react";
import { useApi } from "@/hooks/use-api";

export default function AdminStaffDashboard() {
  const { data: stats, loading } = useApi("/api/admin-staff/");

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Staff Dashboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Staff Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat title="Customers" value={stats?.customers || 0} icon={<Users />} />
        <Stat title="Meters" value={stats?.meters || 0} icon={<Zap />} />
        <Stat title="Meter Readers" value={stats?.meterReaders || 0} icon={<ClipboardList />} />
        <Stat title="Fix Requests" value="—" icon={<Wrench />} />
      </div>

      <h2 className="text-lg font-semibold mb-4">Meters by Utility</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Stat title="Electricity Meters" value={stats?.electricityMeters || 0} icon={<Zap />} />
        <Stat title="Water Meters" value={stats?.waterMeters || 0} icon={<Wrench />} />
        <Stat title="Gas Meters" value={stats?.gasMeters || 0} icon={<ClipboardList />} />
      </div>
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
}
