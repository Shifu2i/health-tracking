"use client";

import { useCallback, useEffect, useState } from "react";
import MetricEntryForm from "@/components/MetricEntryForm";
import { loadUserData } from "@/lib/storage";
import { UserData } from "@/lib/types";

export default function MetricsPage() {
  const [data, setData] = useState<UserData | null>(null);
  const refresh = useCallback(() => setData(loadUserData()), []);
  useEffect(refresh, [refresh]);

  if (!data) return <div className="text-muted">Loading…</div>;

  const recent = [...data.metrics]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 14);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Metrics</h1>
        <p className="text-sm text-muted">
          Manual entry for sleep, light, caffeine, meals, exercise, mood, and energy.
          Bevel sync (when configured in Settings) supplements this.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">New entry</h2>
        <MetricEntryForm onAdded={refresh} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent entries ({recent.length})</h2>
        {recent.length === 0 ? (
          <div className="rounded border border-border bg-panel p-4 text-sm text-muted">
            No entries yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-panel text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Sleep</th>
                  <th className="px-3 py-2">HRV</th>
                  <th className="px-3 py-2">RHR</th>
                  <th className="px-3 py-2">Caffeine</th>
                  <th className="px-3 py-2">Exercise</th>
                  <th className="px-3 py-2">Mood AM/PM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recent.map((m) => (
                  <tr key={m.id} className="bg-bg/40">
                    <td className="px-3 py-2">{m.date}</td>
                    <td className="px-3 py-2 text-muted">{m.source}</td>
                    <td className="px-3 py-2">
                      {typeof m.sleepHours === "number" ? `${m.sleepHours.toFixed(1)}h` : "—"}
                    </td>
                    <td className="px-3 py-2">{m.hrv ?? "—"}</td>
                    <td className="px-3 py-2">{m.restingHeartRate ?? "—"}</td>
                    <td className="px-3 py-2">
                      {typeof m.caffeineMg === "number" ? `${m.caffeineMg}mg` : "—"}
                    </td>
                    <td className="px-3 py-2">
                      {m.exerciseMinutes ? `${m.exerciseMinutes}m ${m.exerciseIntensity ?? ""}` : "—"}
                    </td>
                    <td className="px-3 py-2">
                      {(m.moodAm ?? "—") + " / " + (m.moodPm ?? "—")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
