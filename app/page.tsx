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
  const todayMetric = data.metrics.filter((m) => m.date === todayKey).at(-1);
  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-16">
      <section className="border-b border-rule pb-10">
        <div className="eyebrow mb-4">{dateLabel}</div>
        <h1 className="font-serif text-5xl leading-tight tracking-tight text-ink sm:text-6xl">
          Today
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink2">
          A snapshot of medication adherence, sleep, and how you&rsquo;re feeling. Log
          intake and metrics throughout the day to keep this view accurate.
        </p>
      </section>

      <section className="grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-3">
        <Stat
          label="Adherence"
          value={`${Math.round(adherenceToday * 100)}%`}
          hint={`${data.medications.length} medication${data.medications.length === 1 ? "" : "s"}`}
        />
        <Stat
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
        <Stat
          label="Mood / Energy"
          value={
            todayMetric?.moodAm || todayMetric?.energyAm
              ? `${todayMetric?.moodAm ?? "—"} / ${todayMetric?.energyAm ?? "—"}`
              : "—"
          }
          hint="AM, scale 1–10"
        />
      </section>

      {alerts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-rule pb-3">
            <h2 className="font-serif text-2xl text-ink">Alerts</h2>
            <span className="eyebrow">{alerts.length} item{alerts.length === 1 ? "" : "s"}</span>
          </div>
          <div className="space-y-3">
            {alerts.map((a) => (
              <AlertBanner key={a.id} alert={a} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-rule pb-3">
          <h2 className="font-serif text-2xl text-ink">Recommendations</h2>
          <Link href="/recommendations" className="eyebrow text-muted hover:text-ink">
            View all
          </Link>
        </div>
        {!hasGuidelineBase() ? (
          <div className="card p-6 text-sm leading-relaxed text-ink2">
            <div className="eyebrow mb-2">Not covered</div>
            <p>{NOT_COVERED_MESSAGE}</p>
            <p className="mt-3 text-xs text-muted">
              Add rules in <code className="text-ink">lib/guideline-rules.ts</code>. See{" "}
              <code className="text-ink">docs/MASTER_PROMPT.md</code>.
            </p>
          </div>
        ) : recs.length === 0 ? (
          <div className="card p-6 text-sm text-ink2">
            No recommendations apply to your most recent data. Log more in{" "}
            <Link href="/metrics" className="underline underline-offset-4">
              Metrics
            </Link>
            .
          </div>
        ) : (
          <div className="space-y-3">
            {recs.map((r) => (
              <RecommendationCard key={r.ruleId} rec={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="bg-surface p-8">
      <div className="eyebrow mb-3">{label}</div>
      <div className="font-serif text-4xl leading-none tracking-tight text-ink">{value}</div>
      <div className="mt-3 text-xs text-muted">{hint}</div>
    </div>
  );
}
