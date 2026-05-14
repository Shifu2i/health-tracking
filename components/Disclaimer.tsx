export default function Disclaimer() {
  return (
    <footer className="border-t border-rule bg-bg">
      <div className="mx-auto max-w-5xl px-6 py-8 text-xs leading-relaxed text-muted sm:px-10">
        <div className="eyebrow mb-3 text-muted">Disclaimer</div>
        <p>
          This dashboard supports self-tracking. It is not a medical device and does not
          replace clinical judgment. Medication alerts are reminders, not prescriptions.
          For medication changes, contact your prescribing clinician.
        </p>
      </div>
    </footer>
  );
}
