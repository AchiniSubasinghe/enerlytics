"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function CustomerComplaintsPage() {
    const router = useRouter();
    const { data: complaints, loading } = useApi("/api/customer/complaints");

    const complaintsList = complaints || [];

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-500";
            case "IN_PROGRESS":
                return "bg-blue-500";
            case "RESOLVED":
                return "bg-green-500";
            case "CLOSED":
                return "bg-gray-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Complaints</h1>
                <Button onClick={() => router.push("/dashboard/customer/complaints/new")}>
                    New Complaint
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Complaint History</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-gray-500">Loading complaints...</p>
                    ) : complaintsList.length === 0 ? (
                        <p className="text-gray-500">No complaints found</p>
                    ) : (
                        <div className="space-y-4">
                            {complaintsList.map((complaint) => (
                                <div
                                    key={complaint.id}
                                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() => router.push(`/dashboard/customer/complaints/${complaint.id}`)}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold">{complaint.subject}</h3>
                                            <Badge className={getStatusColor(complaint.status)}>
                                                {complaint.status.replace("_", " ")}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                            {complaint.complaint_text}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Submitted: {new Date(complaint.created_at).toLocaleString()}
                                        </p>
                                        {complaint.response && (
                                            <p className="text-xs text-green-600 mt-1">
                                                ✓ Response received
                                            </p>
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
