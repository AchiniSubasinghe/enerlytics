import { db } from "@/lib/db";
import { success, notFound, error } from "@/lib/api-response";

export async function GET(req, context) {
    try {
        const { id } = await context.params;
        const [rows] = await db.query(
            "SELECT id, name, email, phone, nic FROM customers WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return notFound("Customer not found");
        }

        return success(rows[0]);
    } catch (err) {
        return error(err.message);
    }
}

export async function PUT(req, context) {
    try {
        const { id } = await context.params;
        const { name, email, phone, nic } = await req.json();

        const [result] = await db.query(
            "UPDATE customers SET name=?, email=?, phone=?, nic=? WHERE id=?",
            [name, email, phone, nic, id]
        );

        if (result.affectedRows === 0) {
            return notFound("Customer not found");
        }

        return success({ message: "Customer updated successfully" });
    } catch (err) {
        return error(err.message);
    }
}

export async function DELETE(req, context) {
    try {
        const { id } = await context.params;
        const [result] = await db.query("DELETE FROM customers WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return notFound("Customer not found");
        }

        return success({ message: "Customer deleted successfully" });
    } catch (err) {
        return error(err.message);
    }
}
