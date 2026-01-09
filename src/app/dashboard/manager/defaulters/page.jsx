"use client";

import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";

export default function DefaultersReport() {
  const { data, loading } = useApi("/api/manager/defaulters");

  if (loading) {
    return <div className="p-6">Loading defaulters data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Defaulters Report</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Defaulters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data?.stats?.totalDefaulters || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Outstanding Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              Rs. {data?.stats?.totalOutstanding?.toFixed(2) || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Defaulters List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Unpaid Bills</TableHead>
                <TableHead>Outstanding Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.defaulters?.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.email}</TableCell>
                  <TableCell>{d.phone || 'N/A'}</TableCell>
                  <TableCell>{d.unpaid_bills_count}</TableCell>
                  <TableCell className="font-bold text-red-600">
                    Rs. {parseFloat(d.total_outstanding).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.defaulters || data.defaulters.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No defaulters found
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
