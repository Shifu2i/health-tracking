"use client";

import {
  DEFAULT_SETTINGS,
  EMPTY_USER_DATA,
  IntakeLog,
  Medication,
  MetricLog,
  Settings,
  SideEffectLog,
  UserData,
} from "./types";

const STORAGE_KEY = "health-tracking:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadUserData(): UserData {
  if (!isBrowser()) return EMPTY_USER_DATA;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_USER_DATA;
    const parsed = JSON.parse(raw) as Partial<UserData>;
    return {
      medications: parsed.medications ?? [],
      intakeLogs: parsed.intakeLogs ?? [],
      sideEffects: parsed.sideEffects ?? [],
      metrics: parsed.metrics ?? [],
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
    };
  } catch {
    return EMPTY_USER_DATA;
  }
}

export function saveUserData(data: UserData): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function update<T extends keyof UserData>(key: T, updater: (cur: UserData[T]) => UserData[T]): UserData {
  const data = loadUserData();
  const next = { ...data, [key]: updater(data[key]) };
  saveUserData(next);
  return next;
}

export function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function addMedication(med: Omit<Medication, "id">): Medication {
  const withId: Medication = { ...med, id: genId("med") };
  update("medications", (list) => [...list, withId]);
  return withId;
}

export function updateMedication(id: string, patch: Partial<Medication>): void {
  update("medications", (list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)));
}

export function deleteMedication(id: string): void {
  update("medications", (list) => list.filter((m) => m.id !== id));
  update("intakeLogs", (list) => list.filter((l) => l.medicationId !== id));
  update("sideEffects", (list) => list.filter((s) => s.medicationId !== id));
}

export function logIntake(log: Omit<IntakeLog, "id">): IntakeLog {
  const withId: IntakeLog = { ...log, id: genId("intake") };
  update("intakeLogs", (list) => [...list, withId]);
  return withId;
}

export function logSideEffect(log: Omit<SideEffectLog, "id">): SideEffectLog {
  const withId: SideEffectLog = { ...log, id: genId("side") };
  update("sideEffects", (list) => [...list, withId]);
  return withId;
}

export function logMetric(log: Omit<MetricLog, "id">): MetricLog {
  const withId: MetricLog = { ...log, id: genId("metric") };
  update("metrics", (list) => [...list, withId]);
  return withId;
}

export function saveSettings(patch: Partial<Settings>): Settings {
  const data = loadUserData();
  const next: Settings = { ...data.settings, ...patch };
  saveUserData({ ...data, settings: next });
  return next;
}

export function clearAll(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
