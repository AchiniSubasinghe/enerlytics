import { db } from "@/lib/db";
import { success, error } from "@/lib/api-response";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT m.id, m.meter_number
      FROM meters m
      LEFT JOIN meter_reader_assignments mra
        ON m.id = mra.meter_id AND mra.status = 'PENDING'
      WHERE mra.meter_id IS NULL
      ORDER BY m.created_at DESC
    `);
    return success(rows);
  } catch (err) {
    return error(err.message);
  }
}
