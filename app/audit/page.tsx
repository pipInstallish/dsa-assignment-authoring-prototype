"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { AuditEntry } from "@/lib/types";

// Seeded audit entries
const AUDIT_ENTRIES: AuditEntry[] = [
  { id: "audit-001", timestamp: "2026-02-05T14:23:00Z", actor: "Sarah Chen", objectType: "assignment", objectId: "assign-001", action: "approved", details: "Approved after first generation — all checks passed." },
  { id: "audit-002", timestamp: "2026-02-05T16:10:00Z", actor: "pipeline:1.4.2", objectType: "eval_run", objectId: "eval-001-a", action: "eval_run_completed", details: "Composite score: 4.43/5 — passed all thresholds." },
  { id: "audit-003", timestamp: "2026-02-06T09:15:00Z", actor: "pipeline:1.4.2", objectType: "assignment", objectId: "assign-002", action: "generated", details: "Sliding window concept set — iteration 1." },
  { id: "audit-004", timestamp: "2026-02-06T09:18:00Z", actor: "pipeline:1.4.2", objectType: "eval_run", objectId: "eval-002-a", action: "eval_run_failed", details: "Composite 3.38 below threshold 3.5 — triggered refinement.", versionDelta: { from: "3.38", to: undefined } },
  { id: "audit-005", timestamp: "2026-02-06T09:25:00Z", actor: "pipeline:1.4.2", objectType: "assignment", objectId: "assign-002", action: "refined", details: "Refinement triggered by soft_score_fail — rubric_alignment 2.8. Iteration 2." },
  { id: "audit-006", timestamp: "2026-02-06T09:30:00Z", actor: "Sarah Chen", objectType: "assignment", objectId: "assign-002", action: "approved", details: "Approved after refinement — score improved to 4.18." },
  { id: "audit-007", timestamp: "2026-02-06T11:00:00Z", actor: "pipeline:1.4.2", objectType: "assignment", objectId: "assign-006", action: "hard_check_failed", details: "Concept containment failure: dynamic_programming_2d not in class context scope." },
  { id: "audit-008", timestamp: "2026-02-07T08:45:00Z", actor: "Sarah Chen", objectType: "concept", objectId: "segment-tree-proposal", action: "concept_proposed", details: "Proposed Segment Tree concept for taxonomy v2." },
  { id: "audit-009", timestamp: "2026-02-07T10:20:00Z", actor: "auto_iterator", objectType: "prompt", objectId: "proposal-gen-v4", action: "prompt_proposal_submitted", details: "Scenario diversity constraint — novelty median +0.4 on gold set." },
  { id: "audit-010", timestamp: "2026-02-07T10:25:00Z", actor: "auto_iterator", objectType: "prompt", objectId: "proposal-judge-align-v2", action: "prompt_proposal_submitted", details: "Rubric alignment anchor update — concept_rubric_alignment +0.6 on borderline cases." },
  { id: "audit-011", timestamp: "2026-02-08T14:00:00Z", actor: "pipeline:1.4.2", objectType: "assignment", objectId: "assign-005", action: "refinement_exhausted", details: "Max 3 iterations reached — all below composite threshold 3.5." },
  { id: "audit-012", timestamp: "2026-02-09T09:00:00Z", actor: "Sarah Chen", objectType: "assignment", objectId: "assign-004", action: "rejected", details: "Problem statement too abstract — not grounded in real-world context." },
  { id: "audit-013", timestamp: "2026-02-10T11:30:00Z", actor: "Sarah Chen", objectType: "gold_set_entry", objectId: "gold-007", action: "gold_set_entry_created", details: "BFS shortest path in network topology — canonical status." },
  { id: "audit-014", timestamp: "2026-02-11T15:45:00Z", actor: "Sarah Chen", objectType: "class_context", objectId: "ctx-arrays-and-hashing", action: "class_context_created", details: "Arrays and hashing — Week 1 module, 4 confirmed concepts." },
  { id: "audit-015", timestamp: "2026-02-12T10:00:00Z", actor: "pipeline:1.4.2", objectType: "eval_run", objectId: "eval-003-a", action: "eval_run_completed", details: "Awaiting approval assignment — composite 4.05." },
];

