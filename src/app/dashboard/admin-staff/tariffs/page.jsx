"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";



export default function TariffListPage() {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTariffs() {
      try {
        const res = await fetch("/api/admin-staff/tariffs", {
          cache: "no-store",
        });
        const data = await res.json();
        setTariffs(data);
      } catch (err) {
        console.error("Failed to load tariffs", err);
      } finally {
        setLoading(false);
      }
    }

    loadTariffs();
  }, []);

  async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await fetch(`/api/admin-staff/tariffs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    // Update UI without reloading
    setTariffs((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t
      )
    );
  }


  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tariff Plans</h1>
        <Link
          href="/dashboard/admin-staff/tariffs/add"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Tariff
        </Link>
      </div>

      {loading ? (
        <p>Loading tariffs...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell >Tariff Name</TableCell>
              <TableCell>Utility</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>

            {tariffs.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.utility_type}</TableCell>
                <TableCell>
                  <span className={t.status === "ACTIVE" ? "text-green-600" : "text-red-600"}>
                    {t.status}
                  </span>
                </TableCell>
                <TableCell>  {new Date(t.created_at).toLocaleDateString()} </TableCell>
                <TableCell className="space-x-3">
                  <Link href={`/dashboard/admin-staff/tariffs/${t.id}/edit`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Edit
                    </Button>
                  </Link>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => toggleStatus(t.id, t.status)}>
                    {t.status === "ACTIVE" ? "Disable" : "Enable"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
