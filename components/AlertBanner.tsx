import { Alert } from "@/lib/types";

export default function AlertBanner({ alert }: { alert: Alert }) {
  return (
    <div className="card border-l-2 border-l-ink p-5">
      <div className="flex items-baseline justify-between">
        <div className="font-serif text-lg text-ink">{alert.title}</div>
        <span className="eyebrow">{alert.kind === "missed-medication" ? "Reminder" : "Deviation"}</span>
      </div>
      <p className="mt-2 text-sm text-ink2">{alert.detail}</p>
      {alert.relatedGuideline && (
        <p className="mt-3 border-t border-rule pt-3 text-xs italic text-muted">
          Guideline: &ldquo;{alert.relatedGuideline}&rdquo;
        </p>
      )}
      <p className="mt-3 eyebrow text-ink2">Next: <span className="normal-case tracking-normal">{alert.nextStep}</span></p>
    </div>
  );
}
