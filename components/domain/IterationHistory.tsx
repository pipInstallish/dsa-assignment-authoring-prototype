"use client";

import { useState } from "react";
import type { GeneratedAssignment, EvalRun, RefinementIteration } from "@/lib/types";
import { ScoreBadge } from "./ScoreBadge";
import { CheckCircle, XCircle } from "lucide-react";

interface IterationHistoryProps {
  iterations: RefinementIteration[];
  assignments: GeneratedAssignment[];
  evalRuns: EvalRun[];
}

export function IterationHistory({ iterations, assignments, evalRuns }: IterationHistoryProps) {
  const [comparing, setComparing] = useState<[number, number]>([0, Math.min(1, assignments.length - 1)]);

  if (!assignments.length) return null;

  const left = assignments[comparing[0]];
  const right = assignments[comparing[1]];
  const leftEval = evalRuns[comparing[0]];
  const rightEval = evalRuns[comparing[1]];

  const DIMS = ["problem_clarity", "test_case_coverage", "complexity_correctness", "concept_rubric_alignment", "real_world_fidelity", "novelty"];
  const DIM_LABELS: Record<string, string> = {
    problem_clarity: "Clarity",
    test_case_coverage: "Test Coverage",
    complexity_correctness: "Complexity",
    concept_rubric_alignment: "Rubric Align.",
    real_world_fidelity: "Real-World",
    novelty: "Novelty",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-neutral-200">Iteration History</h4>
        <span className="text-xs text-neutral-500">{assignments.length} iterations</span>
      </div>

      {/* Timeline */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {assignments.map((a, i) => {
          const evalRun = evalRuns[i];
          const passed = evalRun?.passedThresholds;
          return (
            <button
              key={i}
              onClick={() => setComparing([Math.min(i, assignments.length - 1), Math.min(i + 1, assignments.length - 1)])}
              className={`flex flex-col items-center gap-1 p-2 rounded border transition-colors shrink-0 ${
                comparing.includes(i) ? "border-indigo-500/50 bg-indigo-900/20" : "border-white/8 bg-white/3 hover:border-white/20"
              }`}
            >
              <span className="text-xs font-mono text-neutral-400">Iter {i + 1}</span>
              {evalRun && (
                <ScoreBadge score={evalRun.compositeScore} max={5} size="sm" />
              )}
              {passed !== undefined && (
                passed ? <CheckCircle size={12} className="text-emerald-400" /> : <XCircle size={12} className="text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Refinement trigger info */}
      {iterations.map((it, i) => (
        <div key={i} className="text-xs text-neutral-500 flex items-center gap-2">
          <span className="text-neutral-600">Iter {it.iteration + 1}:</span>
          <span>Triggered by <span className="text-neutral-400">{it.triggeredBy.replace(/_/g, " ")}</span></span>
          <span className="text-neutral-600">·</span>
          <span>Signal: <span className="text-amber-400">{it.failureSignal.replace(/_/g, " ")}</span></span>
          {it.scoreImprovement !== 0 && (
            <>
              <span className="text-neutral-600">·</span>
              <span className={it.scoreImprovement > 0 ? "text-emerald-400" : "text-rose-400"}>
                {it.scoreImprovement > 0 ? "+" : ""}{it.scoreImprovement.toFixed(1)} score
              </span>
            </>
          )}
        </div>
      ))}

      {/* Side-by-side score comparison */}
      {assignments.length > 1 && leftEval && rightEval && left !== right && (
        <div className="rounded-md border border-white/8 overflow-hidden">
          <div className="grid grid-cols-[120px_1fr_1fr] text-xs">
            <div className="px-3 py-2 bg-white/3 border-b border-white/5 text-neutral-500">Dimension</div>
            <div className="px-3 py-2 bg-white/3 border-b border-white/5 border-l border-white/5 text-neutral-400">
              Iter {comparing[0] + 1}
            </div>
            <div className="px-3 py-2 bg-white/3 border-b border-white/5 border-l border-white/5 text-neutral-400">
              Iter {comparing[1] + 1}
            </div>
            {DIMS.map(dim => {
              const lScore = leftEval.perDimensionScores.find(d => d.dimension === dim)?.medianScore ?? 0;
              const rScore = rightEval.perDimensionScores.find(d => d.dimension === dim)?.medianScore ?? 0;
              const delta = rScore - lScore;
              return [
                <div key={`${dim}-label`} className="px-3 py-1.5 text-neutral-400 border-b border-white/5">{DIM_LABELS[dim]}</div>,
                <div key={`${dim}-l`} className="px-3 py-1.5 border-l border-white/5 border-b border-white/5">
                  <ScoreBadge score={lScore} size="sm" />
                </div>,
                <div key={`${dim}-r`} className="px-3 py-1.5 border-l border-white/5 border-b border-white/5 flex items-center gap-2">
                  <ScoreBadge score={rScore} size="sm" />
                  {delta !== 0 && (
                    <span className={`text-xs ${delta > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {delta > 0 ? "+" : ""}{delta.toFixed(1)}
                    </span>
                  )}
                </div>
              ];
            })}
            <div className="px-3 py-2 text-neutral-400 font-medium">Composite</div>
            <div className="px-3 py-2 border-l border-white/5">
              <ScoreBadge score={leftEval.compositeScore} size="sm" showMax />
            </div>
            <div className="px-3 py-2 border-l border-white/5 flex items-center gap-2">
              <ScoreBadge score={rightEval.compositeScore} size="sm" showMax />
              {rightEval.compositeScore !== leftEval.compositeScore && (
                <span className={`text-xs ${rightEval.compositeScore > leftEval.compositeScore ? "text-emerald-400" : "text-rose-400"}`}>
                  {rightEval.compositeScore > leftEval.compositeScore ? "+" : ""}{(rightEval.compositeScore - leftEval.compositeScore).toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
