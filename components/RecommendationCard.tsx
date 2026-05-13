import { Recommendation } from "@/lib/types";

const SEV_COLOR: Record<Recommendation["severity"], string> = {
  low: "border-border",
  medium: "border-warn",
  high: "border-bad",
};

export default function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <div className={`rounded border-l-4 ${SEV_COLOR[rec.severity]} border-y border-r border-border bg-panel p-4`}>
      <div className="text-xs uppercase tracking-wide text-muted">{rec.topic}</div>
      <blockquote className="mt-2 border-l-2 border-accent pl-3 text-sm italic text-text">
        “{rec.quote}”
      </blockquote>
      <div className="mt-2 text-xs text-muted">— {rec.attribution}</div>
      <div className="mt-3 text-sm text-text">{rec.application}</div>
    </div>
  );
}
