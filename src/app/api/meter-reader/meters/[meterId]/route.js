import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { success, unauthorized, notFound, error } from "@/lib/api-response";

export async function GET(req, { params }) {
  try {
    const user = getUserFromRequest(req);

    if (!user || user.role !== "METER_READER") {
      return unauthorized();
    }

    const { meterId } = await params;

    const [[meter]] = await db.query(
      `
      SELECT m.id, m.meter_number, m.utility_type
      FROM meter_reader_assignments mra
      JOIN meters m ON mra.meter_id = m.id
      WHERE mra.meter_reader_id = ?
        AND mra.meter_id = ?
        AND mra.status = 'PENDING'
      `,
      [user.id, meterId]
    );

    if (!meter) {
      return notFound("Meter not assigned");
    }

    const [[last]] = await db.query(
      "SELECT current_reading FROM meter_readings WHERE meter_id = ? ORDER BY reading_date DESC LIMIT 1",
      [meterId]
    );

    return success({
      meter,
      previousReading: last?.current_reading ?? 0,
    });
  } catch (err) {
    return error(err.message);
  }
}
