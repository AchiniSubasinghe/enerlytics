"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function NewComplaintPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        subject: "",
        complaint_text: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/customer/complaints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to submit complaint");
            }

            router.push("/dashboard/customer/complaints");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Submit New Complaint</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Complaint Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) =>
                                    setFormData({ ...formData, subject: e.target.value })
                                }
                                placeholder="Brief description of the issue"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="complaint_text">Complaint Details *</Label>
                            <textarea
                                id="complaint_text"
                                value={formData.complaint_text}
                                onChange={(e) =>
                                    setFormData({ ...formData, complaint_text: e.target.value })
                                }
                                placeholder="Please provide detailed information about your complaint..."
                                className="w-full min-h-[150px] px-3 py-2 border rounded-md"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Submitting..." : "Submit Complaint"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/dashboard/customer/complaints")}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
