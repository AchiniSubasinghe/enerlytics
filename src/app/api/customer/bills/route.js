import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, error, unauthorized } from "@/lib/api-response";

export async function GET(req) {
    const user = requireRole(req, [ROLES.CUSTOMER]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        // Get customer ID from user
        const [customers] = await db.query(
            "SELECT id FROM customers WHERE email = ?",
            [user.email]
        );

        if (customers.length === 0) {
            return success([]);
        }

        const customerId = customers[0].id;

        // Get bills for this customer through meter_customer_assignments
        const [bills] = await db.query(
            `SELECT b.*, m.meter_number, m.utility_type 
             FROM bills b
             JOIN meters m ON b.meter_id = m.id
             JOIN meter_customer_assignments mca ON m.id = mca.meter_id
             WHERE mca.customer_id = ? AND mca.unassigned_at IS NULL
             ORDER BY b.createdAt DESC`,
            [customerId]
        );

        return success(bills);
    } catch (err) {
        return error(err.message);
    }
}
