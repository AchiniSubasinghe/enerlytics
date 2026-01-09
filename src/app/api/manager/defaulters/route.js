import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, error, unauthorized } from "@/lib/api-response";

// Defaulters list
export async function GET(req) {
    const user = requireRole(req, [ROLES.MANAGER, ROLES.ADMIN]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        const [defaulters] = await db.query(
            `SELECT 
                c.id,
                c.name,
                c.email,
                c.phone,
                c.address,
                COUNT(DISTINCT b.id) as unpaid_bills_count,
                SUM(b.bill_amount - COALESCE(total_paid, 0)) as total_outstanding
             FROM customers c
             JOIN bills b ON c.id = b.customer_id
             LEFT JOIN (
                 SELECT bill_id, SUM(amount) as total_paid
                 FROM payments
                 GROUP BY bill_id
             ) p ON b.id = p.bill_id
             WHERE b.status IN ('NOT PAID', 'PARTIALLY PAID')
               AND (b.bill_amount - COALESCE(total_paid, 0)) > 0
             GROUP BY c.id
             HAVING total_outstanding > 0
             ORDER BY total_outstanding DESC`
        );

        // Summary statistics
        const [[stats]] = await db.query(
            `SELECT 
                COUNT(DISTINCT c.id) as total_defaulters,
                SUM(b.bill_amount - COALESCE(total_paid, 0)) as total_outstanding_amount
             FROM customers c
             JOIN bills b ON c.id = b.customer_id
             LEFT JOIN (
                 SELECT bill_id, SUM(amount) as total_paid
                 FROM payments
                 GROUP BY bill_id
             ) p ON b.id = p.bill_id
             WHERE b.status IN ('NOT PAID', 'PARTIALLY PAID')
               AND (b.bill_amount - COALESCE(total_paid, 0)) > 0`
        );

        return success({
            defaulters,
            stats: {
                totalDefaulters: parseInt(stats.total_defaulters) || 0,
                totalOutstanding: parseFloat(stats.total_outstanding_amount) || 0
            }
        });
    } catch (err) {
        return error(err.message);
    }
}
