"use client";

import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CustomerMetersPage() {
    const { data: meters, loading } = useApi("/api/customer/meters");

    const metersList = meters || [];

    const getStatusColor = (status) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-500";
            case "INACTIVE":
                return "bg-gray-500";
            case "MAINTENANCE":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    const getUtilityIcon = (type) => {
        switch (type) {
            case "ELECTRICITY":
                return "⚡";
            case "WATER":
                return "💧";
            case "GAS":
                return "🔥";
            default:
                return "📊";
        }
    };

    const activeMeters = metersList.filter((meter) => meter.status === "ACTIVE");
    const inactiveMeters = metersList.filter((meter) => meter.status === "INACTIVE");

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">My Meters</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Meters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{metersList.length}</p>
                        <p className="text-sm text-gray-500 mt-2">Registered meters</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Meters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            {activeMeters.length}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Currently active</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Inactive Meters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-gray-600">
                            {inactiveMeters.length}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Not in use</p>
                    </CardContent>
                </Card>
            </div>

            {/* Meters List */}
            <Card>
                <CardHeader>
                    <CardTitle>Meter Details</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-gray-500">Loading meters...</p>
                    ) : metersList.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-2">No meters found</p>
                            <p className="text-sm text-gray-400">
                                Contact admin staff to get meters assigned to your account
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {metersList.map((meter) => (
                                <div
                                    key={meter.id}
                                    className="p-5 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="text-3xl">
                                            {getUtilityIcon(meter.utility_type)}
                                        </div>
                                        <Badge className={getStatusColor(meter.status)}>
                                            {meter.status}
                                        </Badge>
                                    </div>

                                    <h3 className="font-bold text-lg mb-1">
                                        {meter.meter_number}
                                    </h3>

                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">Utility Type</p>
                                            <p className="font-medium">{meter.utility_type}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Unit</p>
                                            <p className="font-medium">{meter.unit}</p>
                                        </div>
                                        {meter.created_at && (
                                            <div>
                                                <p className="text-gray-500">Registered</p>
                                                <p className="font-medium">
                                                    {new Date(meter.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
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
