"use client";

import { useRouter } from "next/navigation";
import TariffSlabs from "./TariffSlabs";
import { useEffect, useState } from "react";

export default function TariffForm({ mode = "add", tariffId, initialData }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [utilityType, setUtilityType] = useState("ELECTRICITY");
  const [status, setStatus] = useState("ACTIVE");
  const [slabs, setSlabs] = useState([]);


  useEffect(() => {
    if (initialData && initialData.tariff) {
      setName(initialData.tariff.name);
      setUtilityType(initialData.tariff.utility_type);
      setStatus(initialData.tariff.status);
      setSlabs(initialData.slabs  || []);
    }
  }, [initialData]);

  async function handleSubmit(e) {
    e.preventDefault();

    const url =
      mode === "add"
        ? "/api/admin-staff/tariffs"
        : `/api/admin-staff/tariffs/${tariffId}`;

    const method = mode === "add" ? "POST" : "PUT";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        utilityType,
        status,
        slabs,
      }),

    });

    router.push("/dashboard/admin-staff/tariffs");

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow max-w-3xl">
      <h2 className="text-xl font-semibold">
        {mode === "add" ? "Add New Tariff" : "Edit Tariff"}
      </h2>

      {/* Tariff Info */}
      <div className="grid grid-cols-2 gap-4">
        <input className="border p-2 rounded" placeholder="Tariff Name" value={name} onChange={(e) => setName(e.target.value)} required />

        <select className="border p-2 rounded" value={utilityType} onChange={(e) => setUtilityType(e.target.value)}>
          <option value="ELECTRICITY">Electricity</option>
          <option value="WATER">Water</option>
          <option value="GAS">Gas</option>
        </select>

        <select className="border p-2 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Slabs */}
      <TariffSlabs slabs={slabs} setSlabs={setSlabs} />

      <button className="bg-black text-white px-4 py-2 rounded">
        {mode === "add" ? "Add Tariff" : "Update Tariff"}
      </button>
    </form>
  );
}
