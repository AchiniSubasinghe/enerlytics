"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#9333ea', '#ec4899'];

export default function PaymentAnalysis() {
  const { data, loading } = useApi("/api/manager/payments");

  if (loading) {
    return <div className="p-6">Loading payment data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payment Analysis</h1>

      <Card>
        <CardHeader>
          <CardTitle>Payments by Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {data?.paymentsByMethod?.map((method, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <Badge variant="outline">{method.payment_method}</Badge>
                    <p className="text-sm text-gray-500 mt-1">{method.count} transactions</p>
                  </div>
                  <p className="text-lg font-bold">Rs. {parseFloat(method.total_amount).toFixed(2)}</p>
                </div>
              ))}
            </div>
            {data?.paymentsByMethod && data.paymentsByMethod.length > 0 && (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.paymentsByMethod}
                    dataKey="total_amount"
                    nameKey="payment_method"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.paymentsByMethod.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Meter</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.recentPayments?.map((payment, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {payment.payment_date
                      ? new Date(payment.payment_date).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="font-medium">{payment.customer_name}</TableCell>
                  <TableCell>{payment.meter_number}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    Rs. {parseFloat(payment.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.payment_method}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {payment.reference_number || '-'}
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.recentPayments || data.recentPayments.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
