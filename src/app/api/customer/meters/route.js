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

        // Get meters for this customer
        const [meters] = await db.query(
            "SELECT * FROM meters WHERE customer_id = ?",
            [customerId]
        );

        return success(meters);
    } catch (err) {
        return error(err.message);
    }
}
