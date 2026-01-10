"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ComplaintDetailPage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const { data: complaint, loading } = useApi(`/api/customer/complaints/${resolvedParams.id}`);

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

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Loading complaint details...</p>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="p-6">
                <p className="text-red-500">Complaint not found</p>
                <Button onClick={() => router.push("/dashboard/customer/complaints")} className="mt-4">
                    Back to Complaints
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Complaint Details</h1>
                <Button variant="outline" onClick={() => router.push("/dashboard/customer/complaints")}>
                    Back to List
                </Button>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Complaint #{complaint.id}</CardTitle>
                            <Badge className={getStatusColor(complaint.status)}>
                                {complaint.status.replace("_", " ")}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">{complaint.subject}</h3>
                            <p className="text-sm text-gray-500">
                                Submitted on: {new Date(complaint.created_at).toLocaleString()}
                            </p>
                            {complaint.updated_at && complaint.updated_at !== complaint.created_at && (
                                <p className="text-sm text-gray-500">
                                    Last updated: {new Date(complaint.updated_at).toLocaleString()}
                                </p>
                            )}
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Complaint Description</h4>
                            <p className="text-gray-700 whitespace-pre-wrap">{complaint.complaint_text}</p>
                        </div>
                    </CardContent>
                </Card>

                {complaint.response && (
                    <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                            <CardTitle className="text-green-800">Official Response</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-wrap">{complaint.response}</p>
                        </CardContent>
                    </Card>
                )}

                {complaint.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Internal Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-wrap">{complaint.notes}</p>
                        </CardContent>
                    </Card>
                )}

                {!complaint.response && complaint.status === "PENDING" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">
                            Your complaint has been received and is pending review.
                            Our team will respond to you shortly.
                        </p>
                    </div>
                )}

                {complaint.status === "IN_PROGRESS" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm">
                            Your complaint is currently being processed by our team.
                        </p>
                    </div>
                )}

                {complaint.status === "RESOLVED" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 text-sm">
                            This complaint has been resolved. If you need further assistance,
                            please submit a new complaint.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
