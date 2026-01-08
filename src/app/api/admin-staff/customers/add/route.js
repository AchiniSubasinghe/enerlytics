import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import { created, badRequest, error, unauthorized, conflict } from "@/lib/api-response";
import bcrypt from "bcryptjs";

// Generate random password
function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(req) {
  const user = requireRole(req, [ROLES.ADMIN, ROLES.ADMIN_STAFF]);
  if (!user) {
    return unauthorized("Access denied");
  }

  try {
    const { name, email, phone, nic, address, customerType, createLogin } = await req.json();

    if (!name || !email) {
      return badRequest("Name and email are required");
    }

    // Check if customer with this email already exists
    const [existingCustomer] = await db.query(
      "SELECT id FROM customers WHERE email = ?",
      [email]
    );

    if (existingCustomer.length > 0) {
      return conflict("Customer with this email already exists");
    }

    // Insert customer
    await db.query(
      "INSERT INTO customers (name, email, phone, nic, address, customer_type) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone || null, nic || null, address || null, customerType || "HOUSEHOLD"]
    );

    let generatedPassword = null;

    // Create login account if requested
    if (createLogin) {
      // Check if user account already exists
      const [existingUser] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        return conflict("User account with this email already exists");
      }

      // Generate password and hash it
      generatedPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      // Create user account
      await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, ROLES.CUSTOMER]
      );
    }

    return created({
      message: "Customer added successfully",
      password: generatedPassword, // Only set if login was created
    });
  } catch (err) {
    return error(err.message);
  }
}
