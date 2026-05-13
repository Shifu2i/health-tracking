"use client";

import { FormEvent, useState } from "react";
import { logMetric } from "@/lib/storage";
import { detectEmergency } from "@/lib/emergency";
import EmergencyBanner from "./EmergencyBanner";

type Props = { onAdded: () => void };

export default function MetricEntryForm({ onAdded }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [sleepHours, setSleepHours] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [bedtime, setBedtime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [hrv, setHrv] = useState("");
  const [restingHeartRate, setRestingHeartRate] = useState("");
  const [morningLight, setMorningLight] = useState("");
  const [eveningLight, setEveningLight] = useState<"" | "low" | "medium" | "high">("");
  const [caffeineMg, setCaffeineMg] = useState("");
  const [lastCaffeineTime, setLastCaffeineTime] = useState("");
  const [firstMealTime, setFirstMealTime] = useState("");
  const [lastMealTime, setLastMealTime] = useState("");
  const [exerciseType, setExerciseType] = useState("");
  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [exerciseIntensity, setExerciseIntensity] = useState<"" | "low" | "medium" | "high">("");
  const [moodAm, setMoodAm] = useState("");
  const [moodPm, setMoodPm] = useState("");
  const [energyAm, setEnergyAm] = useState("");
  const [energyPm, setEnergyPm] = useState("");
  const [notes, setNotes] = useState("");

  const emergency = detectEmergency(notes);

  const num = (s: string): number | undefined => {
    const n = Number(s);
    return s.trim() === "" || Number.isNaN(n) ? undefined : n;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    logMetric({
      date,
      timestamp: new Date().toISOString(),
      sleepHours: num(sleepHours),
      sleepQuality: num(sleepQuality),
      bedtime: bedtime || undefined,
      wakeTime: wakeTime || undefined,
      hrv: num(hrv),
      restingHeartRate: num(restingHeartRate),
      morningLightMinutes: num(morningLight),
      eveningLightExposure: eveningLight || undefined,
      caffeineMg: num(caffeineMg),
      lastCaffeineTime: lastCaffeineTime || undefined,
      firstMealTime: firstMealTime || undefined,
      lastMealTime: lastMealTime || undefined,
      exerciseType: exerciseType || undefined,
      exerciseMinutes: num(exerciseMinutes),
      exerciseIntensity: exerciseIntensity || undefined,
      moodAm: num(moodAm),
      moodPm: num(moodPm),
      energyAm: num(energyAm),
      energyPm: num(energyPm),
      source: "manual",
      notes: notes.trim() || undefined,
    });
    setSleepHours("");
    setSleepQuality("");
    setBedtime("");
    setWakeTime("");
    setHrv("");
    setRestingHeartRate("");
    setMorningLight("");
    setEveningLight("");
    setCaffeineMg("");
    setLastCaffeineTime("");
    setFirstMealTime("");
    setLastMealTime("");
    setExerciseType("");
    setExerciseMinutes("");
    setExerciseIntensity("");
    setMoodAm("");
    setMoodPm("");
    setEnergyAm("");
    setEnergyPm("");
    setNotes("");
    onAdded();
  };

  return (
    <form onSubmit={submit} className="grid gap-3 rounded border border-border bg-panel p-4 sm:grid-cols-3">
      <Field label="Date">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
      </Field>
      <Field label="Sleep hours">
        <input value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} className="input" inputMode="decimal" />
      </Field>
      <Field label="Sleep quality (1–10)">
        <input value={sleepQuality} onChange={(e) => setSleepQuality(e.target.value)} className="input" inputMode="numeric" />
      </Field>
      <Field label="Bedtime">
        <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className="input" />
      </Field>
      <Field label="Wake time">
        <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="input" />
      </Field>
      <Field label="HRV (ms)">
        <input value={hrv} onChange={(e) => setHrv(e.target.value)} className="input" inputMode="numeric" />
      </Field>
      <Field label="Resting HR (bpm)">
        <input value={restingHeartRate} onChange={(e) => setRestingHeartRate(e.target.value)} className="input" inputMode="numeric" />
      </Field>
      <Field label="Morning light (min outside)">
        <input value={morningLight} onChange={(e) => setMorningLight(e.target.value)} className="input" inputMode="numeric" />
      </Field>
      <Field label="Evening light exposure">
        <select value={eveningLight} onChange={(e) => setEveningLight(e.target.value as "" | "low" | "medium" | "high")} className="input">
          <option value="">—</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </Field>
      <Field label="Caffeine (mg)">
        <input value={caffeineMg} onChange={(e) => setCaffeineMg(e.target.value)} className="input" inputMode="numeric" />
      </Field>
      <Field label="Last caffeine time">
        <input type="time" value={lastCaffeineTime} onChange={(e) => setLastCaffeineTime(e.target.value)} className="input" />
      </Field>
      <Field label="First meal time">
        <input type="time" value={firstMealTime} onChange={(e) => setFirstMealTime(e.target.value)} className="input" />
      </Field>
      <Field label="Last meal time">
        <input type="time" value={lastMealTime} onChange={(e) => setLastMealTime(e.target.value)} className="input" />
      </Field>
      <Field label="Exercise type">
        <input value={exerciseType} onChange={(e) => setExerciseType(e.target.value)} className="input" />
      </Field>
      <Field label="Exercise minutes">
        <input value={exerciseMinutes} onChange={(e) => setExerciseMinutes(e.target.value)} className="input" inputMode="numeric" />
      </Field>
      <Field label="Exercise intensity">
        <select value={exerciseIntensity} onChange={(e) => setExerciseIntensity(e.target.value as "" | "low" | "medium" | "high")} className="input">
          <option value="">—</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </Field>
      <Field label="Mood AM (1–10)">
        <input value={moodAm} onChange={(e) => setMoodAm(e.target.value)} className="input" inputMode="numeric" />
      </Field>
      <Field label="Mood PM (1–10)">
        <input value={moodPm} onChange={(e) => setMoodPm(e.target.value)} className="input" inputMode="numeric" />
      </Field>
      <Field label="Energy AM (1–10)">
        <input value={energyAm} onChange={(e) => setEnergyAm(e.target.value)} className="input" inputMode="numeric" />
      </Field>
      <Field label="Energy PM (1–10)">
        <input value={energyPm} onChange={(e) => setEnergyPm(e.target.value)} className="input" inputMode="numeric" />
      </Field>
      <div className="sm:col-span-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="input"
          />
        </label>
      </div>
      {emergency.matched && (
        <div className="sm:col-span-3">
          <EmergencyBanner label={emergency.label} />
        </div>
      )}
      <div className="sm:col-span-3">
        <button
          type="submit"
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90"
        >
          Save entry
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}
