export type JsonValueType = "string" | "number" | "boolean" | "null" | "object" | "array";

export interface JsonParseResult {
  data: unknown;
  error: string | null;
  errorLine: number | null;
  errorColumn: number | null;
}

export interface TreeNodeData {
  key: string;
  value: unknown;
  type: JsonValueType;
  path: string;
  depth: number;
  childCount?: number;
}
