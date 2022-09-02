import { JsonParseResult, JsonValueType } from "./types";

/**
 * Safely parse JSON with detailed error location info.
 */
export function safeJsonParse(input: string): JsonParseResult {
  if (!input.trim()) {
    return { data: null, error: null, errorLine: null, errorColumn: null };
  }

  try {
    const data = JSON.parse(input);
    return { data, error: null, errorLine: null, errorColumn: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON";
    const posMatch = message.match(/position\s+(\d+)/i);
    let errorLine: number | null = null;
    let errorColumn: number | null = null;

    if (posMatch) {
      const position = parseInt(posMatch[1], 10);
      const upToError = input.slice(0, position);
      const lines = upToError.split("\n");
      errorLine = lines.length;
      errorColumn = lines[lines.length - 1].length + 1;
    }

    return { data: null, error: message, errorLine, errorColumn };
  }
}

/**
 * Determine the JSON value type of a value.
 */
export function getValueType(value: unknown): JsonValueType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  const t = typeof value;
  if (t === "string") return "string";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";
  return "object";
}

/**
 * Count the total number of keys/elements in a JSON structure.
 */
export function countNodes(value: unknown): number {
  if (value === null || typeof value !== "object") return 1;

  if (Array.isArray(value)) {
    return value.reduce((sum: number, item) => sum + countNodes(item), 1);
  }

  return Object.values(value as Record<string, unknown>).reduce(
    (sum: number, v) => sum + countNodes(v),
    1
  );
}

/**
 * Get a preview string for a value (used in collapsed tree nodes).
 */
export function getValuePreview(value: unknown, maxLen: number = 60): string {
  if (value === null) return "null";
  if (typeof value === "string") {
    if (value.length > maxLen) return `"${value.slice(0, maxLen)}..."`;
    return `"${value}"`;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return `Array(${value.length})`;
  }
  if (typeof value === "object") {
    const keys = Object.keys(value as Record<string, unknown>);
    return `Object { ${keys.slice(0, 3).join(", ")}${keys.length > 3 ? ", ..." : ""} }`;
  }
  return String(value);
}
