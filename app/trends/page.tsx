"use client";

import { useEffect, useState } from "react";
import { loadUserData } from "@/lib/storage";
import { UserData } from "@/lib/types";
import { adherenceRate, dailyAdherenceSeries, dailySleepSeries } from "@/lib/adherence";
import Sparkline from "@/components/Sparkline";

export default function TrendsPage() {
  const [data, setData] = useState<UserData | null>(null);
  useEffect(() => setData(loadUserData()), []);
  if (!data) return <div className="text-muted">Loading…</div>;

  const adh7 = dailyAdherenceSeries(data, 7);
  const adh30 = dailyAdherenceSeries(data, 30);
  const sleep7 = dailySleepSeries(data, 7);
  const sleep30 = dailySleepSeries(data, 30);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Trends</h1>
        <p className="text-sm text-muted">Weekly and monthly views of adherence and sleep.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Adherence (7d)" value={`${Math.round(adherenceRate(data, "week") * 100)}%`} />
        <Stat label="Adherence (30d)" value={`${Math.round(adherenceRate(data, "month") * 100)}%`} />
        <Stat
          label="Avg sleep (7d)"
          value={avgSleep(sleep7.map((s) => s.hours))}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <ChartPanel title="Adherence — last 7 days" labels={adh7.map((d) => d.date)}>
          <Sparkline
            values={adh7.map((d) => d.rate * 100)}
            max={100}
            min={0}
            ariaLabel="Adherence last 7 days"
          />
        </ChartPanel>
        <ChartPanel title="Adherence — last 30 days" labels={adh30.map((d) => d.date)}>
          <Sparkline
            values={adh30.map((d) => d.rate * 100)}
            max={100}
            min={0}
            ariaLabel="Adherence last 30 days"
          />
        </ChartPanel>
        <ChartPanel title="Sleep hours — last 7 days" labels={sleep7.map((d) => d.date)}>
          <Sparkline
            values={sleep7.map((d) => d.hours)}
            max={Math.max(10, ...sleep7.map((d) => d.hours))}
            min={0}
            ariaLabel="Sleep hours last 7 days"
            stroke="#34d399"
            fill="rgba(52,211,153,0.15)"
          />
        </ChartPanel>
        <ChartPanel title="Sleep hours — last 30 days" labels={sleep30.map((d) => d.date)}>
          <Sparkline
            values={sleep30.map((d) => d.hours)}
            max={Math.max(10, ...sleep30.map((d) => d.hours))}
            min={0}
            ariaLabel="Sleep hours last 30 days"
            stroke="#34d399"
            fill="rgba(52,211,153,0.15)"
          />
        </ChartPanel>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border bg-panel p-4">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-text">{value}</div>
    </div>
  );
}

function ChartPanel({
  title,
  labels,
  children,
}: {
  title: string;
  labels: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="rounded border border-border bg-panel p-4">
      <div className="mb-2 text-sm text-muted">{title}</div>
      {children}
      {labels.length > 0 && (
        <div className="mt-2 flex justify-between text-[10px] text-muted">
          <span>{labels[0]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}

function avgSleep(values: number[]): string {
  const filtered = values.filter((v) => v > 0);
  if (filtered.length === 0) return "—";
  const avg = filtered.reduce((a, b) => a + b, 0) / filtered.length;
  return `${avg.toFixed(1)}h`;
}
