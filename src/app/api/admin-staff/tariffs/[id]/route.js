import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET ONE tariff (for Edit)
export async function GET(req, { params }) {
   const { id } = await params;

   try {
      const [[tariff]] = await db.query(
         "SELECT * FROM tariffs WHERE id = ?",
         [id]
      );

      if (!tariff) {
         return NextResponse.json(
            { error: "Tariff not found" },
            { status: 404 }
         );
      }

      const [slabs] = await db.query(
         "SELECT * FROM tariff_slabs WHERE tariff_id = ?",
         [id]
      );

      return NextResponse.json({ tariff, slabs });
   } catch (err) {
      console.error("GET tariff error:", err);
      return NextResponse.json(
         { error: "Server error" },
         { status: 500 }
      );
   }
}

// UPDATE tariff
export async function PUT(req, { params }) {
   const { id } = await params; 
   const { name, status, slabs } = await req.json();

   await db.query(
      "UPDATE tariffs SET name = ?, status = ? WHERE id = ?",
      [name, status, id]
   );

   await db.query("DELETE FROM tariff_slabs WHERE tariff_id = ?", [id]);

   for (const slab of slabs) {
      await db.query(
         `INSERT INTO tariff_slabs
       (tariff_id, min_units, max_units, rate_per_unit, fixed_charge)
       VALUES (?, ?, ?, ?, ?)`,
         [id, slab.min, slab.max, slab.rate, slab.fixed || 0]
      );
   }

   return NextResponse.json({ message: "Tariff updated" });
}

// ENABLE / DISABLE
export async function PATCH(req, { params }) {
   const { id } = await params;
   const { status } = await req.json();

   await db.query(
      "UPDATE tariffs SET status = ? WHERE id = ?",
      [status, id]
   );

   return NextResponse.json({ message: "Status updated" });
}

