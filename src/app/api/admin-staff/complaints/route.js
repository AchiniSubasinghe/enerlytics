import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, error, unauthorized } from "@/lib/api-response";

export async function GET(req) {
    const user = requireRole(req, [ROLES.ADMIN_STAFF, ROLES.ADMIN]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        const [complaints] = await db.query(
            `SELECT 
                c.*,
                cu.name as customer_name,
                cu.email as customer_email,
                cu.phone as customer_phone
            FROM complaints c
            LEFT JOIN customers cu ON c.customer_id = cu.id
            ORDER BY c.created_at DESC`
        );

        return success(complaints);
    } catch (err) {
        return error(err.message);
    }
}
