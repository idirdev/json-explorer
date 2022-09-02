/**
 * Format JSON string with indentation.
 */
export function formatJson(input: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, indent);
  } catch {
    return input;
  }
}

/**
 * Minify JSON string (remove whitespace).
 */
export function minifyJson(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch {
    return input;
  }
}

/**
 * Sort all object keys recursively (alphabetical).
 */
export function sortKeys(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;

  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }

  const obj = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = sortKeys(obj[key]);
  }
  return sorted;
}

/**
 * Sort keys and return formatted JSON string.
 */
export function sortAndFormat(input: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(input);
    const sorted = sortKeys(parsed);
    return JSON.stringify(sorted, null, indent);
  } catch {
    return input;
  }
}

/**
 * Download content as a .json file.
 */
export function downloadJson(content: string, filename: string = "data.json"): void {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sample JSON data for quick testing.
 */
export const sampleData = {
  name: "JSON Explorer",
  version: "1.0.0",
  author: {
    name: "idirdev",
    url: "https://github.com/idirdev",
  },
  features: ["tree view", "formatting", "minification", "search"],
  stats: {
    lines: 500,
    components: 5,
    active: true,
  },
  tags: null,
  nested: {
    level1: {
      level2: {
        level3: {
          value: "deep nested value",
          array: [1, 2, 3, [4, 5]],
        },
      },
    },
  },
};
