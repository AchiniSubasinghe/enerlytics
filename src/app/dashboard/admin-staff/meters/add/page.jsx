"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiCall } from "@/hooks/use-api";

const UNIT_MAP = {
  ELECTRICITY: "kWh",
  WATER: "m³",
  GAS: "m³",
};

export default function AddMeterPage() {
  const router = useRouter();
  const [meterNumber, setMeterNumber] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [utilityType, setUtilityType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await apiCall("/api/admin-staff/meters/add", {
        method: "POST",
        body: JSON.stringify({ meterNumber, status, utilityType }),
      });

      alert("Meter added successfully");
      router.push("/dashboard/admin-staff/meters");
    } catch (err) {
      alert(err.message || "Failed to add meter");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Add Meter</h1>

      <div className="space-y-2">
        <Label>Meter Number</Label>
        <Input
          value={meterNumber}
          onChange={(e) => setMeterNumber(e.target.value)}
          placeholder="MTR-001"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
            <SelectItem value="INACTIVE">INACTIVE</SelectItem>
            <SelectItem value="DISCONNECTED">DISCONNECTED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Utility Type</Label>
        <Select value={utilityType} onValueChange={setUtilityType}>
          <SelectTrigger>
            <SelectValue placeholder="Select utility type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ELECTRICITY">Electricity (kWh)</SelectItem>
            <SelectItem value="WATER">Water (m³)</SelectItem>
            <SelectItem value="GAS">Gas (m³)</SelectItem>
          </SelectContent>
        </Select>
        {utilityType && (
          <p className="text-sm text-gray-500">Unit: {UNIT_MAP[utilityType]}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Meter"}
      </Button>
    </form>
  );
}
