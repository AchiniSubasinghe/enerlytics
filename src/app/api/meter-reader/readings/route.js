import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { success, unauthorized, badRequest, forbidden, error } from "@/lib/api-response";

export async function POST(req) {
  try {
    const user = getUserFromRequest(req);

    if (!user || user.role !== "METER_READER") {
      return unauthorized();
    }

    const { meterId, currentReading } = await req.json();

    if (!meterId || currentReading === null) {
      return badRequest("Meter ID and current reading required");
    }

    const [[assignment]] = await db.query(
      "SELECT id FROM meter_reader_assignments WHERE meter_reader_id = ? AND meter_id = ? AND status = 'PENDING'",
      [user.id, meterId]
    );

    if (!assignment) {
      return forbidden("Meter not assigned or already completed");
    }

    const [[last]] = await db.query(
      "SELECT current_reading FROM meter_readings WHERE meter_id = ? ORDER BY reading_date DESC LIMIT 1",
      [meterId]
    );

    const previous = last?.current_reading ?? 0;

    if (currentReading < previous) {
      return badRequest("Current reading cannot be less than previous");
    }

    const unitsUsed = currentReading - previous;

    await db.query(
      "INSERT INTO meter_readings (meter_id, reading_date, previous_reading, current_reading, units_used, bill_amount) VALUES (?, CURDATE(), ?, ?, ?, 0)",
      [meterId, previous, currentReading, unitsUsed]
    );

    await db.query(
      "UPDATE meter_reader_assignments SET status = 'COMPLETED' WHERE meter_reader_id = ? AND meter_id = ?",
      [user.id, meterId]
    );

    return success({ message: "Reading saved successfully" });
  } catch (err) {
    return error(err.message);
  }
}

