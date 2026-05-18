"use client";

import Link from "next/link";
import { DSA_INTERVIEW_PROBLEMS, PROBLEM_TYPE_LABELS } from "@/lib/seed/dsa";
import { ConceptBadge } from "@/components/domain/ConceptBadge";
import { Plus, Clock, MessageSquareCode } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  calibrated: "text-emerald-400 bg-emerald-900/20 border-emerald-800/40",
  awaiting_calibration: "text-amber-400 bg-amber-900/20 border-amber-800/40",
  draft: "text-neutral-400 bg-neutral-800 border-neutral-700",
  retired: "text-neutral-600 bg-neutral-900 border-neutral-800",
};

const TYPE_STYLES: Record<string, string> = {
  written_coding: "text-sky-300 bg-sky-900/20 border-sky-800/40",
  written_coding_interview: "text-violet-300 bg-violet-900/20 border-violet-800/40",
};

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "text-emerald-400",
  medium: "text-amber-400",
  hard: "text-rose-400",
};

export default function InterviewProblemsPage() {
  const problems = DSA_INTERVIEW_PROBLEMS;
  const calibrated = problems.filter(p => p.status === "calibrated").length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <Link href="/categories/dsa" className="hover:text-neutral-300">DSA</Link>
            <span>/</span>
            <Link href="/categories/dsa/interview" className="hover:text-neutral-300">Interview</Link>
            <span>/</span>
            <span className="text-neutral-300">Problems</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100">Interview Problems</h1>
          <p className="text-sm text-neutral-400 mt-1">{problems.length} problems · {calibrated} calibrated</p>
        </div>
        <Link
          href="/categories/dsa/interview/generate"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 text-white text-xs transition-colors"
        >
          <Plus size={13} />
          New Problem
        </Link>
      </div>

      <div className="rounded-lg border border-white/8 overflow-hidden">
        <div className="grid grid-cols-[1fr_90px_180px_90px_100px_120px] text-xs text-neutral-500 border-b border-white/8 bg-white/2">
          <div className="px-4 py-2.5">Problem</div>
          <div className="px-4 py-2.5">Type</div>
          <div className="px-4 py-2.5">Concepts</div>
          <div className="px-4 py-2.5">Time</div>
          <div className="px-4 py-2.5">Solve Rate</div>
          <div className="px-4 py-2.5">Status</div>
        </div>
        <div className="divide-y divide-white/5">
          {problems.map(p => (
            <div key={p.id} className="grid grid-cols-[1fr_90px_180px_90px_100px_120px] hover:bg-white/3 transition-colors">
              <div className="px-4 py-3">
                <p className="text-sm text-neutral-200">{p.title}</p>
                <p className="text-xs text-neutral-600 mt-0.5 flex items-center gap-1.5">
                  <span className="font-mono">{p.id}</span>
                  <span>·</span>
                  <span className={DIFFICULTY_STYLES[p.difficulty]}>{p.difficulty}</span>
                  <span>·</span>
                  <span>{p.domain}</span>
                </p>
              </div>
              <div className="px-4 py-3 flex items-center">
                <span className={`text-[10px] border rounded px-1.5 py-0.5 ${TYPE_STYLES[p.problemType]}`}>{PROBLEM_TYPE_LABELS[p.problemType]}</span>
              </div>
              <div className="px-4 py-3 flex items-center flex-wrap gap-1">
                {p.primaryConcepts.slice(0, 2).map(cid => (
                  <ConceptBadge key={cid} conceptId={cid} size="xs" />
                ))}
                {p.primaryConcepts.length > 2 && (
                  <span className="text-xs text-neutral-600">+{p.primaryConcepts.length - 2}</span>
                )}
              </div>
              <div className="px-4 py-3 flex items-center gap-1 text-xs text-neutral-300">
                <Clock size={11} className="text-neutral-500" />
                {p.timeBudgetMin}m
              </div>
              <div className="px-4 py-3 flex items-center text-xs">
                {p.actualSolveRate !== null ? (
                  <>
                    <span className="text-neutral-200 font-medium">{Math.round(p.actualSolveRate * 100)}%</span>
                    <span className="text-neutral-600 ml-1">({p.attemptsCount})</span>
                  </>
                ) : (
                  <span className="text-neutral-600">est. {p.estimatedSolveBand}</span>
                )}
              </div>
              <div className="px-4 py-3 flex items-center">
                <span className={`text-[10px] border rounded px-1.5 py-0.5 ${STATUS_STYLES[p.status]}`}>
                  {p.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-neutral-600 mt-3 flex items-center gap-1.5">
        <MessageSquareCode size={11} />
        Problems move from <span className="text-amber-400">awaiting_calibration</span> to <span className="text-emerald-400">calibrated</span> once ≥30 candidates have attempted them.
      </p>
    </div>
  );
}
