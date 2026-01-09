"use client";

import {
  Users,
  CreditCard,
  Clock,
  UserCog,
} from "lucide-react";
import { useApi } from "@/hooks/use-api";
import Link from "next/link";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#9333ea"];

export default function AdminDashboard() {
  const { data: users, loading } = useApi("/api/admin/users");
  const { data: meterReaderData } = useApi("/api/admin/meter-readers");

  const userList = users || [];

  /* ---------- STATS ---------- */
  const stats = {
    totalUsers: userList.length,
    totalPayments: 842000,
    pendingPayments: 47,
    meterReaders: meterReaderData?.count || 0,
  };

  /* ---------- CHART DATA (DUMMY but realistic) ---------- */

  const paymentsTrend = [
    { month: "Aug", amount: 120000 },
    { month: "Sep", amount: 155000 },
    { month: "Oct", amount: 138000 },
    { month: "Nov", amount: 190000 },
    { month: "Dec", amount: 239000 },
  ];

  const roleDistribution = [
    { name: "Customers", value: userList.filter(u => u.role === "CUSTOMER").length || 45 },
    { name: "Meter Readers", value: userList.filter(u => u.role === "METER_READER").length || 12 },
    { name: "Cashiers", value: userList.filter(u => u.role === "CASHIER").length || 6 },
    { name: "Admins", value: userList.filter(u => u.role === "ADMIN").length || 3 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/dashboard/admin/users/add">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
            + Add New User
          </button>
        </Link>
      </div>

      {/* SUMMARY CARDS */}
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

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PAYMENTS LINE CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Payments Overview (Last 5 Months)
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paymentsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* USERS PIE CHART */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Users by Role
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {roleDistribution.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT USERS */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>

        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Phone</th>
              </tr>
            </thead>
            <tbody>
              {userList.slice(0, 5).map(user => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">{user.phone || "—"}</td>
                </tr>
              ))}

              {userList.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function SummaryCard({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
