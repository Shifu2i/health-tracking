import { GuidelineRule } from "./types";

/**
 * Verbatim guideline rules.
 *
 * Each rule MUST contain:
 * - `quote`: the exact, verbatim text of the guideline as supplied by the user.
 *   Do not paraphrase. Preserve original wording, spelling of proper nouns
 *   (Andrew Huberman, Brain Johnsson, Bevel, Huberman Lab), and formatting.
 * - `attribution`: the originating expert. One of:
 *     "Andrew Huberman"
 *   | "Brain Johnsson"
 *   | "Huberman Lab guest: <name>"
 * - `trigger`: a pure function over UserData that returns true when the
 *   guideline applies to the user's most recent logged data.
 *
 * This array is intentionally empty until the user pastes their verbatim
 * guideline list. With no rules loaded, the recommendation engine returns the
 * "Not covered" response defined in docs/MASTER_PROMPT.md.
 */
export const RULES: GuidelineRule[] = [];
