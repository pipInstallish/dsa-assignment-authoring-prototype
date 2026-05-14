"use client";

import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { VerificationRun } from "@/lib/types";

interface VerificationPanelProps {
  verificationRun: VerificationRun;
}

function CheckRow({ label, passed, detail }: { label: string; passed: boolean; detail?: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        className="flex items-center justify-between w-full px-3 py-2 hover:bg-white/3 transition-colors"
        onClick={() => detail && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {passed ? (
            <CheckCircle size={14} className="text-emerald-400 shrink-0" />
          ) : (
            <XCircle size={14} className="text-rose-400 shrink-0" />
          )}
          <span className="text-sm text-neutral-200">{label}</span>
        </div>
        {detail && (
          expanded ? <ChevronUp size={13} className="text-neutral-500" /> : <ChevronDown size={13} className="text-neutral-500" />
        )}
      </button>
      {expanded && detail && (
        <div className="px-3 pb-2 text-xs text-neutral-400 ml-5">{detail}</div>
      )}
    </div>
  );
}

export function VerificationPanel({ verificationRun }: VerificationPanelProps) {
  const { hardChecks } = verificationRun;
  const [showCodeExec, setShowCodeExec] = useState(false);

  return (
    <div className="rounded-md border border-white/8 overflow-hidden">
      <div className="px-3 py-2 bg-white/3 border-b border-white/8 flex items-center gap-2">
        {verificationRun.passed ? (
          <CheckCircle size={14} className="text-emerald-400" />
        ) : (
          <AlertCircle size={14} className="text-rose-400" />
        )}
        <span className="text-sm font-medium text-neutral-200">
          Hard Checks — {verificationRun.passed ? "All Passed" : "Failed"}
        </span>
      </div>

      <div>
        <CheckRow label="Schema valid" passed={hardChecks.schemaValid} />
        <CheckRow
          label="Concept coverage"
          passed={hardChecks.conceptCoverage.passed}
          detail={hardChecks.conceptCoverage.missing.length > 0 ? `Missing: ${hardChecks.conceptCoverage.missing.join(", ")}` : undefined}
        />
        <CheckRow
          label="Concept containment"
          passed={hardChecks.conceptContainment.passed}
          detail={hardChecks.conceptContainment.outOfScope.length > 0 ? `Out of scope: ${hardChecks.conceptContainment.outOfScope.join(", ")}` : undefined}
        />
        <CheckRow
          label="Concept exclusion"
          passed={hardChecks.conceptExclusion.passed}
          detail={hardChecks.conceptExclusion.violated.length > 0 ? `Violated: ${hardChecks.conceptExclusion.violated.join(", ")}` : undefined}
        />
        <CheckRow
          label="Difficulty in band"
          passed={hardChecks.difficultyInBand.passed}
          detail={hardChecks.difficultyInBand.details}
        />
        <CheckRow
          label="Leakage check"
          passed={hardChecks.leakage.passed}
          detail={`Max similarity: ${(hardChecks.leakage.maxSimilarity * 100).toFixed(0)}%${hardChecks.leakage.closestCorpusId ? ` (${hardChecks.leakage.closestCorpusId})` : ""}`}
        />

        {/* Code execution */}
        {hardChecks.codeExecution && (
          <div>
            <button
              onClick={() => setShowCodeExec(!showCodeExec)}
              className="flex items-center justify-between w-full px-3 py-2 hover:bg-white/3 transition-colors"
            >
              <div className="flex items-center gap-2">
                {hardChecks.codeExecution.passed ? (
                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                ) : (
                  <XCircle size={14} className="text-rose-400 shrink-0" />
                )}
                <span className="text-sm text-neutral-200">Code execution</span>
                <span className="text-xs text-neutral-500">
                  ({hardChecks.codeExecution.results.filter(r => r.passed).length}/{hardChecks.codeExecution.results.length} passed)
                </span>
              </div>
              {showCodeExec ? <ChevronUp size={13} className="text-neutral-500" /> : <ChevronDown size={13} className="text-neutral-500" />}
            </button>
            {showCodeExec && (
              <div className="px-3 pb-2 space-y-1">
                {hardChecks.codeExecution.results.map(r => (
                  <div key={r.testCaseId} className="flex items-start gap-2 text-xs">
                    {r.passed ? (
                      <CheckCircle size={11} className="text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={11} className="text-rose-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <span className="text-neutral-300 font-mono">{r.testCaseId}</span>
                      <span className="text-neutral-500 ml-2">{r.runtimeMs}ms</span>
                      {r.error && <p className="text-rose-400 mt-0.5">{r.error}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
