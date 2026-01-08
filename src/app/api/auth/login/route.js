import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { success, error, unauthorized, notFound } from "@/lib/api-response";

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return notFound("User not found");
        }

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return unauthorized("Invalid password");
        }

        const token = generateToken(user);
        return success({ token, role: user.role });
    } catch (err) {
        return error(err.message);
    }
}