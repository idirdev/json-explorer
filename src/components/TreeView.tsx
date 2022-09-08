"use client";

import TreeNode from "./TreeNode";
import { getValueType, countNodes } from "@/lib/parser";

interface TreeViewProps {
  data: unknown;
}

export default function TreeView({ data }: TreeViewProps) {
  if (data === undefined || data === null) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-sm">
        <div className="text-center space-y-2">
          <div className="text-3xl opacity-30">{ }</div>
          <p>Enter valid JSON in the editor to see the tree view</p>
        </div>
      </div>
    );
  }

  const type = getValueType(data);
  const nodeCount = countNodes(data);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Tree View
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500">
            {nodeCount} node{nodeCount !== 1 ? "s" : ""}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-mono">
            {type}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 scrollbar-thin">
        {type === "object" || type === "array" ? (
          <div>
            <span className="text-xs text-slate-500 font-mono">
              {type === "array" ? "[" : "{"}
            </span>
            {type === "array"
              ? (data as unknown[]).map((item, i) => (
                  <TreeNode
                    key={i}
                    nodeKey={String(i)}
                    value={item}
                    depth={1}
                    isLast={i === (data as unknown[]).length - 1}
                  />
                ))
              : Object.entries(data as Record<string, unknown>).map(
                  ([key, value], i, arr) => (
                    <TreeNode
                      key={key}
                      nodeKey={key}
                      value={value}
                      depth={1}
                      isLast={i === arr.length - 1}
                    />
                  )
                )}
            <span className="text-xs text-slate-500 font-mono">
              {type === "array" ? "]" : "}"}
            </span>
          </div>
        ) : (
          <TreeNode
            nodeKey="(root)"
            value={data}
            depth={0}
            isLast={true}
          />
        )}
      </div>
    </div>
  );
}
