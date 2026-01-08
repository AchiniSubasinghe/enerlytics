import { db } from "@/lib/db";
import { created, badRequest, error } from "@/lib/api-response";

export async function POST(req) {
    try {
        const { meterNumber, status, utilityType } = await req.json();

        if (!meterNumber || !utilityType) {
            return badRequest("Meter number and utility type are required");
        }

        const unitMap = {
            ELECTRICITY: "kWh",
            WATER: "m³",
            GAS: "m³",
        };

        const unit = unitMap[utilityType];
        if (!unit) {
            return badRequest("Invalid utility type");
        }

        await db.query(
            "INSERT INTO meters (meter_number, status, utility_type, unit) VALUES (?, ?, ?, ?)",
            [meterNumber, status || "ACTIVE", utilityType, unit]
        );

        return created({ message: "Meter added successfully" });
    } catch (err) {
        return error(err.message);
    }
}