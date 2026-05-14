"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { DSA_ASSIGNMENTS } from "@/lib/seed/dsa";
import { getUserApprovedAssignments, addInstructorReview } from "@/lib/storage/local";
import { ConceptBadge } from "@/components/domain/ConceptBadge";
import { AssignmentPreview } from "@/components/domain/AssignmentPreview";
import { VerificationPanel } from "@/components/domain/VerificationPanel";
import { EvalScorePanel } from "@/components/domain/EvalScorePanel";
import { IterationHistory } from "@/components/domain/IterationHistory";
import { MonacoDisplay } from "@/components/domain/MonacoDisplay";
import { ScoreBadge } from "@/components/domain/ScoreBadge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, AlertTriangle, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  approved: { label: "Approved", color: "text-emerald-400 bg-emerald-900/20 border-emerald-800/40", icon: <CheckCircle size={13} /> },
  awaiting_approval: { label: "Awaiting Review", color: "text-blue-400 bg-blue-900/20 border-blue-800/40", icon: <Clock size={13} /> },
  rejected: { label: "Rejected", color: "text-rose-400 bg-rose-900/20 border-rose-800/40", icon: <XCircle size={13} /> },
  failed_eval: { label: "Failed Eval", color: "text-rose-400 bg-rose-900/20 border-rose-800/40", icon: <AlertTriangle size={13} /> },
  failed_hard_check: { label: "Failed Hard Check", color: "text-rose-400 bg-rose-900/20 border-rose-800/40", icon: <AlertTriangle size={13} /> },
  in_progress: { label: "In Progress", color: "text-neutral-400 bg-neutral-800 border-neutral-700", icon: <Clock size={13} /> },
};

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userApproved = getUserApprovedAssignments();
  const record = [...DSA_ASSIGNMENTS, ...userApproved].find(r => r.assignment.id === id);

  const [activeTab, setActiveTab] = useState<"problem" | "solution" | "verification" | "eval" | "history">("problem");
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!record) return (
    <div className="p-8 text-center text-neutral-500">
      <p>Assignment not found</p>
      <a href="/categories/dsa/assignments" className="text-indigo-400 text-sm mt-2 inline-block">← Back to library</a>
    </div>
  );

  const { assignment, verificationRuns, evalRuns, refinementIterations, status, allIterationAssignments } = record;
  const latestEval = evalRuns[evalRuns.length - 1];
  const prevEval = evalRuns.length > 1 ? evalRuns[evalRuns.length - 2] : undefined;
  const latestVerification = verificationRuns[verificationRuns.length - 1];
  const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.in_progress;

  async function handleReview(action: "approved" | "rejected") {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 500));
    const review = {
      id: `review-${Date.now()}`,
      assignmentId: assignment.id,
      reviewer: "Sarah Chen",
      status: action,
      ratings: [],
      comments: reviewComment,
      reviewedAt: new Date().toISOString(),
    };
    addInstructorReview(review);
    setSubmitting(false);
    toast.success(action === "approved" ? "Assignment approved" : "Assignment rejected");
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
          <span>/</span>
          <a href="/categories/dsa/assignments" className="hover:text-neutral-300">Assignments</a>
          <span>/</span>
          <span className="text-neutral-300">{assignment.id}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-neutral-100">{assignment.problem.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {assignment.metadata.conceptsRequired.map(cid => (
                <ConceptBadge key={cid} conceptId={cid} size="sm" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {latestEval && <ScoreBadge score={latestEval.compositeScore} max={5} showMax />}
            <span className={`flex items-center gap-1.5 text-xs border rounded px-2 py-1 ${statusConf.color}`}>
              {statusConf.icon}{statusConf.label}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/8 mb-5 gap-1">
        {(["problem", "solution", "verification", "eval", "history"] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px ${activeTab === t ? "border-indigo-500 text-indigo-300" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            {t === "verification" ? `Checks ${!latestVerification?.passed ? "⚠" : ""}` : t === "eval" ? `Eval ${latestEval && !latestEval.passedThresholds ? "⚠" : ""}` : t === "history" ? `History (${evalRuns.length})` : t}
          </button>
        ))}
      </div>

      {activeTab === "problem" && <AssignmentPreview assignment={assignment} />}

      {activeTab === "solution" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-white/8 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/2 border-b border-white/8 text-xs text-neutral-400">
              <span>Reference Solution — {assignment.referenceSolution.language}</span>
              <span className="ml-auto">{assignment.referenceSolution.complexityTime} · {assignment.referenceSolution.complexitySpace}</span>
            </div>
            <MonacoDisplay code={assignment.referenceSolution.code} language={assignment.referenceSolution.language} />
          </div>

          {assignment.testCases.length > 0 && (
            <div className="rounded-lg border border-white/8 overflow-hidden">
              <div className="px-4 py-2.5 bg-white/2 border-b border-white/8 text-xs text-neutral-400">Test Cases ({assignment.testCases.length})</div>
              <div className="divide-y divide-white/5">
                {assignment.testCases.map(tc => (
                  <div key={tc.id} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs rounded px-1.5 py-0.5 ${tc.visibility === "sample" ? "text-blue-400 bg-blue-900/20" : "text-neutral-500 bg-neutral-800"}`}>{tc.visibility}</span>
                      <span className="text-xs text-neutral-500">{tc.rationale}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Input</p>
                        <code className="text-xs text-neutral-300 font-mono whitespace-pre">{tc.input}</code>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Expected</p>
                        <code className="text-xs text-neutral-300 font-mono">{tc.expectedOutput}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "verification" && latestVerification && <VerificationPanel verificationRun={latestVerification} />}

      {activeTab === "eval" && latestEval && <EvalScorePanel evalRun={latestEval} prevEvalRun={prevEval} />}

      {activeTab === "history" && (
        <IterationHistory
          iterations={refinementIterations}
          assignments={allIterationAssignments || [assignment]}
          evalRuns={evalRuns}
        />
      )}

      {/* Review panel for awaiting_approval */}
      {status === "awaiting_approval" && activeTab === "problem" && (
        <div className="mt-6 p-4 rounded-lg border border-white/8 bg-white/2">
          <h3 className="text-sm font-medium text-neutral-200 mb-3">Instructor Review</h3>
          <textarea
            value={reviewComment}
            onChange={e => setReviewComment(e.target.value)}
            placeholder="Add review comments..."
            className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 h-20 resize-none mb-3"
          />
          <div className="flex gap-2">
            <button onClick={() => handleReview("approved")} disabled={submitting} className="flex items-center gap-2 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm transition-colors">
              <ThumbsUp size={13} />Approve
            </button>
            <button onClick={() => handleReview("rejected")} disabled={submitting} className="flex items-center gap-2 px-4 py-2 rounded border border-rose-800/50 bg-rose-900/10 text-rose-400 text-sm hover:bg-rose-900/20 transition-colors">
              <ThumbsDown size={13} />Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
