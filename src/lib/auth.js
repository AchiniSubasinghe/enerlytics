import jwt from "jsonwebtoken";

export function getUserFromRequest(req) {
   const cookie = req.headers.get("cookie");

   if (!cookie) return null;

   const tokenMatch = cookie
      .split(";")
      .find((c) => c.trim().startsWith("token="));

   if (!tokenMatch) return null;

   const token = tokenMatch.split("=")[1];

   try {
      return jwt.verify(token, process.env.JWT_SECRET);
   } catch (err) {
      return null;
   }
}
