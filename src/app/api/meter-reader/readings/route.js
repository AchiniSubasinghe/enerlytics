import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import {
  success,
  unauthorized,
  badRequest,
  forbidden,
  error,
} from "@/lib/api-response";

export async function POST(req) {
  try {
    const user = getUserFromRequest(req);

    if (!user || user.role !== "METER_READER") {
      return unauthorized();
    }

    const { meterId, currentReading } = await req.json();

    if (!meterId || currentReading === null) {
      return badRequest("Meter ID and current reading required");
    }

    const [[assignment]] = await db.query(
      "SELECT id FROM meter_reader_assignments WHERE meter_reader_id = ? AND meter_id = ? AND status = 'PENDING'",
      [user.id, meterId]
    );

    if (!assignment) {
      return forbidden("Meter not assigned or already completed");
    }

    const [[last]] = await db.query(
      "SELECT current_reading FROM meter_readings WHERE meter_id = ? ORDER BY reading_date DESC LIMIT 1",
      [meterId]
    );

    const previous = last?.current_reading ?? 0;

    if (currentReading < previous) {
      return badRequest("Current reading cannot be less than previous");
    }

    const unitsUsed = currentReading - previous;

    await db.query(
      "INSERT INTO meter_readings (meter_id, reading_date, previous_reading, current_reading, units_used, bill_amount) VALUES (?, CURDATE(), ?, ?, ?, 0)",
      [meterId, previous, currentReading, unitsUsed]
    );

    // Get customer and meter details
    const [[assignment]] = await db.query(
      `SELECT mca.customer_id, c.customer_type, m.utility_type 
       FROM meter_customer_assignments mca
       JOIN customers c ON mca.customer_id = c.id
       JOIN meters m ON mca.meter_id = m.id
       WHERE mca.meter_id = ? AND mca.unassigned_at IS NULL`,
      [meterId]
    );

    const customerId = assignment?.customer_id ?? null;
    const customerType = assignment?.customer_type ?? 'HOUSEHOLD';
    const utilityType = assignment?.utility_type;

    let billAmount = 0;

    if (customerId && utilityType) {
      // Find active tariff for this utility type
      const [[tariff]] = await db.query(
        "SELECT id, fixed_charge FROM tariffs WHERE utility_type = ? AND status = 'ACTIVE' LIMIT 1",
        [utilityType]
      );

      if (tariff) {
        // Get tariff slabs for tiered pricing
        const [slabs] = await db.query(
          "SELECT min_units, max_units, rate_per_unit, fixed_charge FROM tariff_slabs WHERE tariff_id = ? ORDER BY min_units ASC",
          [tariff.id]
        );

        if (slabs.length > 0) {
          // Calculate bill using tiered pricing
          let remainingUnits = unitsUsed;

          for (const slab of slabs) {
            if (remainingUnits <= 0) break;

            const slabMin = parseFloat(slab.min_units);
            const slabMax = slab.max_units ? parseFloat(slab.max_units) : Infinity;
            const slabRange = slabMax - slabMin;

            // Calculate units in this tier
            const unitsInTier = Math.min(remainingUnits, slabRange);

            // Add cost for this tier
            billAmount += unitsInTier * parseFloat(slab.rate_per_unit);

            // Add slab fixed charge if any
            if (slab.fixed_charge) {
              billAmount += parseFloat(slab.fixed_charge);
            }

            remainingUnits -= unitsInTier;
          }

          // Add tariff fixed charge
          if (tariff.fixed_charge) {
            billAmount += parseFloat(tariff.fixed_charge);
          }
        } else {
          // No slabs, use simple calculation with tariff rate
          const [[tariffData]] = await db.query(
            "SELECT rate_per_unit, fixed_charge FROM tariffs WHERE id = ?",
            [tariff.id]
          );

          if (tariffData) {
            billAmount = (unitsUsed * parseFloat(tariffData.rate_per_unit)) + parseFloat(tariffData.fixed_charge || 0);
          }
        }
      } else {
        // Fallback: use default rate if no tariff found
        billAmount = unitsUsed * 155;
      }
    } else {
      // Fallback: use default rate if no customer/utility
      billAmount = unitsUsed * 155;
    }

    // Round to 2 decimal places
    billAmount = Math.round(billAmount * 100) / 100;

    await db.query(
      "INSERT INTO bills (meter_id, customer_id, previous_reading, current_reading, units_used, bill_amount, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())",
      [
        meterId,
        customerId,
        previous,
        currentReading,
        unitsUsed,
        billAmount,
        "NOT PAID",
      ]
    );

    await db.query(
      "UPDATE meter_reader_assignments SET status = 'COMPLETED' WHERE meter_reader_id = ? AND meter_id = ?",
      [user.id, meterId]
    );

    return success({ message: "Reading saved successfully" });
  } catch (err) {
    return error(err.message);
  }
}
