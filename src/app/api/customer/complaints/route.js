import { db } from "@/lib/db";
import { success, created, badRequest, error } from "@/lib/api-response";

export async function GET() {
    try {
        const [rows] = await db.query("SELECT * FROM complaints");
        return success(rows);
    } catch (err) {
        return error(err.message);
    }
}

export async function POST(req) {
    try {
        const { user_id, complaint_text } = await req.json();

        if (!complaint_text) {
            return badRequest("Complaint text is required");
        }

        const [result] = await db.query(
            "INSERT INTO complaints (user_id, complaint_text) VALUES (?, ?)",
            [user_id, complaint_text]
        );

        return created({ message: "Complaint created successfully", id: result.insertId });
    } catch (err) {
        return error(err.message);
    }
}
