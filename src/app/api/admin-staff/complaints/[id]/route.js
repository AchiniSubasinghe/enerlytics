import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { success, error, unauthorized, notFound, badRequest } from "@/lib/api-response";

export async function GET(req, { params }) {
    const user = requireRole(req, [ROLES.ADMIN_STAFF, ROLES.ADMIN]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        const { id } = await params;

        const [complaints] = await db.query(
            `SELECT 
                c.*,
                cu.name as customer_name,
                cu.email as customer_email,
                cu.phone as customer_phone,
                cu.address as customer_address
            FROM complaints c
            LEFT JOIN customers cu ON c.customer_id = cu.id
            WHERE c.id = ?`,
            [id]
        );

        if (complaints.length === 0) {
            return notFound("Complaint not found");
        }

        return success(complaints[0]);
    } catch (err) {
        return error(err.message);
    }
}

export async function PATCH(req, { params }) {
    const user = requireRole(req, [ROLES.ADMIN_STAFF, ROLES.ADMIN]);
    if (!user) {
        return unauthorized("Access denied");
    }

    try {
        const { id } = await params;
        const { status, response, notes } = await req.json();

        if (!status) {
            return badRequest("Status is required");
        }

        const validStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
        if (!validStatuses.includes(status)) {
            return badRequest("Invalid status");
        }

        await db.query(
            `UPDATE complaints 
             SET status = ?, 
                 response = COALESCE(?, response), 
                 notes = COALESCE(?, notes),
                 updated_at = NOW()
             WHERE id = ?`,
            [status, response, notes, id]
        );

        return success({ message: "Complaint updated successfully" });
    } catch (err) {
        return error(err.message);
    }
}
