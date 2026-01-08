"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { apiCall } from "@/hooks/use-api";
import { useRouter } from "next/navigation";

export default function AddUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    nic: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await apiCall("/api/admin/add-user", {
        method: "POST",
        body: JSON.stringify(form),
      });

      alert("User added successfully!");
      router.push("/dashboard/admin/users");
    } catch (err) {
      alert(err.message || "Error adding user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <Card className="max-w-xl shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input
                name="fullname"
                placeholder="Enter full name"
                value={form.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Phone Number</Label>
              <Input
                name="phone"
                placeholder="07XXXXXXXX"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label>NIC</Label>
              <Input
                name="nic"
                placeholder="Enter NIC Number"
                value={form.nic}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <Label>Role</Label>
              <Select onValueChange={(value) => setForm({ ...form, role: value })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN_STAFF">Admin Staff</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="METER_READER">Meter Reader</SelectItem>
                  <SelectItem value="CASHIER">Billing Clerk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Adding..." : "Add User"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
