"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";

export default function ConsumptionReport() {
  const { data, loading } = useApi("/api/manager/consumption");

  if (loading) {
    return <div className="p-6">Loading consumption data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Consumption Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data?.consumptionByUtility?.map((u, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{u.utility_type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Total Units</p>
                  <p className="text-2xl font-bold">{parseFloat(u.total_units).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Usage</p>
                  <p className="text-lg font-semibold">{parseFloat(u.avg_units).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Readings</p>
                  <p className="text-lg">{u.reading_count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Consumers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Utility Type</TableHead>
                <TableHead>Total Consumption</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.topConsumers?.map((consumer, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{consumer.name}</TableCell>
                  <TableCell>{consumer.email}</TableCell>
                  <TableCell>{consumer.utility_type}</TableCell>
                  <TableCell className="font-bold">{parseFloat(consumer.total_consumption).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
