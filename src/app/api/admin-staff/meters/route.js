import { db } from "@/lib/db";
import { success, error } from "@/lib/api-response";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        m.id,
        m.meter_number,
        m.status,
        m.utility_type,
        m.unit,
        c.name AS customer_name
      FROM meters m
      LEFT JOIN meter_customer_assignments a
        ON m.id = a.meter_id AND a.unassigned_at IS NULL
      LEFT JOIN customers c
        ON a.customer_id = c.id
      ORDER BY m.created_at DESC
    `);

    return success(rows);
  } catch (err) {
    return error(err.message);
  }
}
