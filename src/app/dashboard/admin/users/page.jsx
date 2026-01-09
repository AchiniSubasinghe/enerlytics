"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, UserPlus } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users", { cache: "no-store" });
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  async function deleteUser(id) {
    if (!confirm("Delete user?")) return;

    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    setUsers(prev => prev.filter(u => u.id !== id));
  }

  /* ---------- FILTERING ---------- */
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "ALL" || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="bg-white shadow border rounded-lg p-6 mt-4 mx-2 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-sm text-gray-500">
            Total users: {users.length}
          </p>
        </div>

        <Link href="/dashboard/admin/users/add">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
            <UserPlus size={16} />
            Add New User
          </button>
        </Link>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-48"
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="ADMIN_STAFF">Admin Staff</option>
          <option value="METER_READER">Meter Reader</option>
          <option value="CASHIER">Cashier</option>
          <option value="CUSTOMER">Customer</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">NIC</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            )}

            {!loading && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}

            {!loading &&
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 border font-medium">
                    {user.name}
                  </td>
                  <td className="p-3 border">
                    {user.email}
                  </td>
                  <td className="p-3 border">
                    {user.phone || "—"}
                  </td>
                  <td className="p-3 border">
                    {user.nic || "—"}
                  </td>
                  <td className="p-3 border">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="p-3 border text-center">
                    <div className="flex justify-center gap-2">
                      <Link href={`/dashboard/admin/users/${user.id}/edit`}>
                        <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- ROLE BADGE ---------- */
function RoleBadge({ role }) {
  const colors = {
    ADMIN: "bg-purple-100 text-purple-700",
    ADMIN_STAFF: "bg-indigo-100 text-indigo-700",
    METER_READER: "bg-blue-100 text-blue-700",
    CASHIER: "bg-green-100 text-green-700",
    CUSTOMER: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${
        colors[role] || "bg-gray-100 text-gray-700"
      }`}
    >
      {role}
    </span>
  );
}
