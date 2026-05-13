import { EMERGENCY_GUIDANCE } from "@/lib/emergency";

export default function EmergencyBanner({ label }: { label: string }) {
  return (
    <div className="rounded border border-bad bg-bad/10 p-4 text-sm">
      <div className="mb-2 font-semibold text-bad">
        Your input mentioned {label}. Routine recommendations are paused.
      </div>
      <ul className="list-disc space-y-1 pl-5 text-text">
        {EMERGENCY_GUIDANCE.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
