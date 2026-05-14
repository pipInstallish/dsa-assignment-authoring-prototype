"use client";

import { useState, useRef } from "react";
import { DSA_CLASS_CONTEXTS, DSA_CONCEPTS } from "@/lib/seed/dsa";
import { ConceptPicker } from "@/components/domain/ConceptPicker";
import { AssignmentPreview } from "@/components/domain/AssignmentPreview";
import { VerificationPanel } from "@/components/domain/VerificationPanel";
import { EvalScorePanel } from "@/components/domain/EvalScorePanel";
import { MonacoDisplay } from "@/components/domain/MonacoDisplay";
import {
  mockGenerateAssignment,
  mockRefineAssignment,
  GENERATION_STAGES,
} from "@/lib/mock/llm";
import { addUserApprovedAssignment } from "@/lib/storage/local";
import { toast } from "sonner";
import {
  Sparkles, Check, ChevronRight, Loader2, CheckCircle, XCircle, RefreshCw, AlertTriangle, ThumbsUp, ThumbsDown, MessageSquare
} from "lucide-react";
import type { GeneratedAssignment, VerificationRun, EvalRun, AssignmentRecord } from "@/lib/types";

const STEPS = ["Configure", "Generating", "Review Output", "Approve"];

type FlowOutcome = "happy" | "refinement" | "hard_check_fail" | "code_execution_fail" | "max_iterations";

interface StageState {
  stage: string;
  label: string;
  done: boolean;
}

