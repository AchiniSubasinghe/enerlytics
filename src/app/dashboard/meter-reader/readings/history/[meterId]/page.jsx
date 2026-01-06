"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Alert } from "@/components/ui/alert";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReadingHistoryPage() {
  const { meterId } = useParams();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/meter-reader/readings/history/${meterId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setHistory(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load history");
        setLoading(false);
      });
  }, [meterId]);

  if (loading) {
    return <p className="p-6">Loading history...</p>;
  }
  
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Reading History</h1>

      {error && <Alert variant="destructive">{error}</Alert>}

      {!error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Previous</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>Units Used</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {history.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{r.reading_date}</TableCell>
                <TableCell>{r.previous_reading}</TableCell>
                <TableCell>{r.current_reading}</TableCell>
                <TableCell>{r.units_used}</TableCell>
              </TableRow>
            ))}
            {history.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No readings yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
