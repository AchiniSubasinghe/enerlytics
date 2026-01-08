import { db } from "@/lib/db";
import { success, error } from "@/lib/api-response";

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email FROM users WHERE role = 'METER_READER' ORDER BY created_at DESC"
    );
    return success(rows);
  } catch (err) {
    return error(err.message);
  }
}

