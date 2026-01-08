import { db } from "@/lib/db";
import { success, notFound, error } from "@/lib/api-response";

export async function GET(req, context) {
    try {
        const { id } = await context.params;
        const [rows] = await db.query(
            "SELECT id, name, email, phone, nic, role FROM users WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return notFound("User not found");
        }

        return success(rows[0]);
    } catch (err) {
        return error(err.message);
    }
}

export async function PUT(req, context) {
    try {
        const { id } = await context.params;
        const { name, email, phone, nic, role } = await req.json();

        const [result] = await db.query(
            "UPDATE users SET name=?, email=?, phone=?, nic=?, role=? WHERE id=?",
            [name, email, phone, nic, role, id]
        );

        if (result.affectedRows === 0) {
            return notFound("User not found");
        }

        return success({ message: "User updated successfully" });
    } catch (err) {
        return error(err.message);
    }
}

export async function DELETE(req, context) {
    try {
        const { id } = await context.params;
        const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return notFound("User not found");
        }

        return success({ message: "User deleted successfully" });
    } catch (err) {
        return error(err.message);
    }
}
