import { db } from "@/lib/db";
import { created, badRequest, error } from "@/lib/api-response";

export async function POST(req) {
    const connection = await db.getConnection();

    try {
        const { meterId, customerId } = await req.json();

        if (!meterId || !customerId) {
            return badRequest("Meter and Customer are required");
        }

        await connection.beginTransaction();

        await connection.query(
            "UPDATE meter_customer_assignments SET unassigned_at = NOW() WHERE meter_id = ? AND unassigned_at IS NULL",
            [meterId]
        );

        await connection.query(
            "INSERT INTO meter_customer_assignments (meter_id, customer_id) VALUES (?, ?)",
            [meterId, customerId]
        );

        await connection.commit();
        return created({ message: "Meter assigned to customer" });
    } catch (err) {
        await connection.rollback();
        return error(err.message);
    } finally {
        connection.release();
    }
}
