import { db } from "@/lib/db";
import { success, notFound, error } from "@/lib/api-response";

export async function GET(req, context) {
    try {
        const { id } = await context.params;
        const [rows] = await db.query("SELECT * FROM complaints WHERE id = ?", [id]);

        if (rows.length === 0) {
            return notFound("Complaint not found");
        }

        return success(rows[0]);
    } catch (err) {
        return error(err.message);
    }
}

export async function PUT(req, context) {
    try {
        const { id } = await context.params;
        const { user_id, complaint_text } = await req.json();

        const [result] = await db.query(
            "UPDATE complaints SET user_id=?, complaint_text=? WHERE id=?",
            [user_id, complaint_text, id]
        );

        if (result.affectedRows === 0) {
            return notFound("Complaint not found");
        }

        return success({ message: "Complaint updated successfully" });
    } catch (err) {
        return error(err.message);
    }
}

export async function DELETE(req, context) {
    try {
        const { id } = await context.params;
        const [result] = await db.query("DELETE FROM complaints WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return notFound("Complaint not found");
        }

        return success({ message: "Complaint deleted successfully" });
    } catch (err) {
        return error(err.message);
    }
}
