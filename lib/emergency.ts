const EMERGENCY_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\bsuicid(e|al)\b/i, label: "suicidal ideation" },
  { pattern: /\bkill\s+myself\b/i, label: "self-harm" },
  { pattern: /\bself[-\s]?harm\b/i, label: "self-harm" },
  { pattern: /\boverdose\b/i, label: "overdose risk" },
  { pattern: /\bchest\s+pain\b/i, label: "possible cardiac symptom" },
  { pattern: /\bcan'?t\s+breathe\b/i, label: "breathing difficulty" },
  { pattern: /\bstroke\b/i, label: "possible stroke symptom" },
];

export type EmergencyHit = { matched: true; label: string } | { matched: false };

export function detectEmergency(text: string | undefined | null): EmergencyHit {
  if (!text) return { matched: false };
  for (const { pattern, label } of EMERGENCY_PATTERNS) {
    if (pattern.test(text)) return { matched: true, label };
  }
  return { matched: false };
}

export const EMERGENCY_GUIDANCE = [
  "If this is a life-threatening emergency, call your local emergency number now (911 in the US, 999 in the UK, 112 in the EU).",
  "US: 988 Suicide & Crisis Lifeline (call or text 988).",
  "UK: Samaritans 116 123.",
  "International directory: https://findahelpline.com",
] as const;