export default function GeneratePage() {
  const [step, setStep] = useState(0);

  // Step 0 config
  const [primaryConcepts, setPrimaryConcepts] = useState<string[]>([]);
  const [secondaryConcepts, setSecondaryConcepts] = useState<string[]>([]);
  const [mustNotConcepts, setMustNotConcepts] = useState<string[]>([]);
  const [classContextId, setClassContextId] = useState(DSA_CLASS_CONTEXTS[0]?.id || "");
  const [diffTier, setDiffTier] = useState<"easy" | "medium" | "hard">("medium");
  const [domain, setDomain] = useState("e-commerce");
  const [assignmentType, setAssignmentType] = useState<"coding_problem" | "open_design" | "debugging">("coding_problem");

  // Generation state
  const [stages, setStages] = useState<StageState[]>(
    GENERATION_STAGES.map(s => ({ stage: s.stage, label: s.label, done: false }))
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);

  // Results
  const [assignment, setAssignment] = useState<GeneratedAssignment | null>(null);
  const [verificationRun, setVerificationRun] = useState<VerificationRun | null>(null);
  const [evalRun, setEvalRun] = useState<EvalRun | null>(null);
  const [flowOutcome, setFlowOutcome] = useState<FlowOutcome>("happy");
  const [flowNumber, setFlowNumber] = useState(1);

  // Refinement
  const [isRefining, setIsRefining] = useState(false);
  const [refinementCount, setRefinementCount] = useState(0);
  const [allIterationAssignments, setAllIterationAssignments] = useState<GeneratedAssignment[]>([]);
  const [allEvalRuns, setAllEvalRuns] = useState<EvalRun[]>([]);

  // Approval step
  const [activeResultTab, setActiveResultTab] = useState<"problem" | "solution" | "verification" | "eval">("problem");
  const [reviewComment, setReviewComment] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  function resetStages() {
    setStages(GENERATION_STAGES.map(s => ({ stage: s.stage, label: s.label, done: false })));
  }

  async function handleGenerate() {
    if (primaryConcepts.length === 0) {
      toast.error("Select at least one primary concept");
      return;
    }
    resetStages();
    setIsGenerating(true);
    setGenerationDone(false);
    setStep(1);

    try {
      const result = await mockGenerateAssignment(primaryConcepts, (stage, idx) => {
        setStages(prev => prev.map((s, i) => i <= idx ? { ...s, done: true } : s));
      });

      setAssignment(result.assignment);
      setVerificationRun(result.verificationRun);
      setEvalRun(result.evalRun);
      setFlowNumber(result.flow);
      setAllIterationAssignments([result.assignment]);
      setAllEvalRuns([result.evalRun]);

      // Determine outcome
      const flow = result.flow;
      if (flow === 3) setFlowOutcome("hard_check_fail");
      else if (flow === 4) setFlowOutcome("code_execution_fail");
      else if (flow === 5) setFlowOutcome("max_iterations");
      else if (flow === 2) setFlowOutcome("refinement");
      else setFlowOutcome("happy");

      setGenerationDone(true);
      setIsGenerating(false);

      // Auto-advance to review after brief pause
      await new Promise(r => setTimeout(r, 600));
      setStep(2);
    } catch {
      setIsGenerating(false);
      toast.error("Generation failed");
    }
  }

  async function handleRefine() {
    if (refinementCount >= 2) return;
    resetStages();
    setIsRefining(true);
    setStep(1);

    try {
      const result = await mockRefineAssignment(assignment?.id || "", refinementCount + 1, (stage, idx) => {
        setStages(prev => prev.map((s, i) => i <= idx ? { ...s, done: true } : s));
      });

      setAssignment(result.assignment);
      setVerificationRun(result.verificationRun);
      setEvalRun(result.evalRun);
      setAllIterationAssignments(prev => [...prev, result.assignment]);
      setAllEvalRuns(prev => [...prev, result.evalRun]);
      setRefinementCount(c => c + 1);

      if (result.evalRun.passedThresholds) {
        setFlowOutcome("happy");
      }

      setIsRefining(false);
      await new Promise(r => setTimeout(r, 600));
      setStep(2);
    } catch {
      setIsRefining(false);
      toast.error("Refinement failed");
    }
  }

  async function handleApprove() {
    setApproveLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const record: AssignmentRecord = {
      assignment: assignment!,
      verificationRuns: verificationRun ? [verificationRun] : [],
      evalRuns: evalRun ? [evalRun] : [],
      refinementIterations: [],
      status: "approved",
      allIterationAssignments,
    };
    addUserApprovedAssignment(record);
    setApproveLoading(false);
    setApproved(true);
    setStep(3);
    toast.success("Assignment approved and added to library");
  }

  async function handleReject() {
    toast.info("Assignment rejected");
    // Reset to start
    setStep(0);
    setAssignment(null);
    setVerificationRun(null);
    setEvalRun(null);
    setRefinementCount(0);
    setAllIterationAssignments([]);
    setAllEvalRuns([]);
    setPrimaryConcepts([]);
  }

  const outcomeLabel: Record<FlowOutcome, { color: string; label: string; icon: React.ReactNode }> = {
    happy: { color: "text-emerald-400", label: "All checks passed", icon: <CheckCircle size={14} /> },
    refinement: { color: "text-amber-400", label: "Refined after soft score fail", icon: <RefreshCw size={14} /> },
    hard_check_fail: { color: "text-rose-400", label: "Failed hard check", icon: <XCircle size={14} /> },
    code_execution_fail: { color: "text-rose-400", label: "Code execution failed", icon: <XCircle size={14} /> },
    max_iterations: { color: "text-rose-400", label: "Exhausted refinements (3/3)", icon: <AlertTriangle size={14} /> },
  };

  const canApprove = assignment && (flowOutcome === "happy" || flowOutcome === "refinement");

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
          <span>/</span>
          <span className="text-neutral-300">Generate Assignment</span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-100">Generate Assignment</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
              i < step ? "bg-indigo-600 text-white" :
              i === step ? "bg-indigo-600/30 border border-indigo-500 text-indigo-300" :
              "bg-white/5 border border-white/10 text-neutral-600"
            }`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-xs ${i === step ? "text-neutral-200" : "text-neutral-500"}`}>{s}</span>
            {i < STEPS.length - 1 && <ChevronRight size={12} className="text-neutral-700 ml-1" />}
          </div>
        ))}
      </div>

      {/* Step 0: Configure */}
      {step === 0 && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block font-medium">Primary Concepts * <span className="text-neutral-600 font-normal">(concepts being assessed)</span></label>
              <ConceptPicker selected={primaryConcepts} onChange={setPrimaryConcepts} label="Primary Concepts" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Secondary Concepts <span className="text-neutral-600">(may appear incidentally)</span></label>
              <ConceptPicker selected={secondaryConcepts} onChange={setSecondaryConcepts} label="Secondary Concepts" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Must Not Require</label>
              <ConceptPicker selected={mustNotConcepts} onChange={setMustNotConcepts} label="Must Not Require" />
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Class Context</label>
              <select value={classContextId} onChange={e => setClassContextId(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-300 outline-none focus:border-indigo-500/60">
                {DSA_CLASS_CONTEXTS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Difficulty</label>
              <div className="flex gap-2">
                {(["easy", "medium", "hard"] as const).map(d => (
                  <button key={d} onClick={() => setDiffTier(d)} className={`flex-1 py-2 rounded text-sm capitalize border transition-colors ${diffTier === d ? "border-indigo-500 bg-indigo-900/20 text-indigo-300" : "border-white/10 text-neutral-500 hover:text-neutral-300"}`}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Assignment Type</label>
              <select value={assignmentType} onChange={e => setAssignmentType(e.target.value as typeof assignmentType)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-300 outline-none focus:border-indigo-500/60">
                <option value="coding_problem">Coding Problem</option>
                <option value="open_design">Open Design</option>
                <option value="debugging">Debugging</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Real-World Domain</label>
              <input value={domain} onChange={e => setDomain(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60" placeholder="e.g. e-commerce, fintech, SaaS" />
            </div>
            <div className="rounded-md bg-indigo-950/30 border border-indigo-800/30 p-3 text-xs text-indigo-300/80">
              <p className="font-medium mb-1">Flow routing preview</p>
              <p className="text-indigo-400/60">
                {primaryConcepts.length === 0 ? "Select concepts to preview flow" :
                 primaryConcepts.sort().join(",") === "frequency_counting,hashmaps" || primaryConcepts.sort().join(",") === "hashmaps,frequency_counting" ? "→ Flow 1: Happy path (direct approval)" :
                 primaryConcepts.includes("sliding_window") && primaryConcepts.length === 1 ? "→ Flow 2: One refinement cycle" :
                 (primaryConcepts.includes("sorting") && primaryConcepts.includes("two_pointers")) ? "→ Flow 3: Hard check fail (concept containment)" :
                 (primaryConcepts.includes("trees") && primaryConcepts.includes("tree_traversal_dfs")) ? "→ Flow 4: Code execution fail" :
                 primaryConcepts.includes("dynamic_programming_1d") && primaryConcepts.length === 1 ? "→ Flow 5: Max refinements exhausted" :
                 "→ Flow 1: Happy path (default)"}
              </p>
            </div>
          </div>
          <div className="col-span-2">
            <button
              onClick={handleGenerate}
              disabled={primaryConcepts.length === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              <Sparkles size={16} />
              Generate Assignment
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Generating */}
      {step === 1 && (
        <div className="max-w-lg mx-auto py-8">
          <div className="flex items-center gap-3 mb-6">
            <Loader2 size={18} className="text-indigo-400 animate-spin" />
            <h2 className="text-base font-medium text-neutral-200">
              {isRefining ? `Refining assignment (iteration ${refinementCount + 1})...` : "Generating assignment..."}
            </h2>
          </div>
          <div className="space-y-3">
            {stages.map((s, i) => {
              const isActive = !s.done && stages.slice(0, i).every(prev => prev.done);
              return (
                <div key={s.stage} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  s.done ? "border-emerald-800/40 bg-emerald-900/10" :
                  isActive ? "border-indigo-500/40 bg-indigo-900/10" :
                  "border-white/5 bg-white/2"
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    s.done ? "bg-emerald-600" :
                    isActive ? "bg-indigo-600/50 border border-indigo-500" :
                    "bg-neutral-800 border border-white/10"
                  }`}>
                    {s.done ? <Check size={11} className="text-white" /> :
                     isActive ? <Loader2 size={11} className="text-indigo-300 animate-spin" /> :
                     <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full" />}
                  </div>
                  <span className={`text-sm ${s.done ? "text-neutral-300" : isActive ? "text-neutral-200" : "text-neutral-600"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Review output */}
      {step === 2 && assignment && verificationRun && evalRun && (
        <div className="space-y-4">
          {/* Outcome banner */}
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${
            canApprove ? "border-emerald-800/40 bg-emerald-900/10" :
            "border-rose-800/40 bg-rose-900/10"
          }`}>
            <span className={outcomeLabel[flowOutcome].color}>{outcomeLabel[flowOutcome].icon}</span>
            <span className={`text-sm font-medium ${outcomeLabel[flowOutcome].color}`}>{outcomeLabel[flowOutcome].label}</span>
            <span className="text-neutral-500 text-xs ml-auto">
              Composite score: <span className={evalRun.passedThresholds ? "text-emerald-400" : "text-rose-400"}>{evalRun.compositeScore.toFixed(2)}/5</span>
              {refinementCount > 0 && ` · ${refinementCount} refinement${refinementCount > 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Tabs + content */}
          <div className="rounded-lg border border-white/8 overflow-hidden">
            <div className="flex border-b border-white/8 bg-white/2">
              {(["problem", "solution", "verification", "eval"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveResultTab(t)}
                  className={`px-4 py-2.5 text-xs capitalize transition-colors border-b-2 -mb-px ${activeResultTab === t ? "border-indigo-500 text-indigo-300" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
                >
                  {t === "verification" ? "Checks" : t === "eval" ? "Eval Score" : t}
                </button>
              ))}
              <div className="ml-auto flex items-center px-3 gap-2 text-xs text-neutral-500">
                <span>{assignment.problem.title}</span>
              </div>
            </div>
            <div className="p-5">
              {activeResultTab === "problem" && <AssignmentPreview assignment={assignment} />}
              {activeResultTab === "solution" && (
                <div className="space-y-4">
                  <div className="rounded border border-white/8 overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/2 border-b border-white/8 text-xs text-neutral-500">
                      <span>Reference Solution</span>
                      <span className="ml-auto">{assignment.referenceSolution.complexityTime} · {assignment.referenceSolution.complexitySpace}</span>
                    </div>
                    <MonacoDisplay code={assignment.referenceSolution.code} language={assignment.referenceSolution.language} height={280} />
                  </div>
                </div>
              )}
              {activeResultTab === "verification" && <VerificationPanel verificationRun={verificationRun} />}
              {activeResultTab === "eval" && <EvalScorePanel evalRun={evalRun} prevEvalRun={allEvalRuns.length > 1 ? allEvalRuns[allEvalRuns.length - 2] : undefined} />}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {canApprove ? (
              <>
                <button
                  onClick={handleApprove}
                  disabled={approveLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {approveLoading ? <Loader2 size={14} className="animate-spin" /> : <ThumbsUp size={14} />}
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-rose-800/60 bg-rose-900/10 text-rose-400 text-sm hover:bg-rose-900/20 transition-colors"
                >
                  <ThumbsDown size={14} />
                  Reject
                </button>
                <div className="flex-1">
                  <input
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Add review comment (optional)..."
                    className="w-full bg-neutral-800/60 border border-white/10 rounded-md px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 placeholder:text-neutral-600"
                  />
                </div>
              </>
            ) : (
              <>
                {(flowOutcome === "refinement" || flowOutcome === "code_execution_fail") && refinementCount < 2 && (
                  <button
                    onClick={handleRefine}
                    disabled={isRefining}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
                  >
                    <RefreshCw size={14} />
                    Refine ({refinementCount + 1}/3)
                  </button>
                )}
                <button
                  onClick={handleReject}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-rose-800/60 bg-rose-900/10 text-rose-400 text-sm hover:bg-rose-900/20 transition-colors"
                >
                  <ThumbsDown size={14} />
                  Discard
                </button>
                {flowOutcome === "hard_check_fail" && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400">
                    <AlertTriangle size={13} />
                    <span>Hard check failed — cannot approve. Fix or discard.</span>
                  </div>
                )}
                {flowOutcome === "max_iterations" && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400">
                    <AlertTriangle size={13} />
                    <span>Max refinements exhausted — cannot approve automatically.</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Approved */}
      {step === 3 && (
        <div className="max-w-md mx-auto py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-100 mb-2">Assignment Approved</h2>
          <p className="text-sm text-neutral-400 mb-6">{assignment?.problem.title} has been added to the assignment library.</p>
          <div className="flex gap-3 justify-center">
            <a href="/categories/dsa/assignments" className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-colors">
              View Library
            </a>
            <button
              onClick={() => {
                setStep(0);
                setAssignment(null);
                setVerificationRun(null);
                setEvalRun(null);
                setRefinementCount(0);
                setAllIterationAssignments([]);
                setAllEvalRuns([]);
                setPrimaryConcepts([]);
                setApproved(false);
              }}
              className="px-4 py-2 rounded-md border border-white/10 text-neutral-300 text-sm hover:border-white/20 transition-colors"
            >
              Generate Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
