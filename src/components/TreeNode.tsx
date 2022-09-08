"use client";

import { useState } from "react";
import { getValueType, getValuePreview } from "@/lib/parser";
import { copyToClipboard } from "@/lib/formatter";
import { JsonValueType } from "@/lib/types";

interface TreeNodeProps {
  nodeKey: string;
  value: unknown;
  depth: number;
  isLast: boolean;
  defaultExpanded?: boolean;
}

const TYPE_COLORS: Record<JsonValueType, string> = {
  string: "text-json-string",
  number: "text-json-number",
  boolean: "text-json-bool",
  null: "text-json-null",
  object: "text-slate-400",
  array: "text-slate-400",
};

const TYPE_BADGES: Record<JsonValueType, string> = {
  string: "bg-cyan-500/10 text-cyan-400",
  number: "bg-amber-500/10 text-amber-400",
  boolean: "bg-purple-500/10 text-purple-400",
  null: "bg-slate-500/10 text-slate-500",
  object: "bg-indigo-500/10 text-indigo-400",
  array: "bg-emerald-500/10 text-emerald-400",
};

export default function TreeNode({
  nodeKey,
  value,
  depth,
  isLast,
  defaultExpanded = true,
}: TreeNodeProps) {
  const type = getValueType(value);
  const isExpandable = type === "object" || type === "array";
  const [expanded, setExpanded] = useState(defaultExpanded && depth < 3);
  const [copied, setCopied] = useState(false);

  const childEntries = isExpandable
    ? type === "array"
      ? (value as unknown[]).map((v, i) => [String(i), v] as const)
      : Object.entries(value as Record<string, unknown>)
    : [];

  async function handleCopy() {
    const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  function renderValue() {
    if (type === "string") return <span className={TYPE_COLORS.string}>&quot;{String(value)}&quot;</span>;
    if (type === "null") return <span className={TYPE_COLORS.null}>null</span>;
    return <span className={TYPE_COLORS[type]}>{String(value)}</span>;
  }

  return (
    <div style={{ paddingLeft: `${depth * 16}px` }}>
      <div className="flex items-center gap-1.5 group py-0.5 hover:bg-white/[0.02] rounded px-1 -mx-1">
        {/* Expand toggle */}
        {isExpandable ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-4 h-4 flex items-center justify-center text-slate-500
              hover:text-slate-300 transition-colors flex-shrink-0"
          >
            <svg
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6 4l8 6-8 6V4z" />
            </svg>
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}

        {/* Key */}
        <span className="text-json-key text-xs font-mono font-medium">
          {nodeKey}
        </span>
        <span className="text-slate-600 text-xs">:</span>

        {/* Value or preview */}
        {isExpandable ? (
          <span className="text-xs text-slate-500 font-mono">
            {expanded ? (type === "array" ? "[" : "{") : getValuePreview(value)}
          </span>
        ) : (
          <span className="text-xs font-mono">{renderValue()}</span>
        )}

        {/* Type badge */}
        <span className={`text-[9px] px-1 py-0.5 rounded font-mono ${TYPE_BADGES[type]}
          opacity-0 group-hover:opacity-100 transition-opacity`}>
          {type}
          {type === "array" && `(${(value as unknown[]).length})`}
          {type === "object" && `(${Object.keys(value as Record<string, unknown>).length})`}
        </span>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="text-[10px] text-slate-600 hover:text-slate-300 opacity-0 group-hover:opacity-100
            transition-all ml-auto"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Children */}
      {isExpandable && expanded && (
        <div>
          {childEntries.map(([k, v], i) => (
            <TreeNode
              key={`${depth}-${k}-${i}`}
              nodeKey={k}
              value={v}
              depth={depth + 1}
              isLast={i === childEntries.length - 1}
              defaultExpanded={depth < 2}
            />
          ))}
          <div
            style={{ paddingLeft: `${(depth) * 16 + 20}px` }}
            className="text-xs text-slate-500 font-mono"
          >
            {type === "array" ? "]" : "}"}
          </div>
        </div>
      )}
    </div>
  );
}