const ACTION_COLORS: Record<string, string> = {
  approved: "text-emerald-400",
  rejected: "text-rose-400",
  generated: "text-blue-400",
  refined: "text-amber-400",
  eval_run_completed: "text-indigo-400",
  eval_run_failed: "text-rose-400",
  hard_check_failed: "text-rose-400",
  concept_proposed: "text-purple-400",
  prompt_proposal_submitted: "text-amber-400",
  refinement_exhausted: "text-rose-400",
  gold_set_entry_created: "text-emerald-400",
  class_context_created: "text-blue-400",
};

const OBJECT_TYPE_LABELS: Record<string, string> = {
  assignment: "Assignment",
  gold_set_entry: "Gold Set",
  concept: "Concept",
  prompt: "Prompt",
  class_context: "Class Context",
  eval_run: "Eval Run",
};

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = AUDIT_ENTRIES.filter(e => {
    const matchSearch = !search || e.action.includes(search.toLowerCase()) || e.actor.toLowerCase().includes(search.toLowerCase()) || e.objectId.includes(search.toLowerCase());
    const matchType = !typeFilter || e.objectType === typeFilter;
    return matchSearch && matchType;
  }).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <span className="text-neutral-300">Audit Log</span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-100">Audit Log</h1>
        <p className="text-sm text-neutral-400 mt-1">Immutable record of all pipeline events across all categories</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search actions, actors, IDs..."
            className="w-full bg-neutral-800/60 border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 placeholder:text-neutral-600"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="bg-neutral-800/60 border border-white/10 rounded-md px-3 py-2 text-xs text-neutral-300 outline-none focus:border-indigo-500/60"
        >
          <option value="">All types</option>
          {Object.entries(OBJECT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="text-xs text-neutral-600 ml-auto">{filtered.length} entries</span>
      </div>

      <div className="rounded-lg border border-white/8 overflow-hidden">
        <div className="grid grid-cols-[140px_120px_120px_1fr] text-xs text-neutral-500 border-b border-white/8 bg-white/2">
          <div className="px-4 py-2.5">Timestamp</div>
          <div className="px-4 py-2.5">Actor</div>
          <div className="px-4 py-2.5">Object Type</div>
          <div className="px-4 py-2.5">Event</div>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.map(entry => (
            <div key={entry.id}>
              <button
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                className="grid grid-cols-[140px_120px_120px_1fr] w-full text-left hover:bg-white/2 transition-colors"
              >
                <div className="px-4 py-3 text-xs text-neutral-600 font-mono">
                  {entry.timestamp.slice(0, 10)}<br />
                  <span className="text-neutral-700">{entry.timestamp.slice(11, 16)}</span>
                </div>
                <div className="px-4 py-3 text-xs text-neutral-400 truncate">
                  {entry.actor.startsWith("pipeline") ? <span className="font-mono text-neutral-600">{entry.actor}</span> : entry.actor}
                </div>
                <div className="px-4 py-3 text-xs text-neutral-500">
                  {OBJECT_TYPE_LABELS[entry.objectType] || entry.objectType}
                </div>
                <div className="px-4 py-3">
                  <span className={`text-xs font-medium ${ACTION_COLORS[entry.action] || "text-neutral-400"}`}>{entry.action.replace(/_/g, " ")}</span>
                  <span className="text-xs text-neutral-600 ml-2 font-mono">{entry.objectId}</span>
                </div>
              </button>
              {expanded === entry.id && (
                <div className="px-4 pb-3">
                  <div className="ml-[380px] p-3 rounded-md bg-white/3 border border-white/8 text-xs text-neutral-400">
                    <p>{entry.details}</p>
                    {entry.versionDelta && (
                      <p className="mt-1 font-mono text-neutral-600">
                        {entry.versionDelta.from !== undefined && `from: ${entry.versionDelta.from}`}
                        {entry.versionDelta.to !== undefined && ` → to: ${entry.versionDelta.to}`}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-neutral-500 text-sm">No audit entries match filters</div>
          )}
        </div>
      </div>
    </div>
  );
}
