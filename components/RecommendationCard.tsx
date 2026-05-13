import { Recommendation } from "@/lib/types";

const SEV_RULE: Record<Recommendation["severity"], string> = {
  low: "border-l border-rule2",
  medium: "border-l-2 border-ink2",
  high: "border-l-4 border-ink",
};

const SEV_LABEL: Record<Recommendation["severity"], string> = {
  low: "Note",
  medium: "Recommended",
  high: "Priority",
};

export default function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <article className={`card ${SEV_RULE[rec.severity]} flex flex-col gap-4 p-6`}>
      <header className="flex items-center justify-between">
        <span className="eyebrow">{rec.topic}</span>
        <span className="eyebrow">{SEV_LABEL[rec.severity]}</span>
      </header>
      <blockquote className="font-serif text-lg leading-relaxed text-ink">
        &ldquo;{rec.quote}&rdquo;
      </blockquote>
      <div className="eyebrow text-muted">— {rec.attribution}</div>
      <p className="border-t border-rule pt-4 text-sm leading-relaxed text-ink2">
        {rec.application}
      </p>
    </article>
  );
}
