import { Alert, UserData } from "./types";
import { todaysIntake } from "./adherence";

export function generateAlerts(data: UserData, now: Date = new Date()): Alert[] {
  const alerts: Alert[] = [];
  alerts.push(...missedMedicationAlerts(data, now));
  alerts.push(...sleepDeviationAlerts(data));
  return alerts;
}

function missedMedicationAlerts(data: UserData, now: Date): Alert[] {
  const out: Alert[] = [];
  const today = now.toISOString().slice(0, 10);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  for (const med of data.medications) {
    for (const t of med.reminderTimes) {
      const [h, m] = t.split(":").map(Number);
      if (Number.isNaN(h) || Number.isNaN(m)) continue;
      const reminderMinutes = h * 60 + m;
      if (reminderMinutes > nowMinutes) continue;
      const taken = todaysIntake(data, med.id).some(
        (l) => l.status === "taken" && l.timestamp.startsWith(today),
      );
      if (!taken && nowMinutes - reminderMinutes >= 30) {
        out.push({
          id: `missed_${med.id}_${t}`,
          kind: "missed-medication",
          title: `${med.name} not yet logged`,
          detail: `Scheduled at ${t} today. No "taken" entry recorded.`,
          nextStep: "Log it now if you took it, or mark as missed/skipped.",
          timestamp: now.toISOString(),
        });
      }
    }
  }
  return out;
}

function sleepDeviationAlerts(data: UserData): Alert[] {
  const last = [...data.metrics]
    .filter((m) => typeof m.sleepHours === "number")
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .at(-1);
  if (!last || typeof last.sleepHours !== "number") return [];
  const { targetSleepHoursMin, targetSleepHoursMax } = data.settings;
  if (last.sleepHours < targetSleepHoursMin) {
    return [
      {
        id: `sleep_low_${last.date}`,
        kind: "metric-deviation",
        title: "Sleep below target range",
        detail: `Logged ${last.sleepHours.toFixed(1)}h on ${last.date}; target ${targetSleepHoursMin}–${targetSleepHoursMax}h.`,
        nextStep: "Review recent caffeine, evening light, and bedtime entries.",
        timestamp: last.timestamp,
      },
    ];
  }
  if (last.sleepHours > targetSleepHoursMax) {
    return [
      {
        id: `sleep_high_${last.date}`,
        kind: "metric-deviation",
        title: "Sleep above target range",
        detail: `Logged ${last.sleepHours.toFixed(1)}h on ${last.date}; target ${targetSleepHoursMin}–${targetSleepHoursMax}h.`,
        nextStep: "Note any daytime drowsiness; mention to your clinician if persistent.",
        timestamp: last.timestamp,
      },
    ];
  }
  return [];
}
