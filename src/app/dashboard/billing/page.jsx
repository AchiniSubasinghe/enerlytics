"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";

export default function BillingDashboard() {
  const { data: bills = [], loading } = useApi("/api/billing/bills");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bills</h1>

      {loading ? (
        <p>Loading bills...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Meter</TableHead>
              <TableHead>Utility</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bills.map((b) => (
              <TableRow key={b.id}>
                <TableCell>#{b.id}</TableCell>
                <TableCell>{b.customer_name || 'N/A'}</TableCell>
                <TableCell>{b.meter_number || 'N/A'}</TableCell>
                <TableCell>{b.utility_type || 'N/A'}</TableCell>
                <TableCell>{b.billing_date ? new Date(b.billing_date).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>Rs. {parseFloat(b.bill_amount || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={
                    b.status === "PAID"
                      ? "success"
                      : b.status === "PARTIALLY PAID"
                        ? "warning"
                        : "destructive"
                  }>
                    {b.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/billing/bills/${b.id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {bills.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  No bills found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
