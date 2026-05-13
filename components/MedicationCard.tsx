"use client";

import { useMemo } from "react";
import { Medication, UserData } from "@/lib/types";
import { todaysIntake } from "@/lib/adherence";
import { deleteMedication, logIntake } from "@/lib/storage";

type Props = {
  med: Medication;
  data: UserData;
  onChange: () => void;
};

export default function MedicationCard({ med, data, onChange }: Props) {
  const today = useMemo(() => todaysIntake(data, med.id), [data, med.id]);
  const takenCount = today.filter((l) => l.status === "taken").length;
  const expected = med.reminderTimes.length || 1;
  const ratio = `${takenCount}/${expected}`;

  const handle = (status: "taken" | "missed" | "skipped") => {
    logIntake({ medicationId: med.id, timestamp: new Date().toISOString(), status });
    onChange();
  };

  const handleDelete = () => {
    if (confirm(`Delete ${med.name} and its history?`)) {
      deleteMedication(med.id);
      onChange();
    }
  };

  return (
    <article className="card flex flex-col gap-5 p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-1">{med.frequency}</div>
          <h3 className="font-serif text-xl text-ink">{med.name}</h3>
          <div className="mt-1 text-sm text-ink2">
            {[med.dose, med.route].filter(Boolean).join(" · ")}
          </div>
          {med.prescribedBy && (
            <div className="mt-1 text-xs text-muted">Prescribed by {med.prescribedBy}</div>
          )}
        </div>
        <div className="text-right">
          <div className="font-serif text-3xl text-ink">{ratio}</div>
          <div className="eyebrow text-muted">Today</div>
        </div>
      </header>

      {med.reminderTimes.length > 0 && (
        <div className="border-t border-rule pt-4">
          <div className="eyebrow mb-2 text-muted">Reminders</div>
          <div className="flex flex-wrap gap-2">
            {med.reminderTimes.map((t) => (
              <span key={t} className="border border-rule2 px-2 py-0.5 text-xs text-ink2">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-rule pt-4">
        <button type="button" onClick={() => handle("taken")} className="btn">
          Taken
        </button>
        <button type="button" onClick={() => handle("missed")} className="btn-ghost">
          Missed
        </button>
        <button type="button" onClick={() => handle("skipped")} className="btn-ghost">
          Skipped
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="ml-auto text-xs uppercase tracking-eyebrow text-muted hover:text-ink"
          aria-label={`Delete ${med.name}`}
        >
          Delete
        </button>
      </div>

      {med.notes && (
        <p className="border-t border-rule pt-4 text-xs leading-relaxed text-muted">
          {med.notes}
        </p>
      )}
    </article>
  );
}
