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
import { Search, Cpu } from "lucide-react";

export default function MetersPage() {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadMeters() {
      try {
        const res = await fetch("/api/admin-staff/meters", {
          cache: "no-store",
        });
        const data = await res.json();
        setMeters(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadMeters();
  }, []);

  const assignedCount = meters.filter(m => m.customer_name).length;
  const unassignedCount = meters.length - assignedCount;

  const filteredMeters = useMemo(() => {
    return meters.filter(m =>
      m.meter_number?.toLowerCase().includes(search.toLowerCase()) ||
      m.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.utility_type?.toLowerCase().includes(search.toLowerCase())
    );
  }, [meters, search]);

  return (
    <div className="bg-white shadow border rounded-lg p-6 mt-4 mx-2 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Meters</h1>
          <p className="text-sm text-gray-500">
            Total: {meters.length} | Assigned: {assignedCount} | Unassigned: {unassignedCount}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/dashboard/admin-staff/meters/add">
            <Button className="flex gap-2 items-center">
              <Cpu size={16} />
              Add Meter
            </Button>
          </Link>

          <Link href="/dashboard/admin-staff/meters/assign">
            <Button variant="outline">
              Assign Meter
            </Button>
          </Link>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search by meter no, customer or utility..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:ring"
        />
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Meter No</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Utility</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Customer</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                Loading meters...
              </TableCell>
            </TableRow>
          )}

          {!loading && filteredMeters.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No meters found
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            filteredMeters.map(m => (
              <TableRow key={m.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{m.meter_number}</TableCell>

                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded 
                    ${m.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"}`}>
                    {m.status}
                  </span>
                </TableCell>

                <TableCell>{m.utility_type}</TableCell>
                <TableCell>{m.unit}</TableCell>

                <TableCell>
                  {m.customer_name ? (
                    <span className="text-gray-900">{m.customer_name}</span>
                  ) : (
                    <span className="text-red-600 font-medium">Unassigned</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
