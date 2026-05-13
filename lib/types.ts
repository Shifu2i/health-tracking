export type Medication = {
  id: string;
  name: string;
  dose: string;
  route: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  reminderTimes: string[];
};

export type IntakeStatus = "taken" | "missed" | "skipped";

export type IntakeLog = {
  id: string;
  medicationId: string;
  timestamp: string;
  status: IntakeStatus;
  note?: string;
};

export type SideEffectLog = {
  id: string;
  medicationId: string;
  timestamp: string;
  description: string;
  severity: 1 | 2 | 3 | 4 | 5;
};

export type MetricLog = {
  id: string;
  timestamp: string;
  date: string;
  sleepHours?: number;
  sleepQuality?: number;
  bedtime?: string;
  wakeTime?: string;
  hrv?: number;
  restingHeartRate?: number;
  morningLightMinutes?: number;
  eveningLightExposure?: "low" | "medium" | "high";
  caffeineMg?: number;
  lastCaffeineTime?: string;
  firstMealTime?: string;
  lastMealTime?: string;
  exerciseType?: string;
  exerciseMinutes?: number;
  exerciseIntensity?: "low" | "medium" | "high";
  moodAm?: number;
  moodPm?: number;
  energyAm?: number;
  energyPm?: number;
  source: "manual" | "bevel";
  notes?: string;
};

export type Settings = {
  bevelApiBaseUrl: string;
  bevelApiKey: string;
  bevelPollIntervalMinutes: number;
  targetSleepHoursMin: number;
  targetSleepHoursMax: number;
  targetCaffeineCutoffHoursBeforeSleep: number;
  audience: string;
};

export type UserData = {
  medications: Medication[];
  intakeLogs: IntakeLog[];
  sideEffects: SideEffectLog[];
  metrics: MetricLog[];
  settings: Settings;
};

export type GuidelineRule = {
  id: string;
  topic: string;
  quote: string;
  attribution: string;
  severity: "low" | "medium" | "high";
  trigger: (data: UserData) => boolean;
};

export type Recommendation = {
  ruleId: string;
  topic: string;
  quote: string;
  attribution: string;
  severity: "low" | "medium" | "high";
  application: string;
};

export type Alert = {
  id: string;
  kind: "missed-medication" | "metric-deviation";
  title: string;
  detail: string;
  relatedGuideline?: string;
  nextStep: string;
  timestamp: string;
};

export const DEFAULT_SETTINGS: Settings = {
  bevelApiBaseUrl: "",
  bevelApiKey: "",
  bevelPollIntervalMinutes: 60,
  targetSleepHoursMin: 7,
  targetSleepHoursMax: 9,
  targetCaffeineCutoffHoursBeforeSleep: 8,
  audience: "self-use only",
};

export const EMPTY_USER_DATA: UserData = {
  medications: [],
  intakeLogs: [],
  sideEffects: [],
  metrics: [],
  settings: DEFAULT_SETTINGS,
};
