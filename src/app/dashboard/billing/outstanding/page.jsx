"use client";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import Link from "next/link";

export default function OutstandingBills() {
  const { data: outstanding = [], loading } = useApi("/api/billing/outstanding");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Outstanding Bills</h1>

      {loading ? (
        <p>Loading outstanding bills...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Meter</TableHead>
              <TableHead>Utility</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Outstanding</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outstanding.map((b) => (
              <TableRow key={b.id}>
                <TableCell>#{b.id}</TableCell>
                <TableCell>{b.customer_name || 'N/A'}</TableCell>
                <TableCell>{b.meter_number || 'N/A'}</TableCell>
                <TableCell>{b.utility_type || 'N/A'}</TableCell>
                <TableCell>Rs. {parseFloat(b.bill_amount || 0).toFixed(2)}</TableCell>
                <TableCell className="font-bold text-red-600">
                  Rs. {parseFloat(b.outstanding || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/billing/payments/add/${b.id}`}>
                    <Button size="sm">Record Payment</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {outstanding.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No outstanding bills
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
