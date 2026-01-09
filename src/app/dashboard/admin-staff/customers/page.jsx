"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function deleteCustomer(id) {
    if (!confirm("Delete customer?")) return;

    const res = await fetch(`/api/admin-staff/customers/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    setCustomers(prev => prev.filter(c => c.id !== id));
  }

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch("/api/admin-staff/customers", {
          cache: "no-store",
        });

        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  /* ---------- SEARCH FILTER ---------- */
  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.nic?.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  return (
    <div className="bg-white shadow border rounded-lg p-6 mt-4 mx-2 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-sm text-gray-500">
            Total customers: {customers.length}
          </p>
        </div>

        <Link href="/dashboard/admin-staff/customers/add">
          <Button className="flex items-center gap-2">
            <UserPlus size={16} />
            Add Customer
          </Button>
        </Link>
      </div>

      {/* SEARCH */}
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search by name, email or NIC..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:ring"
        />
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>NIC</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                Loading customers...
              </TableCell>
            </TableRow>
          )}

          {!loading && filteredCustomers.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No customers found
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            filteredCustomers.map(c => (
              <TableRow key={c.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone || "—"}</TableCell>
                <TableCell>{c.nic || "—"}</TableCell>
                <TableCell className="text-center space-x-2">
                  <Link href={`/dashboard/admin-staff/customers/${c.id}/edit`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteCustomer(c.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
