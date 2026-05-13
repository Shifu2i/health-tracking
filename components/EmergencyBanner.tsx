import { EMERGENCY_GUIDANCE } from "@/lib/emergency";

export default function EmergencyBanner({ label }: { label: string }) {
  return (
    <div className="card border-2 border-ink p-5">
      <div className="eyebrow text-ink">Urgent</div>
      <p className="mt-2 font-serif text-lg text-ink">
        Your input mentioned {label}. Routine recommendations are paused.
      </p>
      <ul className="mt-4 space-y-2 border-t border-rule pt-4 text-sm text-ink2">
        {EMERGENCY_GUIDANCE.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
