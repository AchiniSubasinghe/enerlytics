import { db } from "@/lib/db";
import { created, badRequest, error } from "@/lib/api-response";

export async function POST(req) {
  try {
    const { name, email, phone, nic, address, customerType } = await req.json();

    if (!name || !email) {
      return badRequest("Name and email are required");
    }

    await db.query(
      "INSERT INTO customers (name, email, phone, nic, address, customer_type) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone || null, nic || null, address || null, customerType || "HOUSEHOLD"]
    );

    return created({ message: "Customer added successfully" });
  } catch (err) {
    return error(err.message);
  }
}
