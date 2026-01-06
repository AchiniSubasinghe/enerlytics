"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export default function MeterReaderDashboard() {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/meter-reader/meters")
      .then(res => res.json())
      .then(data => {
        setMeters(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Assigned Meters</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Meter No</TableHead>
            <TableHead>Utility</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reading</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {meters.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.meter_number}</TableCell>
              <TableCell>{m.utility_type}</TableCell>
              <TableCell>{m.customer}</TableCell>
              <TableCell>{m.address}</TableCell>
              <TableCell>
                <Badge variant={m.periodStatus === "PENDING" ? "destructive" : "success"}>
                  {m.periodStatus}
                </Badge>
              </TableCell>

              <TableCell>
                <Button
                  size="sm"
                  onClick={() => {
                    if (m.periodStatus === "COMPLETED") {
                      alert("Reading already completed for this meter.");
                      return;
                    }
                    window.location.href = `/dashboard/meter-reader/readings/${m.id}`;
                  }}
                  variant={m.periodStatus === "COMPLETED" ? "secondary" : "default"}
                >
                  Add Reading
                </Button>
              </TableCell>
            </TableRow>
          ))}
          
          {meters.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No meters assigned
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
