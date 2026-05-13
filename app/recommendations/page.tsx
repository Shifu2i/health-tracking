"use client";

import { useEffect, useState } from "react";
import { loadUserData } from "@/lib/storage";
import { UserData } from "@/lib/types";
import { generateRecommendations, hasGuidelineBase, NOT_COVERED_MESSAGE } from "@/lib/recommendations";
import RecommendationCard from "@/components/RecommendationCard";

export default function RecommendationsPage() {
  const [data, setData] = useState<UserData | null>(null);
  useEffect(() => setData(loadUserData()), []);
  if (!data) return <div className="text-muted">Loading…</div>;

  const recs = generateRecommendations(data);
  const loaded = hasGuidelineBase();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Recommendations</h1>
        <p className="text-sm text-muted">
          Recommendations are generated only from the loaded guideline base, with the
          originating line quoted. Sourced from Andrew Huberman, named Huberman Lab
          guests, and Brain Johnsson.
        </p>
      </header>

      {!loaded ? (
        <div className="rounded border border-border bg-panel p-4 text-sm">
          <div className="text-muted">{NOT_COVERED_MESSAGE}</div>
          <div className="mt-3 text-xs text-muted">
            Populate the guideline base by adding rules to{" "}
            <code className="text-accent">lib/guideline-rules.ts</code>. Each rule must
            include the verbatim quote, attribution, and a trigger function. See{" "}
            <code className="text-accent">docs/MASTER_PROMPT.md</code> and{" "}
            <code className="text-accent">content/guidelines.md</code>.
          </div>
        </div>
      ) : recs.length === 0 ? (
        <div className="rounded border border-border bg-panel p-4 text-sm text-muted">
          No guideline applies to your most recent logged data.
        </div>
      ) : (
        <div className="grid gap-3">
          {recs.map((r) => (
            <RecommendationCard key={r.ruleId} rec={r} />
          ))}
        </div>
      )}
    </div>
  );
}
