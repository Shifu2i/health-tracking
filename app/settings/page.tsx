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
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted">
          Bevel API connection, target metric ranges, and audience. All data is stored
          in your browser only.
        </p>
      </header>

      <form onSubmit={save} className="space-y-6">
        <section className="rounded border border-border bg-panel p-4">
          <h2 className="mb-3 text-lg font-semibold">Bevel API</h2>
          <div className="grid gap-3 sm:grid-cols-2">
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
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
            <span className={status.configured ? "text-ok" : "text-muted"}>
              {status.configured ? `Configured: ${status.baseUrl}` : status.reason}
            </span>
            <button
              type="button"
              onClick={sync}
              disabled={!status.configured || syncing}
              className="rounded bg-accent px-3 py-1 text-bg disabled:opacity-50"
            >
              {syncing ? "Syncing…" : "Sync now"}
            </button>
            {syncMsg && <span className="text-muted">{syncMsg}</span>}
          </div>
        </section>

        <section className="rounded border border-border bg-panel p-4">
          <h2 className="mb-3 text-lg font-semibold">Target metric ranges</h2>
          <div className="grid gap-3 sm:grid-cols-3">
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
            <Field label="Caffeine cutoff (hours before sleep)">
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
        </section>

        <section className="rounded border border-border bg-panel p-4">
          <h2 className="mb-3 text-lg font-semibold">Audience</h2>
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
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90"
          >
            Save settings
          </button>
          {savedAt && <span className="text-xs text-muted">Saved at {savedAt}</span>}
          <button
            type="button"
            onClick={reset}
            className="ml-auto rounded border border-bad/60 px-3 py-1 text-sm text-bad hover:bg-bad/10"
          >
            Erase all local data
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}
