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
import { Search, UserCheck } from "lucide-react";

export default function MeterReadersPage() {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadReaders() {
      const res = await fetch("/api/admin-staff/meter-readers/with-meters", {
        cache: "no-store",
      });
      const data = await res.json();
      setReaders(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    loadReaders();
  }, []);

  const assignedCount = readers.filter(r => r.meter_number).length;
  const unassignedCount = readers.length - assignedCount;

  const filteredReaders = useMemo(() => {
    return readers.filter(r =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.meter_number?.toLowerCase().includes(search.toLowerCase())
    );
  }, [readers, search]);

  return (
    <div className="bg-white shadow border rounded-lg p-6 mt-4 mx-2 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Meter Readers</h1>
          <p className="text-sm text-gray-500">
            Total: {readers.length} | Assigned: {assignedCount} | Unassigned: {unassignedCount}
          </p>
        </div>

        <Link href="/dashboard/admin-staff/meter-readers/assign">
          <Button className="flex items-center gap-2">
            <UserCheck size={16} />
            Assign Reader
          </Button>
        </Link>
      </div>

      {/* SEARCH */}
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search by name, email or meter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:ring"
        />
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Assigned Meter</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                Loading meter readers...
              </TableCell>
            </TableRow>
          )}

          {!loading && filteredReaders.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                No meter readers found
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            filteredReaders.map(r => (
              <TableRow key={r.reader_id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.meter_number || "—"}</TableCell>
                <TableCell>
                  {r.meter_number ? (
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      Assigned
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                      Not Assigned
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
