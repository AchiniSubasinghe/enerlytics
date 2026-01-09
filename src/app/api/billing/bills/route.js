import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, error, unauthorized } from "@/lib/api-response";

export async function GET(req) {
    const user = requireRole(req, [ROLES.CASHIER, ROLES.ADMIN]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
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
                m.meter_number,
                m.utility_type
            FROM bills b
            LEFT JOIN customers c ON b.customer_id = c.id
            LEFT JOIN meters m ON b.meter_id = m.id
            ORDER BY b.createdAt DESC`
        );

        return success(bills);
    } catch (err) {
        return error(err.message);
    }
}
