"use client";

import { useState } from "react";
import { DSA_ASSIGNMENTS } from "@/lib/seed/dsa";
import { ScoreBadge } from "@/components/domain/ScoreBadge";
import { EvalScorePanel } from "@/components/domain/EvalScorePanel";
import { ConceptBadge } from "@/components/domain/ConceptBadge";
import { mockRunEvalJudge } from "@/lib/mock/llm";
import { toast } from "sonner";
import { FlaskConical, Play, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import type { EvalRun } from "@/lib/types";

export default function EvalsPage() {
  const [activeTab, setActiveTab] = useState<"single" | "batch">("single");

  // Single eval
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(DSA_ASSIGNMENTS[0]?.assignment.id || "");
  const [runningEval, setRunningEval] = useState(false);
  const [evalResult, setEvalResult] = useState<EvalRun | null>(null);

  // Batch eval
  const [selectedBatch, setSelectedBatch] = useState<string[]>([]);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchResults, setBatchResults] = useState<Record<string, EvalRun>>({});
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);

  async function handleSingleRun() {
    setRunningEval(true);
    setEvalResult(null);
    try {
      const result = await mockRunEvalJudge(selectedAssignmentId);
      setEvalResult(result);
      toast.success("Eval run complete");
    } catch {
      toast.error("Eval run failed");
    }
    setRunningEval(false);
  }

  async function handleBatchRun() {
    if (selectedBatch.length === 0) {
      toast.error("Select at least one assignment");
      return;
    }
    setBatchRunning(true);
    const results: Record<string, EvalRun> = {};
    for (const id of selectedBatch) {
      const result = await mockRunEvalJudge(id);
      results[id] = result;
      setBatchResults({ ...results });
    }
    setBatchRunning(false);
    toast.success(`Batch eval complete — ${selectedBatch.length} assignments evaluated`);
  }

  function toggleBatchSelect(id: string) {
    setSelectedBatch(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const selectedRecord = DSA_ASSIGNMENTS.find(r => r.assignment.id === selectedAssignmentId);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
          <span>/</span>
          <span className="text-neutral-300">Eval Judge</span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-100">Eval Judge</h1>
        <p className="text-sm text-neutral-400 mt-1">Run evaluation across 6 quality dimensions with LLM-as-judge</p>
      </div>

      {/* Tab switcher */}
      <div className="flex rounded-md border border-white/10 overflow-hidden w-fit mb-6">
        <button onClick={() => setActiveTab("single")} className={`px-4 py-2 text-xs transition-colors ${activeTab === "single" ? "bg-white/10 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"}`}>Single Run</button>
        <button onClick={() => setActiveTab("batch")} className={`px-4 py-2 text-xs transition-colors ${activeTab === "batch" ? "bg-white/10 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"}`}>Batch Run</button>
      </div>

      {activeTab === "single" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-white/8 p-5">
            <label className="text-xs text-neutral-400 mb-2 block">Select Assignment</label>
            <div className="flex items-center gap-3">
              <select
                value={selectedAssignmentId}
                onChange={e => { setSelectedAssignmentId(e.target.value); setEvalResult(null); }}
                className="flex-1 bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-300 outline-none focus:border-indigo-500/60"
              >
                {DSA_ASSIGNMENTS.map(r => (
                  <option key={r.assignment.id} value={r.assignment.id}>{r.assignment.problem.title}</option>
                ))}
              </select>
              <button
                onClick={handleSingleRun}
                disabled={runningEval}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm transition-colors"
              >
                {runningEval ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                Run Eval
              </button>
            </div>

            {selectedRecord && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span>{selectedRecord.assignment.metadata.conceptsRequired.slice(0, 3).map(c => c).join(", ")}</span>
                <span className="text-neutral-700">·</span>
                <span>Status: {selectedRecord.status}</span>
                <span className="text-neutral-700">·</span>
                <span>{selectedRecord.evalRuns.length} previous run{selectedRecord.evalRuns.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>

          {runningEval && (
            <div className="flex items-center gap-3 p-4 rounded-lg border border-indigo-800/30 bg-indigo-900/10">
              <Loader2 size={16} className="text-indigo-400 animate-spin" />
              <p className="text-sm text-indigo-300">Running 3 judge passes across 6 dimensions…</p>
            </div>
          )}

          {evalResult && (
            <div className="rounded-lg border border-white/8 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-neutral-200">Eval Result</p>
                <ScoreBadge score={evalResult.compositeScore} max={5} showMax />
              </div>
              <EvalScorePanel evalRun={evalResult} />
            </div>
          )}

          {!evalResult && !runningEval && selectedRecord && (
            <div className="rounded-lg border border-white/8 p-5">
              <p className="text-xs text-neutral-500 mb-3">Latest stored eval run</p>
              {selectedRecord.evalRuns.length > 0 ? (
                <EvalScorePanel evalRun={selectedRecord.evalRuns[selectedRecord.evalRuns.length - 1]} />
              ) : (
                <p className="text-sm text-neutral-600">No eval runs yet</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "batch" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-white/8 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-white/2 border-b border-white/8">
              <p className="text-xs font-medium text-neutral-400">Select Assignments for Batch Eval</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedBatch(DSA_ASSIGNMENTS.map(r => r.assignment.id))} className="text-xs text-indigo-400 hover:text-indigo-300">Select all</button>
                <button onClick={() => setSelectedBatch([])} className="text-xs text-neutral-500 hover:text-neutral-300">Clear</button>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {DSA_ASSIGNMENTS.map(record => {
                const isSelected = selectedBatch.includes(record.assignment.id);
                const batchResult = batchResults[record.assignment.id];
                return (
                  <div key={record.assignment.id}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer ${isSelected ? "bg-indigo-900/10" : "hover:bg-white/2"}`}
                      onClick={() => toggleBatchSelect(record.assignment.id)}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? "bg-indigo-600 border-indigo-500" : "border-white/20"}`}>
                        {isSelected && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-200 truncate">{record.assignment.problem.title}</p>
                        <p className="text-xs text-neutral-600 font-mono">{record.assignment.id}</p>
                      </div>
                      {batchResult ? (
                        <ScoreBadge score={batchResult.compositeScore} max={5} showMax size="sm" />
                      ) : (
                        record.evalRuns.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-neutral-600">
                            <span>prev:</span>
                            <ScoreBadge score={record.evalRuns[record.evalRuns.length - 1].compositeScore} max={5} size="sm" />
                          </div>
                        )
                      )}
                      {batchResult && (
                        <button
                          onClick={e => { e.stopPropagation(); setExpandedBatch(expandedBatch === record.assignment.id ? null : record.assignment.id); }}
                          className="text-neutral-600 hover:text-neutral-400"
                        >
                          {expandedBatch === record.assignment.id ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        </button>
                      )}
                    </div>
                    {expandedBatch === record.assignment.id && batchResult && (
                      <div className="px-4 pb-4">
                        <EvalScorePanel evalRun={batchResult} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBatchRun}
              disabled={batchRunning || selectedBatch.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >
              {batchRunning ? <Loader2 size={14} className="animate-spin" /> : <FlaskConical size={14} />}
              {batchRunning ? `Running ${selectedBatch.length} evals…` : `Run Batch Eval (${selectedBatch.length})`}
            </button>
            {Object.keys(batchResults).length > 0 && (
              <span className="text-xs text-neutral-500">{Object.keys(batchResults).length} eval{Object.keys(batchResults).length !== 1 ? "s" : ""} complete</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
