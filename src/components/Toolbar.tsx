"use client";

import { useState } from "react";
import { formatJson, minifyJson, sortAndFormat, downloadJson, copyToClipboard, sampleData } from "@/lib/formatter";

interface ToolbarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Toolbar({ value, onChange }: ToolbarProps) {
  const [copyFeedback, setCopyFeedback] = useState(false);

  function handleFormat() {
    onChange(formatJson(value));
  }

  function handleMinify() {
    onChange(minifyJson(value));
  }

  function handleSortKeys() {
    onChange(sortAndFormat(value));
  }

  async function handleCopy() {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    }
  }

  function handleDownload() {
    downloadJson(value);
  }

  function handleSample() {
    onChange(JSON.stringify(sampleData, null, 2));
  }

  function handleClear() {
    onChange("");
  }

  const buttons = [
    { label: "Format", onClick: handleFormat, title: "Pretty print with 2-space indent" },
    { label: "Minify", onClick: handleMinify, title: "Remove all whitespace" },
    { label: "Sort Keys", onClick: handleSortKeys, title: "Alphabetically sort all object keys" },
    { label: copyFeedback ? "Copied!" : "Copy", onClick: handleCopy, title: "Copy to clipboard" },
    { label: "Download", onClick: handleDownload, title: "Download as .json file" },
    { label: "Sample", onClick: handleSample, title: "Load sample JSON data" },
    { label: "Clear", onClick: handleClear, title: "Clear editor" },
  ];

  return (
    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-panel/50 overflow-x-auto">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          onClick={btn.onClick}
          title={btn.title}
          className="px-2.5 py-1 text-[11px] font-medium text-slate-400
            hover:text-slate-200 hover:bg-white/5 rounded-md transition-all
            border border-transparent hover:border-border whitespace-nowrap"
        >
          {btn.label}
        </button>
      ))}

      <div className="ml-auto flex items-center gap-2 text-[10px] text-slate-600">
        <kbd className="px-1 py-0.5 border border-border rounded text-[9px]">Tab</kbd>
        <span>indent</span>
      </div>
    </div>
  );
}
