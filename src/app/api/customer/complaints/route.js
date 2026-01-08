import { db } from "@/lib/db";

export async function GET() {
    try {
        const [rows] = await db.query("SELECT * FROM complaints");
        return Response.json(rows, { status: 200 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { user_id, complaint_text } = await req.json();

        if (!complaint_text) {
            return Response.json(
                { error: "Complaint text is required" },
                { status: 400 }
            );
        }

        const [result] = await db.query(
            "INSERT INTO complaints (user_id, complaint_text) VALUES (?, ?)",
            [user_id, complaint_text]
        );

        return Response.json(
            { message: "Complaint created successfully", id: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
