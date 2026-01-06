// Get assigned meter details
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const user = getUserFromRequest(req);

    if (!user || user.role !== "METER_READER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

     const { meterId } = await params;


    // Ensure meter belongs to this reader & still pending
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
      return NextResponse.json(
        { error: "Meter not assigned" },
        { status: 404 }
      );
    }

    // Get last reading (if any)
    const [[last]] = await db.query(
      `
      SELECT current_reading
      FROM meter_readings
      WHERE meter_id = ?
      ORDER BY reading_date DESC
      LIMIT 1
      `,
      [meterId]
    );

    return NextResponse.json({
      meter,
      previousReading: last?.current_reading ?? 0, //default 0
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
