"use client";

import { cn } from "@/lib/utils";

const CONCEPT_COLORS: Record<string, string> = {
  arrays: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  array_techniques: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  two_pointers: "bg-cyan-900/40 text-cyan-300 border-cyan-700/40",
  sliding_window: "bg-teal-900/40 text-teal-300 border-teal-700/40",
  prefix_sum: "bg-sky-900/40 text-sky-300 border-sky-700/40",
  hashmaps: "bg-violet-900/40 text-violet-300 border-violet-700/40",
  frequency_counting: "bg-purple-900/40 text-purple-300 border-purple-700/40",
  hashmap_lookup: "bg-fuchsia-900/40 text-fuchsia-300 border-fuchsia-700/40",
  strings: "bg-rose-900/40 text-rose-300 border-rose-700/40",
  string_manipulation: "bg-pink-900/40 text-pink-300 border-pink-700/40",
  linked_lists: "bg-orange-900/40 text-orange-300 border-orange-700/40",
  linked_list_traversal: "bg-amber-900/40 text-amber-300 border-amber-700/40",
  fast_slow_pointers: "bg-yellow-900/40 text-yellow-300 border-yellow-700/40",
  stacks: "bg-red-900/40 text-red-300 border-red-700/40",
  monotonic_stack: "bg-red-900/50 text-red-300 border-red-700/50",
  queues: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  trees: "bg-green-900/40 text-green-300 border-green-700/40",
  tree_traversal_dfs: "bg-green-900/50 text-green-300 border-green-700/50",
  tree_traversal_bfs: "bg-lime-900/40 text-lime-300 border-lime-700/40",
  binary_search_tree: "bg-emerald-900/50 text-emerald-300 border-emerald-700/50",
  graphs: "bg-indigo-900/40 text-indigo-300 border-indigo-700/40",
  graph_traversal_dfs: "bg-indigo-900/50 text-indigo-300 border-indigo-700/50",
  graph_traversal_bfs: "bg-blue-900/50 text-blue-300 border-blue-700/50",
  topological_sort: "bg-violet-900/50 text-violet-300 border-violet-700/50",
  heaps: "bg-pink-900/40 text-pink-300 border-pink-700/40",
  priority_queue: "bg-fuchsia-900/50 text-fuchsia-300 border-fuchsia-700/50",
  sorting: "bg-slate-700/40 text-slate-300 border-slate-600/40",
  binary_search: "bg-cyan-900/50 text-cyan-300 border-cyan-700/50",
  recursion: "bg-amber-900/50 text-amber-300 border-amber-700/50",
  dynamic_programming_1d: "bg-orange-900/40 text-orange-300 border-orange-700/40",
  dynamic_programming_2d: "bg-red-900/40 text-red-300 border-red-700/40",
  divide_and_conquer: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50",
  greedy: "bg-lime-900/50 text-lime-300 border-lime-700/50",
};

const DEFAULT_COLOR = "bg-neutral-800 text-neutral-300 border-neutral-700";

interface ConceptBadgeProps {
  conceptId: string;
  label?: string;
  size?: "xs" | "sm" | "md";
  onRemove?: () => void;
}

export function ConceptBadge({ conceptId, label, size = "sm", onRemove }: ConceptBadgeProps) {
  const colorClass = CONCEPT_COLORS[conceptId] || DEFAULT_COLOR;
  const displayLabel = label || conceptId.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border rounded font-medium",
        colorClass,
        size === "xs" && "text-[10px] px-1.5 py-0.5",
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-sm px-2.5 py-1"
      )}
    >
      {displayLabel}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-60 transition-opacity text-current"
        >
          ×
        </button>
      )}
    </span>
  );
}
