import { db } from "@/lib/db";
import { success, created, error } from "@/lib/api-response";

export async function GET() {
   try {
      const [rows] = await db.query("SELECT * FROM tariffs");
      return success(rows);
   } catch (err) {
      return error(err.message);
   }
}

export async function POST(req) {
   try {
      const { name, utilityType, status, slabs } = await req.json();

      const [result] = await db.query(
         "INSERT INTO tariffs (name, utility_type, status) VALUES (?, ?, ?)",
         [name, utilityType, status]
      );

      const tariffId = result.insertId;

      for (const slab of slabs) {
         await db.query(
            "INSERT INTO tariff_slabs (tariff_id, min_units, max_units, rate_per_unit, fixed_charge) VALUES (?, ?, ?, ?, ?)",
            [tariffId, slab.min, slab.max, slab.rate, slab.fixed || 0]
         );
      }

      return created({ message: "Tariff created" });
   } catch (err) {
      return error(err.message);
   }
}

