"use client";

import { FormEvent, useState } from "react";
import { addMedication } from "@/lib/storage";

type Props = { onAdded: () => void };

export default function MedicationForm({ onAdded }: Props) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [route, setRoute] = useState("oral");
  const [frequency, setFrequency] = useState("once daily");
  const [prescribedBy, setPrescribedBy] = useState("");
  const [reminderTimes, setReminderTimes] = useState("");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMedication({
      name: name.trim(),
      dose: dose.trim(),
      route: route.trim(),
      frequency: frequency.trim(),
      prescribedBy: prescribedBy.trim(),
      startDate,
      reminderTimes: reminderTimes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      notes: notes.trim() || undefined,
    });
    setName("");
    setDose("");
    setRoute("oral");
    setFrequency("once daily");
    setPrescribedBy("");
    setReminderTimes("");
    setNotes("");
    onAdded();
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded border border-border bg-panel p-4 sm:grid-cols-2"
    >
      <Field label="Name" required>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          required
        />
      </Field>
      <Field label="Dose">
        <input value={dose} onChange={(e) => setDose(e.target.value)} className="input" />
      </Field>
      <Field label="Route">
        <input value={route} onChange={(e) => setRoute(e.target.value)} className="input" />
      </Field>
      <Field label="Frequency">
        <input
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="input"
        />
      </Field>
      <Field label="Prescribed by">
        <input
          value={prescribedBy}
          onChange={(e) => setPrescribedBy(e.target.value)}
          className="input"
        />
      </Field>
      <Field label="Start date">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="input"
        />
      </Field>
      <Field label="Reminder times (HH:MM, comma-separated)">
        <input
          value={reminderTimes}
          onChange={(e) => setReminderTimes(e.target.value)}
          placeholder="08:00, 20:00"
          className="input"
        />
      </Field>
      <Field label="Notes">
        <input value={notes} onChange={(e) => setNotes(e.target.value)} className="input" />
      </Field>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90"
        >
          Add medication
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted">
        {label}
        {required && <span className="text-bad"> *</span>}
      </span>
      {children}
    </label>
  );
}
