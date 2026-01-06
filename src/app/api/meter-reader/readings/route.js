// Save meter reading
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = getUserFromRequest(req);

    if (!user || user.role !== "METER_READER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { meterId, currentReading } = await req.json();

    if (!meterId || currentReading === null) {
      return NextResponse.json(
        { error: "Meter ID and current reading required" },
        { status: 400 }
      );
    }

    // Check assignment (must be pending)
    const [[assignment]] = await db.query(
      `
      SELECT id
      FROM meter_reader_assignments
      WHERE meter_reader_id = ?
        AND meter_id = ?
        AND status = 'PENDING'
      `,
      [user.id, meterId]
    );

    if (!assignment) {
      return NextResponse.json(
        { error: "Meter not assigned or already completed" },
        { status: 403 }
      );
    }

    // Get previous reading (or 0)
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

    const previous = last?.current_reading ?? 0;

    if (currentReading < previous) {
      return NextResponse.json(
        { error: "Current reading cannot be less than previous" },
        { status: 400 }
      );
    }

    const unitsUsed = currentReading - previous;

    // Insert reading
    await db.query(
      `
      INSERT INTO meter_readings
      (meter_id, reading_date, previous_reading, current_reading, units_used, bill_amount)
      VALUES (?, CURDATE(), ?, ?, ?, 0)
      `,
      [meterId, previous, currentReading, unitsUsed]
    );

    // Mark assignment completed
    await db.query(
      `
      UPDATE meter_reader_assignments
      SET status = 'COMPLETED'
      WHERE meter_reader_id = ? AND meter_id = ?
      `,
      [user.id, meterId]
    );

    return NextResponse.json({ message: "Reading saved successfully" });
  } catch (err) {
    console.error("Add reading error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

