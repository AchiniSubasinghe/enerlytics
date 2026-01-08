import { db } from "@/lib/db";
import { success, notFound, error } from "@/lib/api-response";

export async function GET(req, { params }) {
   try {
      const { id } = await params;
      const [[tariff]] = await db.query("SELECT * FROM tariffs WHERE id = ?", [id]);

      if (!tariff) {
         return notFound("Tariff not found");
      }

      const [slabs] = await db.query("SELECT * FROM tariff_slabs WHERE tariff_id = ?", [id]);
      return success({ tariff, slabs });
   } catch (err) {
      return error(err.message);
   }
}

export async function PUT(req, { params }) {
   try {
      const { id } = await params;
      const { name, status, slabs } = await req.json();

      await db.query("UPDATE tariffs SET name = ?, status = ? WHERE id = ?", [name, status, id]);
      await db.query("DELETE FROM tariff_slabs WHERE tariff_id = ?", [id]);

      for (const slab of slabs) {
         await db.query(
            "INSERT INTO tariff_slabs (tariff_id, min_units, max_units, rate_per_unit, fixed_charge) VALUES (?, ?, ?, ?, ?)",
            [id, slab.min, slab.max, slab.rate, slab.fixed || 0]
         );
      }

      return success({ message: "Tariff updated" });
   } catch (err) {
      return error(err.message);
   }
}

export async function PATCH(req, { params }) {
   try {
      const { id } = await params;
      const { status } = await req.json();

      await db.query("UPDATE tariffs SET status = ? WHERE id = ?", [status, id]);
      return success({ message: "Status updated" });
   } catch (err) {
      return error(err.message);
   }
}

