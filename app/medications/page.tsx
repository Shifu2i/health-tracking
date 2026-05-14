"use client";

import { useCallback, useEffect, useState } from "react";
import MedicationCard from "@/components/MedicationCard";
import MedicationForm from "@/components/MedicationForm";
import { loadUserData } from "@/lib/storage";
import { UserData } from "@/lib/types";

export default function MedicationsPage() {
  const [data, setData] = useState<UserData | null>(null);
  const refresh = useCallback(() => setData(loadUserData()), []);
  useEffect(refresh, [refresh]);

  if (!data) return <div className="text-muted">Loading…</div>;

  return (
    <div className="space-y-16">
      <section className="border-b border-rule pb-10">
        <div className="eyebrow mb-4">Medications</div>
        <h1 className="font-serif text-5xl leading-tight tracking-tight text-ink sm:text-6xl">
          Your regimen
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink2">
          Add medications, log intake, and review adherence. Reminders are
          local-device only.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-rule pb-3">
          <h2 className="font-serif text-2xl text-ink">Add medication</h2>
        </div>
        <MedicationForm onAdded={refresh} />
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-rule pb-3">
          <h2 className="font-serif text-2xl text-ink">Active</h2>
          <span className="eyebrow">{data.medications.length} item{data.medications.length === 1 ? "" : "s"}</span>
        </div>
        {data.medications.length === 0 ? (
          <div className="card p-6 text-sm text-ink2">No medications yet. Add one above.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.medications.map((med) => (
              <MedicationCard key={med.id} med={med} data={data} onChange={refresh} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
