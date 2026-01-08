import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { success, unauthorized, forbidden, error } from "@/lib/api-response";

export async function GET(req) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return unauthorized();
    }

    if (user.role !== "METER_READER") {
      return forbidden();
    }

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
      [user.id]
    );

    return success(rows);
  } catch (err) {
    return error(err.message);
  }
}
