"use client";

import { useState, useMemo } from "react";
import JsonEditor from "@/components/JsonEditor";
import TreeView from "@/components/TreeView";
import Toolbar from "@/components/Toolbar";
import { safeJsonParse } from "@/lib/parser";
import { sampleData } from "@/lib/formatter";

const INITIAL_JSON = JSON.stringify(sampleData, null, 2);

export default function Home() {
  const [jsonInput, setJsonInput] = useState(INITIAL_JSON);

  const parseResult = useMemo(() => safeJsonParse(jsonInput), [jsonInput]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <span className="text-accent font-bold text-sm">{ }</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-200">JSON Explorer</h1>
              <p className="text-[10px] text-slate-500">by idirdev</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {parseResult.error ? (
              <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full">
                Invalid JSON
              </span>
            ) : jsonInput.trim() ? (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
                Valid JSON
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <Toolbar value={jsonInput} onChange={setJsonInput} />

      {/* Split View */}
      <main className="flex-1 flex min-h-0">
        {/* Left: Editor */}
        <div className="w-1/2 border-r border-border flex flex-col min-h-[calc(100vh-7rem)]">
          <JsonEditor
            value={jsonInput}
            onChange={setJsonInput}
            error={parseResult.error}
            errorLine={parseResult.errorLine}
            errorColumn={parseResult.errorColumn}
          />
        </div>

        {/* Right: Tree View */}
        <div className="w-1/2 flex flex-col min-h-[calc(100vh-7rem)]">
          <TreeView data={parseResult.data} />
        </div>
      </main>
    </div>
  );
}
