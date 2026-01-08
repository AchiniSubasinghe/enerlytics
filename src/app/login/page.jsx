"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { apiCall } from "@/hooks/use-api";
import { useRouter } from "next/navigation";

const ROLE_ROUTES = {
  ADMIN: "/dashboard/admin",
  MANAGER: "/dashboard/manager",
  ADMIN_STAFF: "/dashboard/admin-staff",
  CASHIER: "/dashboard/cashier",
  METER_READER: "/dashboard/meter-reader",
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiCall("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      document.cookie = `token=${data.token}; path=/`;

      const route = ROLE_ROUTES[data.role];
      if (route) {
        router.push(route);
      } else {
        alert("Unknown role");
      }
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
              Enerlytics – Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                className="w-full rounded-xl py-2 text-base"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
