"use client";

import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CustomerDashboard() {
    const { data: bills, loading: billsLoading } = useApi("/api/customer/bills");
    const { data: meters, loading: metersLoading } = useApi("/api/customer/meters");
    const { data: complaints, loading: complaintsLoading } = useApi("/api/customer/complaints");

    const billsList = bills || [];
    const metersList = meters || [];
    const complaintsList = complaints || [];

    const unpaidBills = billsList.filter((bill) => bill.status === "UNPAID");
    const totalOutstanding = unpaidBills.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Outstanding Bills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {billsLoading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : (
                            <>
                                <p className="text-3xl font-bold">Rs. {totalOutstanding.toFixed(2)}</p>
                                <p className="text-sm text-gray-500 mt-2">{unpaidBills.length} unpaid bills</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Meters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {metersLoading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : (
                            <>
                                <p className="text-3xl font-bold">{metersList.length}</p>
                                <p className="text-sm text-gray-500 mt-2">Registered meters</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Complaints</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {complaintsLoading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : (
                            <>
                                <p className="text-3xl font-bold">{complaintsList.length}</p>
                                <p className="text-sm text-gray-500 mt-2">Total complaints</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3"
                                    onClick={() => window.location.href = "/dashboard/customer/complaints"}
                                >
                                    View Complaints
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Bills */}
            <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Bills</CardTitle>
                    <Button variant="outline" size="sm">
                        View All
                    </Button>
                </CardHeader>
                <CardContent>
                    {billsLoading ? (
                        <p className="text-gray-500">Loading bills...</p>
                    ) : billsList.length === 0 ? (
                        <p className="text-gray-500">No bills found</p>
                    ) : (
                        <div className="space-y-4">
                            {billsList.slice(0, 5).map((bill) => (
                                <div
                                    key={bill.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-semibold">Bill #{bill.id}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(bill.billing_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">Rs. {parseFloat(bill.amount || 0).toFixed(2)}</p>
                                        <p
                                            className={`text-sm ${bill.status === "PAID" ? "text-green-600" : "text-red-600"
                                                }`}
                                        >
                                            {bill.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* My Meters */}
            <Card>
                <CardHeader>
                    <CardTitle>My Meters</CardTitle>
                </CardHeader>
                <CardContent>
                    {metersLoading ? (
                        <p className="text-gray-500">Loading meters...</p>
                    ) : metersList.length === 0 ? (
                        <p className="text-gray-500">No meters found</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {metersList.map((meter) => (
                                <div key={meter.id} className="p-4 border rounded-lg">
                                    <p className="font-semibold">Meter #{meter.meter_number}</p>
                                    <p className="text-sm text-gray-500">{meter.utility_type}</p>
                                    <p className="text-sm text-gray-500">Status: {meter.status}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
