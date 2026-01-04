//   GET (list), POST (create)

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
   try {
      const { name, utilityType, status, slabs } = await req.json();

      // Insert tariff
      const [result] = await db.query(
         "INSERT INTO tariffs (name, utility_type, status) VALUES (?, ?, ?)",
         [name, utilityType, status]
      );

      const tariffId = result.insertId;

      // Insert slabs
      for (const slab of slabs) {
         await db.query(
            `INSERT INTO tariff_slabs 
         (tariff_id, min_units, max_units, rate_per_unit, fixed_charge)
         VALUES (?, ?, ?, ?, ?)`,
            [
               tariffId,
               slab.min,
               slab.max,
               slab.rate,
               slab.fixed || 0,
            ]
         );
      }

      return NextResponse.json({ message: "Tariff created" });
   } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Failed" }, { status: 500 });
   }
}

export async function GET() {
   const [rows] = await db.query("SELECT * FROM tariffs");
   return NextResponse.json(rows);
}

