"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";

export default function BillDetails() {
  const params = useParams();
  const { data: bill, loading } = useApi(`/api/billing/bills/${params.billId}`);

  if (loading) {
    return <div className="p-6">Loading bill details...</div>;
  }

  if (!bill) {
    return <div className="p-6">Bill not found</div>;
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bill Details</h1>
        <Badge variant={
          bill.status === "PAID"
            ? "success"
            : bill.status === "PARTIALLY PAID"
              ? "warning"
              : "destructive"
        }>
          {bill.status}
        </Badge>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="font-semibold text-lg border-b pb-2">Customer Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{bill.customer_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{bill.customer_email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-medium">{bill.customer_address || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{bill.customer_phone || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="font-semibold text-lg border-b pb-2">Meter & Usage Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Meter Number</p>
            <p className="font-medium">{bill.meter_number || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Utility Type</p>
            <p className="font-medium">{bill.utility_type || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Previous Reading</p>
            <p className="font-medium">{bill.previous_reading}</p>
          </div>
          <div>
            <p className="text-gray-500">Current Reading</p>
            <p className="font-medium">{bill.current_reading}</p>
          </div>
          <div>
            <p className="text-gray-500">Units Consumed</p>
            <p className="font-medium">{bill.units_used}</p>
          </div>
          <div>
            <p className="text-gray-500">Billing Date</p>
            <p className="font-medium">
              {bill.billing_date ? new Date(bill.billing_date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="font-semibold text-lg border-b pb-2">Billing Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Bill Amount:</span>
            <span className="font-semibold">Rs. {parseFloat(bill.bill_amount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Total Paid:</span>
            <span className="font-semibold">
              Rs. {(parseFloat(bill.bill_amount) - parseFloat(bill.outstanding || 0)).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold text-red-600 border-t pt-2">
            <span>Outstanding:</span>
            <span>Rs. {parseFloat(bill.outstanding || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {bill.payments && bill.payments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Payment History</h2>
          <div className="space-y-2">
            {bill.payments.map((payment, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Rs. {parseFloat(payment.amount).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.payment_date).toLocaleDateString()} - {payment.payment_method}
                  </p>
                  {payment.reference_number && (
                    <p className="text-xs text-gray-400">Ref: {payment.reference_number}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {parseFloat(bill.outstanding || 0) > 0 && (
        <Link href={`/dashboard/billing/payments/add/${bill.id}`}>
          <Button className="w-full">Record Payment</Button>
        </Link>
      )}
    </div>
  );
}
