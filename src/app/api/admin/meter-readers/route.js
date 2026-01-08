import { db } from "@/lib/db";
import { success, error } from "@/lib/api-response";

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS count FROM users WHERE role = 'METER_READER'"
    );
    return success({ count: rows[0].count });
  } catch (err) {
    return error(err.message);
  }
}
