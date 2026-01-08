"use client";

import { Users, CreditCard, Clock, UserCog } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: users, loading } = useApi("/api/admin/users");
  const { data: meterReaderData } = useApi("/api/admin/meter-readers");

  const userList = users || [];

  const stats = {
    totalUsers: userList.length,
    totalPayments: 842000,
    pendingPayments: 47,
    meterReaders: meterReaderData?.count || 0,
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/dashboard/admin/users/add">
          <button className="px-3 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded">
            Add New User
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          icon={<Users className="w-8 h-8 text-blue-600" />}
          title="Total Users"
          value={stats.totalUsers}
        />
        <SummaryCard
          icon={<CreditCard className="w-8 h-8 text-green-600" />}
          title="Total Payments"
          value={`LKR ${stats.totalPayments.toLocaleString()}`}
        />
        <SummaryCard
          icon={<Clock className="w-8 h-8 text-yellow-500" />}
          title="Pending Payments"
          value={stats.pendingPayments}
        />
        <SummaryCard
          icon={<UserCog className="w-8 h-8 text-purple-600" />}
          title="Meter Readers"
          value={stats.meterReaders}
        />
      </div>

      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Phone</th>
              </tr>
            </thead>
            <tbody>
              {userList.slice(0, 5).map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">{user.phone || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
