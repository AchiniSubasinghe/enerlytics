import { db } from "@/lib/db";
import { success, error } from "@/lib/api-response";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT m.id, m.meter_number
      FROM meters m
      LEFT JOIN meter_customer_assignments mca
        ON m.id = mca.meter_id AND mca.unassigned_at IS NULL
      WHERE mca.meter_id IS NULL
    `);
    return success(rows);
  } catch (err) {
    return error(err.message);
  }
}


