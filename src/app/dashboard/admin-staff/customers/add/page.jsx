"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddCustomerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    nic: "",
    address: "",
    customerType: "HOUSEHOLD",
  });
  const [createLogin, setCreateLogin] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/admin-staff/customers/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, createLogin }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(text);
      alert("API error");
      return;
    }

    const data = await res.json();

    if (data.password) {
      setGeneratedPassword(data.password);
    } else {
      alert("Customer added successfully");
      router.push("/dashboard/admin-staff/customers");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Add Customer</h1>

      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input name="email" value={form.email} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label>Phone Number</Label>
        <Input name="phone" value={form.phone} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label>NIC</Label>
        <Input name="nic" value={form.nic} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label>Address</Label>
        <Input name="address" value={form.address} onChange={handleChange} />
      </div>

      <div className="space-y-2 flex  items-center gap-4">
        <Label className="mb-3">Type </Label>
        <Select value={form.customerType} onValueChange={value => setForm({ ...form, customerType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HOUSEHOLD">Household</SelectItem>
            <SelectItem value="BUSINESS">Business</SelectItem>
            <SelectItem value="GOVERNMENT">Government</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="createLogin"
          checked={createLogin}
          onChange={(e) => setCreateLogin(e.target.checked)}
          className="w-4 h-4"
        />
        <Label htmlFor="createLogin" className="cursor-pointer">
          Create Login Account (generates temporary password)
        </Label>
      </div>

      {generatedPassword ? (
        <div className="bg-green-50 border border-green-200 rounded p-4 space-y-3">
          <h2 className="text-lg font-semibold text-green-800">Customer Account Created!</h2>
          <p className="text-sm text-gray-600">Customer and login account created successfully.</p>
          <div className="bg-white border border-green-300 rounded p-3">
            <Label className="text-sm font-medium">Temporary Password (save this now):</Label>
            <div className="mt-2 font-mono text-lg font-bold text-green-700 select-all">
              {generatedPassword}
            </div>
          </div>
          <p className="text-sm text-amber-600 font-medium">
            ⚠️ This password will only be shown once. Please save it and share with the customer.
          </p>
          <Button type="button" onClick={() => router.push("/dashboard/admin-staff/customers")} className="w-full">
            Go to Customers List
          </Button>
        </div>
      ) : (
        <Button className="w-full">Save Customer</Button>
      )}
    </form>
  );
}
