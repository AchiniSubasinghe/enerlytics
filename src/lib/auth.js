import jwt from "jsonwebtoken";
import { hasPermission } from "./rbac";

export function getUserFromRequest(req) {
   const cookie = req.headers.get("cookie");
   if (!cookie) return null;

   const tokenMatch = cookie.split(";").find((c) => c.trim().startsWith("token="));
   if (!tokenMatch) return null;

   try {
      return jwt.verify(tokenMatch.split("=")[1], process.env.JWT_SECRET);
   } catch {
      return null;
   }
}

export function generateToken(user) {
   return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
   );
}

// Check if user has required role
export function requireRole(req, allowedRoles) {
   const user = getUserFromRequest(req);
   if (!user || !allowedRoles.includes(user.role)) {
      return null;
   }
   return user;
}

// Check if user has permission for a specific action
export function requirePermission(req, resource, action) {
   const user = getUserFromRequest(req);
   if (!user) return null;

   if (hasPermission(user.role, resource, action)) {
      return user;
   }

   return null;
