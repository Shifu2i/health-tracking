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
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Medications</h1>
        <p className="text-sm text-muted">
          Add medications, log intake, and review adherence. Reminders are local-device only.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Add medication</h2>
        <MedicationForm onAdded={refresh} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Your medications ({data.medications.length})</h2>
        {data.medications.length === 0 ? (
          <div className="rounded border border-border bg-panel p-4 text-sm text-muted">
            No medications yet. Add one above.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.medications.map((med) => (
              <MedicationCard key={med.id} med={med} data={data} onChange={refresh} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
