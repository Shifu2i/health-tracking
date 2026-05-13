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
    <div className="space-y-16">
      <section className="border-b border-rule pb-10">
        <div className="eyebrow mb-4">Metrics</div>
        <h1 className="font-serif text-5xl leading-tight tracking-tight text-ink sm:text-6xl">
          What you logged
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink2">
          Manual entry for sleep, light, caffeine, meals, exercise, mood, and energy.
          Bevel sync supplements this when configured in Settings.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-rule pb-3">
          <h2 className="font-serif text-2xl text-ink">New entry</h2>
        </div>
        <MetricEntryForm onAdded={refresh} />
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-rule pb-3">
          <h2 className="font-serif text-2xl text-ink">Recent entries</h2>
          <span className="eyebrow">{recent.length} item{recent.length === 1 ? "" : "s"}</span>
        </div>
        {recent.length === 0 ? (
          <div className="card p-6 text-sm text-ink2">No entries yet.</div>
        ) : (
          <div className="overflow-x-auto border border-rule bg-surface">
            <table className="min-w-full text-sm">
              <thead className="border-b border-rule">
                <tr className="text-left">
                  <Th>Date</Th>
                  <Th>Source</Th>
                  <Th>Sleep</Th>
                  <Th>HRV</Th>
                  <Th>RHR</Th>
                  <Th>Caffeine</Th>
                  <Th>Exercise</Th>
                  <Th>Mood AM/PM</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {recent.map((m) => (
                  <tr key={m.id} className="hover:bg-hover">
                    <Td>{m.date}</Td>
                    <Td className="text-muted">{m.source}</Td>
                    <Td>{typeof m.sleepHours === "number" ? `${m.sleepHours.toFixed(1)}h` : "—"}</Td>
                    <Td>{m.hrv ?? "—"}</Td>
                    <Td>{m.restingHeartRate ?? "—"}</Td>
                    <Td>{typeof m.caffeineMg === "number" ? `${m.caffeineMg}mg` : "—"}</Td>
                    <Td>
                      {m.exerciseMinutes ? `${m.exerciseMinutes}m ${m.exerciseIntensity ?? ""}` : "—"}
                    </Td>
                    <Td>{(m.moodAm ?? "—") + " / " + (m.moodPm ?? "—")}</Td>
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

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-[11px] uppercase tracking-eyebrow text-muted">{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-ink ${className}`}>{children}</td>;
}
