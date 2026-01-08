import { db } from "@/lib/db";
import { success, error } from "@/lib/api-response";

export async function GET() {
    try {
        const [[customers]] = await db.query("SELECT COUNT(*) AS count FROM customers");
        const [[meters]] = await db.query("SELECT COUNT(*) AS count FROM meters");
        const [[readers]] = await db.query(
            "SELECT COUNT(*) AS count FROM users WHERE role = 'METER_READER'"
        );

        const [utilityCounts] = await db.query(
            "SELECT utility_type, COUNT(*) AS count FROM meters GROUP BY utility_type"
        );

        const utilityStats = { ELECTRICITY: 0, WATER: 0, GAS: 0 };
        utilityCounts.forEach((row) => {
            utilityStats[row.utility_type] = row.count;
        });

        return success({
            customers: customers.count,
            meters: meters.count,
            meterReaders: readers.count,
            electricityMeters: utilityStats.ELECTRICITY,
            waterMeters: utilityStats.WATER,
            gasMeters: utilityStats.GAS,
        });
    } catch (err) {
        return error(err.message);
    }
}
