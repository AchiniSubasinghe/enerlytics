// this is for get unassigned meters for meter-readers when assigning
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT m.id, m.meter_number
      FROM meters m
      LEFT JOIN meter_reader_assignments mra
        ON m.id = mra.meter_id
        AND mra.status = 'PENDING'
      WHERE mra.meter_id IS NULL
      ORDER BY m.created_at DESC
    `);

    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch unassigned meters" },
      { status: 500 }
    );
  }
}
