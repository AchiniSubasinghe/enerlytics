import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, error, unauthorized, notFound } from "@/lib/api-response";

export async function GET(req, { params }) {
    const user = requireRole(req, [ROLES.CASHIER, ROLES.ADMIN]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        const { billId } = await params;

        const [bills] = await db.query(
            `SELECT 
                b.id,
                b.meter_id,
                b.customer_id,
                b.previous_reading,
                b.current_reading,
                b.units_used,
                b.bill_amount,
                b.status,
                b.createdAt as billing_date,
                c.name as customer_name,
                c.email as customer_email,
                c.address as customer_address,
                c.phone as customer_phone,
                m.meter_number,
                m.utility_type
            FROM bills b
            LEFT JOIN customers c ON b.customer_id = c.id
            LEFT JOIN meters m ON b.meter_id = m.id
            WHERE b.id = ?`,
            [billId]
        );

        if (bills.length === 0) {
            return notFound("Bill not found");
        }

        // Get payment history for this bill
        const [payments] = await db.query(
            `SELECT * FROM payments 
             WHERE bill_id = ? 
             ORDER BY payment_date DESC`,
            [billId]
        );

        const bill = bills[0];
        bill.payments = payments;

        // Calculate outstanding amount
        const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        bill.outstanding = parseFloat(bill.bill_amount) - totalPaid;

        return success(bill);
    } catch (err) {
        return error(err.message);
    }
}
