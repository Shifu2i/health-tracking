import { RULES } from "./guideline-rules";
import { Recommendation, UserData } from "./types";

export const NOT_COVERED_MESSAGE =
  "This topic is not covered in your loaded expert recommendation base. Please add a source.";

export function hasGuidelineBase(): boolean {
  return RULES.length > 0;
}

export function generateRecommendations(data: UserData): Recommendation[] {
  if (RULES.length === 0) return [];
  const out: Recommendation[] = [];
  for (const rule of RULES) {
    try {
      if (rule.trigger(data)) {
        out.push({
          ruleId: rule.id,
          topic: rule.topic,
          quote: rule.quote,
          attribution: rule.attribution,
          severity: rule.severity,
          application: applicationFor(rule.topic, data),
        });
      }
    } catch {
      // A faulty trigger function must never crash the dashboard.
    }
  }
  return out.sort(bySeverity);
}

export function topRecommendations(data: UserData, n: number): Recommendation[] {
  return generateRecommendations(data).slice(0, n);
}

function bySeverity(a: Recommendation, b: Recommendation): number {
  const order = { high: 0, medium: 1, low: 2 } as const;
  return order[a.severity] - order[b.severity];
}

function applicationFor(_topic: string, _data: UserData): string {
  // Plain-language framing for how the cited guideline applies to the user's
  // logged data. Kept neutral and non-prescriptive per the safety contract.
  return "Based on your recent logged data, this guideline applies.";
}
