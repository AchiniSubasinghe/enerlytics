import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, error, unauthorized, badRequest, created } from "@/lib/api-response";

// Get payment history
export async function GET(req) {
    const user = requireRole(req, [ROLES.CASHIER, ROLES.ADMIN, ROLES.MANAGER]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        const { searchParams } = new URL(req.url);
        const customerId = searchParams.get('customerId');
        const billId = searchParams.get('billId');

        let query = `
            SELECT 
                p.*,
                b.bill_amount,
                c.name as customer_name,
                m.meter_number,
                m.utility_type
            FROM payments p
            LEFT JOIN bills b ON p.bill_id = b.id
            LEFT JOIN customers c ON b.customer_id = c.id
            LEFT JOIN meters m ON b.meter_id = m.id
        `;

        const params = [];

        if (customerId) {
            query += " WHERE b.customer_id = ?";
            params.push(customerId);
        } else if (billId) {
            query += " WHERE p.bill_id = ?";
            params.push(billId);
        }

        query += " ORDER BY p.payment_date DESC";

        const [payments] = await db.query(query, params);
        return success(payments);
    } catch (err) {
        return error(err.message);
    }
}

// Record a new payment
export async function POST(req) {
    const user = requireRole(req, [ROLES.CASHIER, ROLES.ADMIN]);
    if (!user) {
        return unauthorized("Access denied");
    }

    const connection = await db.getConnection();

    try {
        const { billId, amount, paymentMethod, referenceNumber, notes } = await req.json();

        if (!billId || !amount || !paymentMethod) {
            return badRequest("Bill ID, amount, and payment method are required");
        }

        if (amount <= 0) {
            return badRequest("Payment amount must be greater than zero");
        }

        await connection.beginTransaction();

        // Get bill details
        const [[bill]] = await connection.query(
            "SELECT id, bill_amount, status FROM bills WHERE id = ?",
            [billId]
        );

        if (!bill) {
            await connection.rollback();
            return badRequest("Bill not found");
        }

        // Calculate total paid so far
        const [[paymentTotal]] = await connection.query(
            "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE bill_id = ?",
            [billId]
        );

        const totalPaid = parseFloat(paymentTotal.total);
        const billAmount = parseFloat(bill.bill_amount);
        const newTotal = totalPaid + parseFloat(amount);

        // Validate payment doesn't exceed bill amount
        if (newTotal > billAmount) {
            await connection.rollback();
            return badRequest(`Payment amount exceeds outstanding balance. Outstanding: Rs. ${(billAmount - totalPaid).toFixed(2)}`);
        }

        // Insert payment record
        await connection.query(
            `INSERT INTO payments 
             (bill_id, amount, payment_method, payment_date, reference_number, notes, recorded_by) 
             VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
            [billId, amount, paymentMethod, referenceNumber || null, notes || null, user.id]
        );

        // Update bill status
        let newStatus = 'NOT PAID';
        if (newTotal >= billAmount) {
            newStatus = 'PAID';
        } else if (newTotal > 0) {
            newStatus = 'PARTIALLY PAID';
        }

        await connection.query(
            "UPDATE bills SET status = ? WHERE id = ?",
            [newStatus, billId]
        );

        await connection.commit();

        return created({
            message: "Payment recorded successfully",
            billStatus: newStatus,
            totalPaid: newTotal,
            outstanding: billAmount - newTotal
        });
    } catch (err) {
        await connection.rollback();
        return error(err.message);
    } finally {
        connection.release();
    }
}
