import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "METER_READER") {
      return NextResponse.json(
        { error: "Forbidden" }, 
        { status: 403 }
      );
    }

    const meterReaderId = user.id; // FROM JWT

    const [rows] = await db.query(
      `
      SELECT
        m.id,
        m.meter_number,
        m.utility_type,
        c.name AS customer,
        c.address,
        mra.status AS periodStatus
      FROM meter_reader_assignments mra
      JOIN meters m ON mra.meter_id = m.id
      JOIN meter_customer_assignments mca
        ON mca.meter_id = m.id AND mca.unassigned_at IS NULL
      JOIN customers c ON c.id = mca.customer_id
      WHERE mra.meter_reader_id = ?
      `,
      [meterReaderId]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Meter reader meters error:", err);
    return NextResponse.json(
      { error: "Failed to load meters" },
      { status: 500 }
    );
  }
}
