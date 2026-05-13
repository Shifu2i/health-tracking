import { IntakeLog, Medication, UserData } from "./types";

export type AdherenceWindow = "day" | "week" | "month";

export function windowStart(window: AdherenceWindow, now: Date = new Date()): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  if (window === "week") d.setDate(d.getDate() - 6);
  if (window === "month") d.setDate(d.getDate() - 29);
  return d;
}

export function adherenceRate(data: UserData, window: AdherenceWindow): number {
  const start = windowStart(window);
  const end = new Date();
  const expected = expectedDoses(data.medications, start, end);
  if (expected === 0) return 1;
  const taken = data.intakeLogs.filter(
    (l) => l.status === "taken" && new Date(l.timestamp) >= start && new Date(l.timestamp) <= end,
  ).length;
  return Math.min(1, taken / expected);
}

export function expectedDoses(meds: Medication[], start: Date, end: Date): number {
  let total = 0;
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86_400_000));
  for (const m of meds) {
    const perDay = m.reminderTimes.length || dosesFromFrequency(m.frequency);
    total += perDay * days;
  }
  return total;
}

function dosesFromFrequency(freq: string): number {
  const f = freq.toLowerCase();
  if (/(once|1x|1 time|qd|daily)/.test(f)) return 1;
  if (/(twice|2x|2 times|bid)/.test(f)) return 2;
  if (/(three|3x|3 times|tid)/.test(f)) return 3;
  if (/(four|4x|4 times|qid)/.test(f)) return 4;
  return 1;
}

export function todaysIntake(data: UserData, medId: string): IntakeLog[] {
  const start = windowStart("day");
  return data.intakeLogs.filter((l) => l.medicationId === medId && new Date(l.timestamp) >= start);
}

export function dailyAdherenceSeries(data: UserData, days: number): { date: string; rate: number }[] {
  const out: { date: string; rate: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    const expected = expectedDoses(data.medications, day, next);
    const taken = data.intakeLogs.filter(
      (l) => l.status === "taken" && new Date(l.timestamp) >= day && new Date(l.timestamp) < next,
    ).length;
    out.push({
      date: day.toISOString().slice(0, 10),
      rate: expected === 0 ? 0 : Math.min(1, taken / expected),
    });
  }
  return out;
}

export function dailySleepSeries(data: UserData, days: number): { date: string; hours: number }[] {
  const out: { date: string; hours: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    const log = data.metrics
      .filter((m) => m.date === key && typeof m.sleepHours === "number")
      .at(-1);
    out.push({ date: key, hours: log?.sleepHours ?? 0 });
  }
  return out;
}
