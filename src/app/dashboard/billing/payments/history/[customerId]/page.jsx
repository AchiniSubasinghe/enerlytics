"use client";

import { useParams } from "next/navigation";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";

export default function PaymentHistory() {
  const params = useParams();
  const { data: payments = [], loading } = useApi(`/api/billing/payments?customerId=${params.customerId}`);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>

      {loading ? (
        <p>Loading payment history...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Bill ID</TableHead>
              <TableHead>Meter</TableHead>
              <TableHead>Utility</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>#{p.bill_id}</TableCell>
                <TableCell>{p.meter_number || 'N/A'}</TableCell>
                <TableCell>{p.utility_type || 'N/A'}</TableCell>
                <TableCell className="font-semibold text-green-600">
                  Rs. {parseFloat(p.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{p.payment_method}</Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {p.reference_number || '-'}
                </TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No payment history found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
