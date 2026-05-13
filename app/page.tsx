"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadUserData } from "@/lib/storage";
import { UserData } from "@/lib/types";
import { adherenceRate } from "@/lib/adherence";
import { generateAlerts } from "@/lib/alerts";
import { hasGuidelineBase, NOT_COVERED_MESSAGE, topRecommendations } from "@/lib/recommendations";
import AlertBanner from "@/components/AlertBanner";
import RecommendationCard from "@/components/RecommendationCard";

export default function DailySummaryPage() {
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    setData(loadUserData());
  }, []);

  const today = useMemo(() => new Date(), []);
  const todayKey = today.toISOString().slice(0, 10);

  if (!data) {
    return <div className="text-muted">Loading…</div>;
  }

  const adherenceToday = adherenceRate(data, "day");
  const alerts = generateAlerts(data, today);
  const recs = topRecommendations(data, 3);
  const todayMetric = data.metrics
    .filter((m) => m.date === todayKey)
    .at(-1);

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Today</h1>
        <div className="text-sm text-muted">
          {today.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Adherence today"
          value={`${Math.round(adherenceToday * 100)}%`}
          hint={`${data.medications.length} medication${data.medications.length === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Sleep"
          value={
            typeof todayMetric?.sleepHours === "number"
              ? `${todayMetric.sleepHours.toFixed(1)}h`
              : "—"
          }
          hint={
            typeof todayMetric?.sleepQuality === "number"
              ? `Quality ${todayMetric.sleepQuality}/10`
              : "Log in Metrics"
          }
        />
        <StatCard
          label="Mood / Energy"
          value={
            todayMetric?.moodAm || todayMetric?.energyAm
              ? `${todayMetric?.moodAm ?? "—"} / ${todayMetric?.energyAm ?? "—"}`
              : "—"
          }
          hint="AM (1–10)"
        />
      </section>

      {alerts.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Alerts</h2>
          {alerts.map((a) => (
            <AlertBanner key={a.id} alert={a} />
          ))}
        </section>
      )}

      <section className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Top recommendations</h2>
          <Link href="/recommendations" className="text-xs text-accent hover:underline">
            View all
          </Link>
        </div>
        {!hasGuidelineBase() ? (
          <div className="rounded border border-border bg-panel p-4 text-sm text-muted">
            {NOT_COVERED_MESSAGE}
            <div className="mt-2 text-xs">
              Add rules in <code className="text-accent">lib/guideline-rules.ts</code> using the
              verbatim guideline base. See <code className="text-accent">docs/MASTER_PROMPT.md</code>.
            </div>
          </div>
        ) : recs.length === 0 ? (
          <div className="rounded border border-border bg-panel p-4 text-sm text-muted">
            No recommendations apply to your most recent data. Log more in{" "}
            <Link href="/metrics" className="text-accent hover:underline">
              Metrics
            </Link>
            .
          </div>
        ) : (
          recs.map((r) => <RecommendationCard key={r.ruleId} rec={r} />)
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded border border-border bg-panel p-4">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-text">{value}</div>
      <div className="text-xs text-muted">{hint}</div>
    </div>
  );
}
