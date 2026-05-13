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
    <div className="rounded border border-border bg-panel p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-text">{med.name}</div>
          <div className="text-sm text-muted">
            {med.dose} · {med.route} · {med.frequency}
          </div>
          {med.prescribedBy && (
            <div className="text-xs text-muted">Prescribed by {med.prescribedBy}</div>
          )}
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="text-xs text-muted hover:text-bad"
          aria-label={`Delete ${med.name}`}
        >
          Delete
        </button>
      </div>

      {med.reminderTimes.length > 0 && (
        <div className="mt-2 text-xs text-muted">
          Reminders: {med.reminderTimes.join(", ")}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handle("taken")}
          className="rounded bg-ok/20 px-3 py-1 text-sm text-ok hover:bg-ok/30"
        >
          Taken
        </button>
        <button
          type="button"
          onClick={() => handle("missed")}
          className="rounded bg-bad/20 px-3 py-1 text-sm text-bad hover:bg-bad/30"
        >
          Missed
        </button>
        <button
          type="button"
          onClick={() => handle("skipped")}
          className="rounded bg-warn/20 px-3 py-1 text-sm text-warn hover:bg-warn/30"
        >
          Skipped
        </button>
        <span className="ml-auto self-center text-xs text-muted">
          Today: {takenCount} taken · {today.length} logged
        </span>
      </div>

      {med.notes && <div className="mt-3 text-xs text-muted">Notes: {med.notes}</div>}
    </div>
  );
}
