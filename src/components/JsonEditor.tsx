"use client";

import { useRef, useEffect, useState } from "react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  errorLine: number | null;
  errorColumn: number | null;
}

export default function JsonEditor({
  value,
  onChange,
  error,
  errorLine,
  errorColumn,
}: JsonEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = value.split("\n").length;
    setLineCount(lines);
  }, [value]);

  function handleScroll() {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.slice(0, start) + "  " + value.slice(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Editor
        </span>
        <span className="text-[10px] text-slate-500">
          {lineCount} lines &middot; {value.length} chars
        </span>
      </div>

      {error && (
        <div className="px-3 py-1.5 bg-red-500/10 border-b border-red-500/20 text-xs text-red-400 font-mono">
          {error}
          {errorLine && (
            <span className="ml-2 text-red-500/70">
              (line {errorLine}{errorColumn ? `, col ${errorColumn}` : ""})
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="flex-shrink-0 overflow-hidden bg-panel/50 border-r border-border
            text-right select-none pt-3 pr-2 pl-2"
          style={{ width: "3.5rem" }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className={`text-[11px] leading-[1.6rem] font-mono
                ${errorLine === i + 1 ? "text-red-400" : "text-slate-600"}`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="Paste JSON here..."
          className="flex-1 bg-transparent resize-none p-3
            font-mono text-sm leading-[1.6rem] text-slate-200
            focus:outline-none scrollbar-thin"
        />
      </div>
    </div>
  );
}
