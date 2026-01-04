"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TariffSlabs({ slabs, setSlabs }) {

  function addSlab() {
    setSlabs([
      ...slabs,
      { min: "", max: "", rate: "", fixed: "" }]);
  }

  function removeSlab(index) {
    setSlabs(slabs.filter((_, i) => i !== index));
  }

  function updateSlab(index, field, value) {
    const updated = [...slabs];
    updated[index][field] = value;
    setSlabs(updated);
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Tariff Slabs</h3>

      {slabs.map((slab, i) => (
        <div key={i} className="grid grid-cols-5 gap-3 items-center">
          <input className="border p-2 rounded" placeholder="Min Units" value={slab.min_units} onChange={(e) => updateSlab(i, "min_units", e.target.value)} />
          <input className="border p-2 rounded" placeholder="Max Units" value={slab.max_units} onChange={(e) => updateSlab(i, "max_units", e.target.value)} />
          <input className="border p-2 rounded" placeholder="Rate / Unit" value={slab.rate_per_unit} onChange={(e) => updateSlab(i, "rate_per_unit", e.target.value)} />
          <input className="border p-2 rounded" placeholder="Fixed Charge" value={slab.fixed_charge} onChange={(e) => updateSlab(i, "fixed_charged", e.target.value)} />

          <Button
            type="button"
            onClick={() => removeSlab(i)}
            className="bg-red-600"
          >
            Remove
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={addSlab}
        className="border px-3 py-1 rounded"
      >
        + Add Slab
      </Button>
    </div>
  );
}
