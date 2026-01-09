"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useApi } from "@/hooks/use-api";

export default function RecordPayment() {
  const params = useParams();
  const router = useRouter();
  const { data: bill, loading } = useApi(`/api/billing/bills/${params.billId}`);

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (bill && parseFloat(bill.outstanding) > 0) {
      setAmount(bill.outstanding.toString());
    }
  }, [bill]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid payment amount");
      return;
    }

    if (bill && parseFloat(amount) > parseFloat(bill.outstanding)) {
      setError(`Payment exceeds outstanding amount of Rs. ${parseFloat(bill.outstanding).toFixed(2)}`);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/billing/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billId: params.billId,
          amount: parseFloat(amount),
          paymentMethod,
          referenceNumber: referenceNumber || null,
          notes: notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to record payment");
        setSubmitting(false);
        return;
      }

      setSuccess(`Payment recorded successfully! Bill status: ${data.billStatus}`);
      setTimeout(() => {
        router.push(`/dashboard/billing/bills/${params.billId}`);
      }, 2000);
    } catch (err) {
      setError("An error occurred while recording payment");
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading bill details...</div>;
  }

  if (!bill) {
    return <div className="p-6">Bill not found</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Record Payment</h1>

      <div className="bg-white p-4 rounded-lg shadow space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Bill ID:</span>
          <span className="font-medium">#{bill.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Customer:</span>
          <span className="font-medium">{bill.customer_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Total Amount:</span>
          <span className="font-medium">Rs. {parseFloat(bill.bill_amount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span className="text-red-600">Outstanding:</span>
          <span className="text-red-600">Rs. {parseFloat(bill.outstanding).toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <Label htmlFor="amount">Payment Amount *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            max={bill.outstanding}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>

        <div>
          <Label htmlFor="paymentMethod">Payment Method *</Label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="ONLINE">Online Transfer</option>
            <option value="CHEQUE">Cheque</option>
            <option value="MOBILE_PAYMENT">Mobile Payment</option>
          </select>
        </div>

        {(paymentMethod === "ONLINE" || paymentMethod === "CARD" || paymentMethod === "CHEQUE") && (
          <div>
            <Label htmlFor="referenceNumber">Reference/Transaction Number</Label>
            <Input
              id="referenceNumber"
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter reference number"
            />
          </div>
        )}

        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Additional notes..."
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
            {submitting ? "Recording..." : "Record Payment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
