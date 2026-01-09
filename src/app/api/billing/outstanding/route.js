import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, error, unauthorized } from "@/lib/api-response";

export async function GET(req) {
    const user = requireRole(req, [ROLES.CASHIER, ROLES.ADMIN, ROLES.MANAGER]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        // Get all bills with their payment totals
        const [bills] = await db.query(
            `SELECT 
                b.id,
                b.bill_amount,
                b.status,
                b.createdAt as billing_date,
                c.name as customer_name,
                c.email as customer_email,
                c.phone as customer_phone,
                m.meter_number,
                m.utility_type,
                COALESCE(SUM(p.amount), 0) as total_paid
            FROM bills b
            LEFT JOIN customers c ON b.customer_id = c.id
            LEFT JOIN meters m ON b.meter_id = m.id
            LEFT JOIN payments p ON b.id = p.bill_id
            WHERE b.status IN ('NOT PAID', 'PARTIALLY PAID')
            GROUP BY b.id
            HAVING (b.bill_amount - COALESCE(SUM(p.amount), 0)) > 0
            ORDER BY b.createdAt DESC`
        );

        // Calculate outstanding for each bill
        const outstanding = bills.map(bill => ({
            ...bill,
            outstanding: parseFloat(bill.bill_amount) - parseFloat(bill.total_paid)
        }));

        return success(outstanding);
    } catch (err) {
        return error(err.message);
    }
}
