"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from "lucide-react";
import { ScoreBadge } from "./ScoreBadge";
import type { EvalRun } from "@/lib/types";

interface EvalScorePanelProps {
  evalRun: EvalRun;
  prevEvalRun?: EvalRun;
  showThresholds?: boolean;
}

const DIMENSION_LABELS: Record<string, string> = {
  problem_clarity: "Problem Clarity",
  test_case_coverage: "Test Case Coverage",
  complexity_correctness: "Complexity Correctness",
  concept_rubric_alignment: "Concept-Rubric Alignment",
  real_world_fidelity: "Real-World Fidelity",
  novelty: "Novelty",
};

export function EvalScorePanel({ evalRun, prevEvalRun, showThresholds = true }: EvalScorePanelProps) {
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  return (
    <div className="rounded-md border border-white/8 overflow-hidden">
      <div className="px-3 py-2 bg-white/3 border-b border-white/8 flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-200">Eval Judge Scores</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Composite</span>
          <ScoreBadge score={evalRun.compositeScore} max={5} size="sm" showMax />
        </div>
      </div>

      <div>
        {evalRun.perDimensionScores.map(dim => {
          const threshold = evalRun.thresholdsUsed.find(t => t.dimension === dim.dimension)?.threshold ?? 3.5;
          const passed = dim.medianScore >= threshold;
          const prevDim = prevEvalRun?.perDimensionScores.find(d => d.dimension === dim.dimension);
          const delta = prevDim ? dim.medianScore - prevDim.medianScore : null;
          const isExpanded = expandedDimension === dim.dimension;

          return (
            <div key={dim.dimension} className="border-b border-white/5 last:border-0">
              <button
                onClick={() => setExpandedDimension(isExpanded ? null : dim.dimension)}
                className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-white/3 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-200">
                    {DIMENSION_LABELS[dim.dimension] || dim.dimension.replace(/_/g, " ")}
                  </span>
                  {showThresholds && !passed && (
                    <span className="text-xs text-rose-400 bg-rose-900/20 rounded px-1">
                      below threshold
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {delta !== null && (
                    <span className={`text-xs flex items-center gap-0.5 ${delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {delta >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {delta > 0 ? "+" : ""}{delta.toFixed(1)}
                    </span>
                  )}
                  <ScoreBadge score={dim.medianScore} max={5} size="sm" />
                  {isExpanded ? <ChevronUp size={13} className="text-neutral-500" /> : <ChevronDown size={13} className="text-neutral-500" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  {showThresholds && (
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>Threshold: {threshold.toFixed(1)}</span>
                      <span>·</span>
                      <span>Source: {evalRun.thresholdsUsed.find(t => t.dimension === dim.dimension)?.source}</span>
                    </div>
                  )}
                  {dim.individualRuns.map((run, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <ScoreBadge score={run.score} size="sm" />
                      <p className="text-neutral-400 flex-1">{run.reasoning}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showThresholds && (
        <div className={`px-3 py-2 border-t border-white/8 text-xs ${evalRun.passedThresholds ? "text-emerald-400 bg-emerald-900/10" : "text-rose-400 bg-rose-900/10"}`}>
          {evalRun.passedThresholds ? "✓ All dimensions above threshold" : "✗ Some dimensions below threshold"}
        </div>
      )}
    </div>
  );
}
