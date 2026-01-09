"use client";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function RevenueReports() {
  const { data, loading } = useApi("/api/manager/revenue");

  if (loading) {
    return <div className="p-6">Loading revenue data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Revenue Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">Rs. {data?.totalRevenue?.toFixed(2) || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outstanding Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">Rs. {data?.outstandingRevenue?.toFixed(2) || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {data?.totalRevenue && data?.outstandingRevenue
                ? ((data.totalRevenue / (data.totalRevenue + data.outstandingRevenue)) * 100).toFixed(1)
                : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Utility Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utility Type</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Bill Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.revenueByUtility?.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{r.utility_type}</TableCell>
                  <TableCell>Rs. {parseFloat(r.revenue).toFixed(2)}</TableCell>
                  <TableCell>{r.bill_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyRevenue.reverse()}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
