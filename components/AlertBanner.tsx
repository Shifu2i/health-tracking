import { Alert } from "@/lib/types";

export default function AlertBanner({ alert }: { alert: Alert }) {
  return (
    <div className="rounded border border-warn/60 bg-warn/10 p-3 text-sm">
      <div className="font-semibold text-warn">{alert.title}</div>
      <div className="text-text">{alert.detail}</div>
      {alert.relatedGuideline && (
        <div className="mt-1 text-xs italic text-muted">Guideline: “{alert.relatedGuideline}”</div>
      )}
      <div className="mt-1 text-xs text-muted">Next step: {alert.nextStep}</div>
    </div>
  );
}
