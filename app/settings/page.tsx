"use client";

import { FormEvent, useEffect, useState } from "react";
import { clearAll, loadUserData, saveSettings } from "@/lib/storage";
import { DEFAULT_SETTINGS, Settings } from "@/lib/types";
import { bevelStatus, syncBevelMetrics } from "@/lib/bevel";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setSettings(loadUserData().settings);
  }, []);

  const save = (e: FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setSavedAt(new Date().toLocaleTimeString());
  };

  const sync = async () => {
    setSyncing(true);
    const result = await syncBevelMetrics(settings);
    setSyncMsg(result.userMessage);
    setSyncing(false);
  };

  const reset = () => {
    if (confirm("Erase all local data (medications, logs, settings)? This cannot be undone.")) {
      clearAll();
      setSettings(DEFAULT_SETTINGS);
      setSavedAt(null);
      setSyncMsg(null);
    }
  };

  const status = bevelStatus(settings);

  return (
    <div className="space-y-16">
      <section className="border-b border-rule pb-10">
        <div className="eyebrow mb-4">Settings</div>
        <h1 className="font-serif text-5xl leading-tight tracking-tight text-ink sm:text-6xl">
          Configure
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink2">
          Bevel API connection, target metric ranges, and audience. All data is stored
          in your browser only.
        </p>
      </section>

      <form onSubmit={save} className="space-y-12">
        <Section title="Bevel API" eyebrow="Integration">
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <Field label="Base URL">
              <input
                value={settings.bevelApiBaseUrl}
                onChange={(e) => setSettings({ ...settings, bevelApiBaseUrl: e.target.value })}
                placeholder="https://api.bevel.app/v1"
                className="input"
              />
            </Field>
            <Field label="API key">
              <input
                type="password"
                value={settings.bevelApiKey}
                onChange={(e) => setSettings({ ...settings, bevelApiKey: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Poll interval (minutes)">
              <input
                type="number"
                min={5}
                value={settings.bevelPollIntervalMinutes}
                onChange={(e) =>
                  setSettings({ ...settings, bevelPollIntervalMinutes: Number(e.target.value) || 60 })
                }
                className="input"
              />
            </Field>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-rule pt-4">
            <span className="text-xs text-ink2">
              {status.configured ? `Configured · ${status.baseUrl}` : status.reason}
            </span>
            <button
              type="button"
              onClick={sync}
              disabled={!status.configured || syncing}
              className="btn-ghost"
            >
              {syncing ? "Syncing…" : "Sync now"}
            </button>
            {syncMsg && <span className="text-xs text-muted">{syncMsg}</span>}
          </div>
        </Section>

        <Section title="Target metric ranges" eyebrow="Ranges">
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-3">
            <Field label="Sleep hours (min)">
              <input
                type="number"
                step="0.1"
                value={settings.targetSleepHoursMin}
                onChange={(e) =>
                  setSettings({ ...settings, targetSleepHoursMin: Number(e.target.value) })
                }
                className="input"
              />
            </Field>
            <Field label="Sleep hours (max)">
              <input
                type="number"
                step="0.1"
                value={settings.targetSleepHoursMax}
                onChange={(e) =>
                  setSettings({ ...settings, targetSleepHoursMax: Number(e.target.value) })
                }
                className="input"
              />
            </Field>
            <Field label="Caffeine cutoff (hrs before sleep)">
              <input
                type="number"
                step="0.5"
                value={settings.targetCaffeineCutoffHoursBeforeSleep}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    targetCaffeineCutoffHoursBeforeSleep: Number(e.target.value),
                  })
                }
                className="input"
              />
            </Field>
          </div>
        </Section>

        <Section title="Audience" eyebrow="Sharing">
          <Field label="This dashboard is for">
            <select
              value={settings.audience}
              onChange={(e) => setSettings({ ...settings, audience: e.target.value })}
              className="input max-w-sm"
            >
              <option value="self-use only">Self-use only</option>
              <option value="shared with clinician">Shared with clinician</option>
              <option value="shared with coach">Shared with coach</option>
            </select>
          </Field>
        </Section>

        <div className="flex flex-wrap items-center gap-4 border-t border-rule pt-6">
          <button type="submit" className="btn">
            Save settings
          </button>
          {savedAt && <span className="text-xs text-muted">Saved at {savedAt}</span>}
          <button type="button" onClick={reset} className="ml-auto btn-ghost">
            Erase all local data
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-8">
      <header className="mb-6 border-b border-rule pb-3">
        <div className="eyebrow mb-1">{eyebrow}</div>
        <h2 className="font-serif text-2xl text-ink">{title}</h2>
      </header>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="eyebrow">{label}</span>
      {children}
    </label>
  );
}
