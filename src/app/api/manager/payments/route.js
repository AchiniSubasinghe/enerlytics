import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, error, unauthorized } from "@/lib/api-response";

// Payment analytics
export async function GET(req) {
    const user = requireRole(req, [ROLES.MANAGER, ROLES.ADMIN]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        // Payments by method
        const [paymentsByMethod] = await db.query(
            `SELECT 
                payment_method,
                COUNT(*) as count,
                SUM(amount) as total_amount
             FROM payments
             GROUP BY payment_method
             ORDER BY total_amount DESC`
        );

        // Recent payments
        const [recentPayments] = await db.query(
            `SELECT 
                p.*,
                c.name as customer_name,
                b.bill_amount,
                m.meter_number,
                m.utility_type
             FROM payments p
             JOIN bills b ON p.bill_id = b.id
             JOIN customers c ON b.customer_id = c.id
             JOIN meters m ON b.meter_id = m.id
             ORDER BY p.payment_date DESC
             LIMIT 20`
        );

        // Daily payment trends (last 30 days)
        const [dailyPayments] = await db.query(
            `SELECT 
                DATE(payment_date) as date,
                COUNT(*) as payment_count,
                SUM(amount) as total_amount
             FROM payments
             WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
             GROUP BY DATE(payment_date)
             ORDER BY date DESC`
        );

        return success({
            paymentsByMethod,
            recentPayments,
            dailyPayments
        });
    } catch (err) {
        return error(err.message);
    }
}
