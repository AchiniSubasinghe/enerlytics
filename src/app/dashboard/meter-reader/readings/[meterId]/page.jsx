"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const units = {
  ELECTRICITY: "kWh",
  WATER: "m³",
  GAS: "units",
};

export default function AddReadingPage() {
  const { meterId } = useParams();
  const router = useRouter();
  const [meter, setMeter] = useState(null);
  const [previous, setPrevious] = useState(0);
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/meter-reader/meters/${meterId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setMeter(data.meter);
          setPrevious(data.previousReading); // 0 if none
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load meter");
        setLoading(false);
      });
  }, [meterId]);

  async function submit() {
    setError("");

    if (Number(current) < previous) {
      setError("Current reading cannot be less than previous");
      return;
    }

    const res = await fetch("/api/meter-reader/readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meterId,
        currentReading: Number(current),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Submission failed");
      return;
    }

    router.push("/dashboard/meter-reader");
  }

  if (loading) {
    return <p className="p-6">Loading meter...</p>;
  }

  return (
    <div className="p-6 max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Add Meter Reading</h1>

      <div>
        <Label>Meter Number</Label>
        <Input value={meter.meter_number} disabled />
      </div>

      <div>
        <Label>Utility Type</Label>
        <Input value={meter.utility_type} disabled />
      </div>

      <div>
        <Label>Previous Reading ({units[meter.utility_type]})</Label>
        <Input value={previous} disabled />
      </div>

      <div>
        <Label>Current Reading ({units[meter.utility_type]})</Label>
        <Input
          type="number"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </div>

      {error && <Alert variant="destructive">{error}</Alert>}

      <Button className="w-full" onClick={submit}>
        Submit Reading
      </Button>
    </div>
  );
}
