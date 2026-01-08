import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { success, unauthorized, error } from "@/lib/api-response";

export async function GET(req) {
   try {
      const user = getUserFromRequest(req);

      if (!user || user.role !== "METER_READER") {
         return unauthorized();
      }

      const [rows] = await db.query(
         `
      SELECT
        mr.reading_date,
        mr.previous_reading,
        mr.current_reading,
        mr.units_used,
        mr.bill_amount,
        m.meter_number,
        m.utility_type
      FROM meter_readings mr
      JOIN meters m ON mr.meter_id = m.id
      JOIN meter_reader_assignments mra ON mra.meter_id = m.id
      WHERE mra.meter_reader_id = ?
      ORDER BY mr.reading_date DESC
      `,
         [user.id]
      );

      return success(rows);
   } catch (err) {
      return error(err.message);
   }
}