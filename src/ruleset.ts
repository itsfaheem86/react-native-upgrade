import fs from "node:fs";
import path from "node:path";

export type RulesetEntry = {
  kotlin_min?: string;
  gradle_min?: string;
  agp_min?: string;
  hermes_default?: boolean;
};

export type Ruleset = Record<string, RulesetEntry>;

const RULESET_PATH = path.join(__dirname, "data", "ruleset.json");

const isString = (value: unknown): value is string => typeof value === "string";

const isRulesetEntry = (value: unknown): value is RulesetEntry => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const entry = value as Record<string, unknown>;
  return (
    (entry.kotlin_min === undefined || isString(entry.kotlin_min)) &&
    (entry.gradle_min === undefined || isString(entry.gradle_min)) &&
    (entry.agp_min === undefined || isString(entry.agp_min)) &&
    (entry.hermes_default === undefined ||
      typeof entry.hermes_default === "boolean")
  );
};

export const loadRuleset = (): Ruleset => {
  const raw = fs.readFileSync(RULESET_PATH, "utf8");
  const data = JSON.parse(raw) as unknown;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Ruleset must be a JSON object keyed by RN version.");
  }

  const ruleset: Ruleset = {};

  for (const [version, entry] of Object.entries(
    data as Record<string, unknown>,
  )) {
    if (!isRulesetEntry(entry)) {
      throw new Error(`Invalid ruleset entry for version: ${version}`);
    }
    ruleset[version] = entry;
  }

  return ruleset;
};
