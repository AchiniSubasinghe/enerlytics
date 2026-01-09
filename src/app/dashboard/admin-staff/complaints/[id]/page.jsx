"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { useApi } from "@/hooks/use-api";

export default function ComplaintDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { data: complaint, loading } = useApi(`/api/admin-staff/complaints/${params.id}`);

    const [status, setStatus] = useState("");
    const [response, setResponse] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Set initial values when complaint loads
    useState(() => {
        if (complaint) {
            setStatus(complaint.status || "PENDING");
            setResponse(complaint.response || "");
            setNotes(complaint.notes || "");
        }
    }, [complaint]);

    async function handleUpdate(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const res = await fetch(`/api/admin-staff/complaints/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, response, notes }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to update complaint");
                setSubmitting(false);
                return;
            }

            setSuccess("Complaint updated successfully");
            setTimeout(() => {
                router.push("/dashboard/admin-staff/complaints");
            }, 1500);
        } catch (err) {
            setError("An error occurred while updating complaint");
            setSubmitting(false);
        }
    }

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

    if (loading) {
        return <div className="p-6">Loading complaint details...</div>;
    }

    if (!complaint) {
        return <div className="p-6">Complaint not found</div>;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Complaint Details</h1>
                <Badge variant={getStatusVariant(complaint.status || 'PENDING')}>
                    {(complaint.status || 'PENDING').replace("_", " ")}
                </Badge>
            </div>

            <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <h2 className="font-semibold text-lg border-b pb-2">Customer Information</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium">{complaint.customer_name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{complaint.customer_email || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{complaint.customer_phone || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Address</p>
                        <p className="font-medium">{complaint.customer_address || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <h2 className="font-semibold text-lg border-b pb-2">Complaint Details</h2>
                <div className="space-y-3">
                    <div>
                        <p className="text-gray-500 text-sm">Subject</p>
                        <p className="font-medium">{complaint.subject || 'No subject provided'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Description</p>
                        <p className="text-gray-800 whitespace-pre-wrap">
                            {complaint.complaint_text || complaint.description || 'No description provided'}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Created</p>
                            <p className="font-medium">
                                {complaint.created_at
                                    ? new Date(complaint.created_at).toLocaleString()
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Last Updated</p>
                            <p className="font-medium">
                                {complaint.updated_at
                                    ? new Date(complaint.updated_at).toLocaleString()
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow space-y-4">
                <h2 className="font-semibold text-lg border-b pb-2">Update Complaint</h2>

                <div>
                    <Label htmlFor="status">Status *</Label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>

                <div>
                    <Label htmlFor="response">Response to Customer</Label>
                    <textarea
                        id="response"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Enter response to customer..."
                    />
                </div>

                <div>
                    <Label htmlFor="notes">Internal Notes</Label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Add internal notes..."
                    />
                </div>

                {error && <Alert variant="destructive">{error}</Alert>}
                {success && <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">{success}</Alert>}

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => router.back()}
                        disabled={submitting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="flex-1"
                    >
                        {submitting ? "Updating..." : "Update Complaint"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
