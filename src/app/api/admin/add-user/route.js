import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { created, badRequest, conflict, error, unauthorized } from "@/lib/api-response";

export async function POST(request) {
    const user = requireRole(request, [ROLES.ADMIN]);
    if (!user) {
        return unauthorized("Only administrators can create users");
    }

    try {
        const { fullname, email, password, phone, nic, role } = await request.json();

        if (!fullname || !email || !password || !role) {
            return badRequest("Fullname, email, password, and role are required");
        }

        const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

        if (existing.length > 0) {
            return conflict("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (name, email, password, role, phone, nic) VALUES (?, ?, ?, ?, ?, ?)",
            [fullname, email, hashedPassword, role, phone || null, nic || null]
        );

        return created({ message: "User added successfully" });
    } catch (err) {
        return error(err.message);
    }
}