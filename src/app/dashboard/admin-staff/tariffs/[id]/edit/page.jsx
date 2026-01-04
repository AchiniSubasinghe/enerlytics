"use client";

import { useEffect, useState } from "react";
import TariffForm from "../../components/TariffForm";
import { useParams } from "next/navigation";


export default function EditTariffPage({ params }) {
  const [data, setData] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadTariff() {
      try {
        const res = await fetch(`/api/admin-staff/tariffs/${id}`);
        const result = await res.json();
        console.log("EDIT DATA:", result);

        setData(result);
      } catch (err) {
        console.error("Failed to load tariff", err);
      } finally {
        setLoading(false);
      }
    }

    loadTariff();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading tariff...</p>;
  }

  if (!data || !data.tariff) {
    return <p className="p-6 text-red-600">Tariff not found</p>;
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Edit Tariff – {data.tariff.name}
      </h1>
      <TariffForm mode="edit" tariffId={id} initialData={data} />
    </div>
  );
}
