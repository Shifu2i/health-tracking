"use client";

import { useEffect, useState } from "react";
import { loadUserData } from "@/lib/storage";
import { UserData } from "@/lib/types";
import {
  generateRecommendations,
  hasGuidelineBase,
  NOT_COVERED_MESSAGE,
} from "@/lib/recommendations";
import RecommendationCard from "@/components/RecommendationCard";

export default function RecommendationsPage() {
  const [data, setData] = useState<UserData | null>(null);
  useEffect(() => setData(loadUserData()), []);
  if (!data) return <div className="text-muted">Loading…</div>;

  const recs = generateRecommendations(data);
  const loaded = hasGuidelineBase();

  return (
    <div className="space-y-16">
      <section className="border-b border-rule pb-10">
        <div className="eyebrow mb-4">Recommendations</div>
        <h1 className="font-serif text-5xl leading-tight tracking-tight text-ink sm:text-6xl">
          Guidance
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink2">
          Generated only from the loaded guideline base, with the originating line quoted.
          Sourced from Andrew Huberman, named Huberman Lab guests, and Brain Johnsson.
        </p>
      </section>

      {!loaded ? (
        <div className="card p-6">
          <div className="eyebrow mb-2">Not covered</div>
          <p className="text-sm leading-relaxed text-ink2">{NOT_COVERED_MESSAGE}</p>
          <p className="mt-4 border-t border-rule pt-4 text-xs leading-relaxed text-muted">
            Populate the guideline base by adding rules to{" "}
            <code className="text-ink">lib/guideline-rules.ts</code>. Each rule must
            include the verbatim quote, attribution, and a trigger function. See{" "}
            <code className="text-ink">docs/MASTER_PROMPT.md</code> and{" "}
            <code className="text-ink">content/guidelines.md</code>.
          </p>
        </div>
      ) : recs.length === 0 ? (
        <div className="card p-6 text-sm text-ink2">
          No guideline applies to your most recent logged data.
        </div>
      ) : (
        <div className="space-y-4">
          {recs.map((r) => (
            <RecommendationCard key={r.ruleId} rec={r} />
          ))}
        </div>
      )}
    </div>
  );
}
