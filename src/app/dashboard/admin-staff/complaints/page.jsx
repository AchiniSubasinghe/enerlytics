"use client";

import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { useRouter } from "next/navigation";

export default function ComplaintsPage() {
    const { data: complaints = [], loading, refetch } = useApi("/api/admin-staff/complaints");
    const router = useRouter();
    const [filter, setFilter] = useState("ALL");

    const filteredComplaints = (complaints || []).filter(c =>
        filter === "ALL" || c.status === filter
    );

    const getStatusVariant = (status) => {
        switch (status) {
            case "RESOLVED":
            case "CLOSED":
                return "success";
            case "IN_PROGRESS":
                return "warning";
            case "PENDING":
            default:
                return "destructive";
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Complaint Management</h1>
            </div>

            <div className="flex gap-2">
                {["ALL", "PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"].map(status => (
                    <Button
                        key={status}
                        variant={filter === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(status)}
                    >
                        {status.replace("_", " ")}
                    </Button>
                ))}
            </div>

            {loading ? (
                <p>Loading complaints...</p>
            ) : (
                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredComplaints.map((complaint) => (
                                <TableRow key={complaint.id}>
                                    <TableCell>#{complaint.id}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{complaint.customer_name || 'N/A'}</p>
                                            <p className="text-xs text-gray-500">{complaint.customer_email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="max-w-xs truncate">
                                            {complaint.subject || complaint.complaint_text || 'No subject'}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(complaint.status || 'PENDING')}>
                                            {(complaint.status || 'PENDING').replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {complaint.created_at
                                            ? new Date(complaint.created_at).toLocaleDateString()
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            onClick={() => router.push(`/dashboard/admin-staff/complaints/${complaint.id}`)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredComplaints.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-gray-500">
                                        No complaints found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
