"use client";

import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CustomerBillsPage() {
    const { data: bills, loading } = useApi("/api/customer/bills");

    const billsList = bills || [];

    const getStatusColor = (status) => {
        switch (status) {
            case "NOT PAID":
                return "bg-red-500";
            case "PARTIALLY PAID":
                return "bg-yellow-500";
            case "PAID":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    const totalOutstanding = billsList
        .filter((bill) => bill.status !== "PAID")
        .reduce((sum, bill) => sum + parseFloat(bill.bill_amount || 0), 0);

    const paidBills = billsList.filter((bill) => bill.status === "PAID");
    const unpaidBills = billsList.filter((bill) => bill.status !== "PAID");

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">My Bills</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Outstanding</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-600">
                            Rs. {totalOutstanding.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {unpaidBills.length} unpaid bills
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Bills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{billsList.length}</p>
                        <p className="text-sm text-gray-500 mt-2">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Paid Bills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            {paidBills.length}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Settled bills</p>
                    </CardContent>
                </Card>
            </div>

            {/* Bills List */}
            <Card>
                <CardHeader>
                    <CardTitle>Bill History</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-gray-500">Loading bills...</p>
                    ) : billsList.length === 0 ? (
                        <p className="text-gray-500">No bills found</p>
                    ) : (
                        <div className="space-y-4">
                            {billsList.map((bill) => (
                                <div
                                    key={bill.id}
                                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold">Bill #{bill.id}</h3>
                                            <Badge className={getStatusColor(bill.status)}>
                                                {bill.status}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Billing Date</p>
                                                <p className="font-medium">
                                                    {new Date(bill.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Previous Reading</p>
                                                <p className="font-medium">
                                                    {parseFloat(bill.previous_reading).toFixed(2)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Current Reading</p>
                                                <p className="font-medium">
                                                    {parseFloat(bill.current_reading).toFixed(2)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Units Used</p>
                                                <p className="font-medium">
                                                    {parseFloat(bill.units_used).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-2xl font-bold">
                                            Rs. {parseFloat(bill.bill_amount).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
