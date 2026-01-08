import { db } from "@/lib/db";
import { created, badRequest, conflict, error } from "@/lib/api-response";

export async function POST(req) {
    try {
        const { meterId, meterReaderId } = await req.json();

        if (!meterId || !meterReaderId) {
            return badRequest("Meter and Meter Reader are required");
        }

        const [existing] = await db.query(
            "SELECT id FROM meter_reader_assignments WHERE meter_id = ?",
            [meterId]
        );

        if (existing.length > 0) {
            return conflict("Meter already assigned");
        }

        const period = new Date().toISOString().slice(0, 7);

        await db.query(
            "INSERT INTO meter_reader_assignments (meter_id, meter_reader_id, period, status) VALUES (?, ?, ?, 'PENDING')",
            [meterId, meterReaderId, period]
        );

        return created({ message: "Meter assigned successfully" });
    } catch (err) {
        return error(err.message);
    }
}
