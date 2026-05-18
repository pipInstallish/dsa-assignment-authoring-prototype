"use client";

import { useState } from "react";
import Link from "next/link";
import { DSA_INTERVIEW_PROBLEMS } from "@/lib/seed/dsa";
import { ScoreBadge } from "@/components/domain/ScoreBadge";
import { toast } from "sonner";
import {
  FlaskConical, Play, Loader2, ChevronDown, ChevronUp, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// ===== Eval dimensions =====
// These check whether the problem is correctly shaped as an interview problem.
// All run on the artifacts themselves — problem statement, rubric, hint ladder, solutions.
// Cohort-based signals (real solve rate, inter-rater agreement) live on the Calibration page.

interface EvalDimension {
  id: string;
  label: string;
  threshold: number;
  description: string;
  metric: string;
  judgePrompt: string;
}

const DIMENSIONS: EvalDimension[] = [
  {
    id: "clarifying_questions",
    label: "Problem statement should not have straightforward instructions",
    threshold: 3.0,
    description: "A good interview problem isn't fully spelled out. Candidates should want to ask 2–3 questions before they start coding. If the statement is so clear that they just start typing, it's a practice problem in disguise.",
    metric: "How many sensible clarifying questions does the problem prompt? Target: 2–3.",
    judgePrompt: "We show the problem to an AI candidate and tell it to ask any questions before coding. We count how many sensible questions it raises.",
  },
  {
    id: "multiple_solutions",
    label: "Has multiple solution approaches",
    threshold: 3.5,
    description: "Good interview problems support either a slow-then-fast climb (brute force → optimal) or multiple parallel solutions with different trade-offs. Either way, candidates can start somewhere and have something to discuss. If only one solution works, the interview becomes pass/fail.",
    metric: "Count of distinct working solutions — either across complexity tiers (slow → fast) or with real trade-offs (memory vs. speed, simple vs. clever). Target: 2+.",
    judgePrompt: "We enumerate all reasonable working solutions and check each one is genuinely different from the others, not just a micro-variant.",
  },
  {
    id: "novelty_vs_assignments",
    label: "Novelty: Does this problem exist in assignments?",
    threshold: 3.5,
    description: "If a candidate already did this problem (or a near-duplicate) as a homework assignment, the interview is useless — they have an unfair advantage and we measure their memory, not their thinking. We check the generated problem against the entire DSA assignment library.",
    metric: "Maximum similarity (cosine) between this problem and any existing assignment in DSA_ASSIGNMENTS. Target: < 0.30.",
    judgePrompt: "We embed the problem and compare against embeddings of every assignment in the library. Report the closest match and its similarity score.",
  },
  {
    id: "followups_need_new_thinking",
    label: "Has follow-up questions that need different thinking",
    threshold: 3.5,
    description: "Strong candidates finish the main problem fast. Without follow-ups, they sit idle for 15 min and end up scoring the same as a medium candidate. A good follow-up requires a new idea (\"what if events arrive out of order?\") — not just a rescaling (\"what if N is bigger?\").",
    metric: "Count of follow-ups that require a genuinely new idea (not the same approach scaled up). Target: 2+.",
    judgePrompt: "For each generated follow-up, we ask: does solving this require a different insight, or is it the same solution with bigger inputs? Count only the ones that need new thinking.",
  },
  {
    id: "hint_ladder_escalation",
    label: "Hints get more specific as they go",
    threshold: 3.5,
    description: "When a candidate is stuck, the interviewer needs hints that nudge without giving it away. H1 should be conceptual, H2 strategic, H3 close to implementation. Without proper escalation, the interviewer either gives nothing useful or gives away the answer in one shot.",
    metric: "Number of hint levels (target: exactly 3), and whether each level reveals strictly more than the last.",
    judgePrompt: "We read H1, H2, H3 in order and check: does H2 reveal more than H1? Does H3 reveal more than H2? Each gap must be meaningful.",
  },
];

// ===== Mock eval runs per problem =====
interface DimensionResult {
  id: string;
  medianScore: number;
  passes: { score: number; reasoning: string }[];
}

interface InterviewEvalRun {
  problemId: string;
  compositeScore: number;
  passedThresholds: boolean;
  dimensions: DimensionResult[];
  runAt: string;
}

// Mock judge — deterministic per problem id so it feels stable across runs
function mockReasoningFor(dimensionId: string, _problemTitle: string, scoreBand: "high" | "mid" | "low") {
  const reasoning: Record<string, Record<typeof scoreBand, string>> = {
    clarifying_questions: {
      high: `The AI candidate asked 3 good questions before writing any code — about duplicate timestamps, whether the time window is inclusive, and what to do when two users cross the threshold at the same moment. Exactly the kind of clarifications a real candidate would raise.`,
      mid: `The AI candidate asked 1 question (about the threshold boundary) and then started coding. There were 2 other things worth asking that it missed. The problem is a little too clean.`,
      low: `The AI candidate started coding immediately. Nothing to clarify. The problem is fully spelled out — it reads more like a practice problem than an interview question.`,
    },
    multiple_solutions: {
      high: `Found 3 genuinely different working solutions — a slow nested-loop version, a middle version using sorting + binary search, and a fast version using a per-user queue. A candidate can start anywhere and climb up.`,
      mid: `Two solutions exist (slow and fast), but the "middle" attempt is really just the slow version with a small tweak — not a genuinely different idea. Not much room for a candidate to make partial progress.`,
      low: `Only one solution actually works within the constraints. Anything slower times out, so a candidate who can't see the optimal approach has nothing to show.`,
    },
    novelty_vs_assignments: {
      high: `Compared against all 247 problems in the DSA assignment library. Closest match scored 0.18 — well below the 0.30 threshold. The concept arrangement here is fresh; no candidate would have seen this as homework.`,
      mid: `Closest assignment match scored 0.42. There's an assignment ("Most Frequently Ordered Category") that uses similar concepts in a similar arrangement. A candidate who did that one would have a head start.`,
      low: `Closest assignment match scored 0.71. This problem is too close to assignment "Order Frequency Counter" — same concepts, same shape, just slightly different framing. Candidates who did the assignment will essentially have the answer.`,
    },
    followups_need_new_thinking: {
      high: `3 follow-ups, each requiring a different new idea: (1) "what if events arrive out of order" needs a new invariant, (2) "what if memory is bounded" needs a different data structure, (3) "what if you parallelize across machines" needs partitioning reasoning. Strong candidates have real depth to explore.`,
      mid: `2 follow-ups exist, but one is just "what if N is 10x bigger?" — same solution, scaled. Only 1 follow-up genuinely opens new thinking.`,
      low: `Only 1 follow-up and it's a trivial variant ("what if K is larger?"). Strong candidates would finish the main problem and have nothing more to do for the remaining time.`,
    },
    hint_ladder_escalation: {
      high: `3 hints found, each properly more specific than the last. H1 is conceptual ("think about what state you need per user"). H2 is strategic ("a queue might help — what would you push and pop?"). H3 is near-implementation ("use a deque per user; pop from the front while the oldest timestamp is too old").`,
      mid: `3 hints exist but H2 and H3 are too close — both basically reveal the deque idea. Effectively a 2-step ladder when it should be 3.`,
      low: `Hints don't escalate properly. H1 already mentions the data structure that should appear in H3. The candidate gets the answer almost immediately, or stays totally stuck.`,
    },
  };
  return reasoning[dimensionId]?.[scoreBand] ?? "Judge reasoning not available.";
}

function deterministicScore(seed: string, dimId: string): number {
  // Stable pseudo-random in [2.5, 4.9] based on problem+dim
  let h = 0;
  const s = seed + ":" + dimId;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  const norm = (Math.abs(h) % 1000) / 1000;
  return 2.5 + norm * 2.4;
}

function buildEvalRun(problemId: string): InterviewEvalRun {
  const problem = DSA_INTERVIEW_PROBLEMS.find(p => p.id === problemId);

  const dimensions: DimensionResult[] = DIMENSIONS.map(d => {
    const baseScore = deterministicScore(problemId, d.id);
    const passes = [-0.3, 0, 0.2].map(delta => {
      const score = Math.max(1, Math.min(5, baseScore + delta));
      const band: "high" | "mid" | "low" = score >= 4 ? "high" : score >= 3 ? "mid" : "low";
      return { score: Math.round(score * 10) / 10, reasoning: mockReasoningFor(d.id, problem?.title || "", band) };
    });
    const median = passes.map(p => p.score).sort()[1];
    return { id: d.id, medianScore: median, passes };
  });

  const composite = dimensions.reduce((a, b) => a + b.medianScore, 0) / dimensions.length;
  const passedThresholds = dimensions.every(d => d.medianScore >= (DIMENSIONS.find(x => x.id === d.id)?.threshold ?? 3.5));

  return {
    problemId,
    compositeScore: Math.round(composite * 10) / 10,
    passedThresholds,
    dimensions,
    runAt: new Date().toISOString(),
  };
}

// ===== UI =====

function EvalScorePanel({ run }: { run: InterviewEvalRun }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-md border border-white/8 overflow-hidden">
      <div className="px-3 py-2 bg-white/3 border-b border-white/8 flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-200">Eval Judge Scores</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Composite</span>
          <ScoreBadge score={run.compositeScore} max={5} size="sm" showMax />
        </div>
      </div>

      <div>
        {run.dimensions.map(d => {
          const meta = DIMENSIONS.find(x => x.id === d.id)!;
          const isExpanded = expanded === d.id;
          const passed = d.medianScore >= meta.threshold;

          return (
            <div key={d.id} className="border-b border-white/5 last:border-0">
              <button
                onClick={() => setExpanded(isExpanded ? null : d.id)}
                className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-white/3 transition-colors"
              >
                <div className="flex items-center gap-2 text-left">
                  <span className="text-sm text-neutral-200">{meta.label}</span>
                  {!passed && (
                    <span className="text-[10px] text-rose-400 bg-rose-900/20 border border-rose-800/30 rounded px-1.5 py-0.5">
                      below threshold
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <ScoreBadge score={d.medianScore} max={5} size="sm" />
                  {isExpanded ? <ChevronUp size={13} className="text-neutral-500" /> : <ChevronDown size={13} className="text-neutral-500" />}
                </div>
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  <p className="text-[11px] text-neutral-400 leading-relaxed">{meta.description}</p>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                    <span>Threshold: {meta.threshold.toFixed(1)}</span>
                    <span className="text-neutral-700">·</span>
                    <span>Metric: {meta.metric}</span>
                  </div>
                  <div className="text-[11px] text-neutral-600 italic mb-1">How we check: {meta.judgePrompt}</div>
                  {d.passes.map((p, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <ScoreBadge score={p.score} size="sm" />
                      <p className="text-neutral-400 flex-1">{p.reasoning}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={cn(
        "px-3 py-2 border-t border-white/8 text-xs",
        run.passedThresholds ? "text-emerald-400 bg-emerald-900/10" : "text-rose-400 bg-rose-900/10"
      )}>
        {run.passedThresholds ? "✓ All dimensions above threshold" : "✗ Some dimensions below threshold"}
      </div>
    </div>
  );
}

export default function InterviewEvalsPage() {
  const [activeTab, setActiveTab] = useState<"single" | "batch">("single");

  // Single
  const [selectedId, setSelectedId] = useState(DSA_INTERVIEW_PROBLEMS[0]?.id || "");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<InterviewEvalRun | null>(null);

  // Batch
  const [batchSelected, setBatchSelected] = useState<string[]>([]);
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchResults, setBatchResults] = useState<Record<string, InterviewEvalRun>>({});
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);

  async function handleSingleRun() {
    setRunning(true);
    setResult(null);
    // Simulate judge passes
    await new Promise(r => setTimeout(r, 1400));
    setResult(buildEvalRun(selectedId));
    setRunning(false);
    toast.success("Eval run complete");
  }

  async function handleBatchRun() {
    if (batchSelected.length === 0) {
      toast.error("Select at least one problem");
      return;
    }
    setBatchRunning(true);
    const results: Record<string, InterviewEvalRun> = {};
    for (const id of batchSelected) {
      await new Promise(r => setTimeout(r, 600));
      results[id] = buildEvalRun(id);
      setBatchResults({ ...results });
    }
    setBatchRunning(false);
    toast.success(`Batch eval complete — ${batchSelected.length} problems evaluated`);
  }

  function toggleBatch(id: string) {
    setBatchSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const selected = DSA_INTERVIEW_PROBLEMS.find(p => p.id === selectedId);
  // Stored "latest run" — re-use the deterministic builder so it feels persistent
  const storedRun = selected ? buildEvalRun(selected.id) : null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <Link href="/categories/dsa" className="hover:text-neutral-300">DSA</Link>
          <span>/</span>
          <Link href="/categories/dsa/interview" className="hover:text-neutral-300">Interview</Link>
          <span>/</span>
          <span className="text-neutral-300">Eval Judge</span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-100">Interview Eval Judge</h1>
        <p className="text-sm text-neutral-400 mt-1">
          {DIMENSIONS.length} checks for whether this is an interview problem, not just a hard practice problem. Real-world solve rates and rater agreement live on the <Link href="/categories/dsa/interview/calibration" className="text-violet-400 hover:text-violet-300 underline">Calibration</Link> page.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-md border border-white/10 overflow-hidden w-fit mb-6">
        <button onClick={() => setActiveTab("single")} className={`px-4 py-2 text-xs transition-colors ${activeTab === "single" ? "bg-white/10 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"}`}>Single Run</button>
        <button onClick={() => setActiveTab("batch")} className={`px-4 py-2 text-xs transition-colors ${activeTab === "batch" ? "bg-white/10 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"}`}>Batch Run</button>
      </div>

      {activeTab === "single" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-white/8 p-5">
            <label className="text-xs text-neutral-400 mb-2 block">Select Problem</label>
            <div className="flex items-center gap-3">
              <select
                value={selectedId}
                onChange={e => { setSelectedId(e.target.value); setResult(null); }}
                className="flex-1 bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-300 outline-none focus:border-violet-500/60"
              >
                {DSA_INTERVIEW_PROBLEMS.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
              <button
                onClick={handleSingleRun}
                disabled={running}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white text-sm transition-colors"
              >
                {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                Run Eval
              </button>
            </div>
            {selected && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span>{selected.primaryConcepts.join(", ")}</span>
                <span className="text-neutral-700">·</span>
                <span className="capitalize">Type: {selected.problemType}</span>
                <span className="text-neutral-700">·</span>
                <span>Status: {selected.status.replace(/_/g, " ")}</span>
                <span className="text-neutral-700">·</span>
                <span>{selected.attemptsCount} attempts</span>
              </div>
            )}
          </div>

          {running && (
            <div className="flex items-center gap-3 p-4 rounded-lg border border-violet-800/30 bg-violet-900/10">
              <Loader2 size={16} className="text-violet-400 animate-spin" />
              <p className="text-sm text-violet-300">Running {DIMENSIONS.length} checks against the problem and its artifacts…</p>
            </div>
          )}

          {result && (
            <div className="rounded-lg border border-white/8 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-neutral-200">Eval Result</p>
                <ScoreBadge score={result.compositeScore} max={5} showMax />
              </div>
              <EvalScorePanel run={result} />
            </div>
          )}

          {!result && !running && storedRun && (
            <div className="rounded-lg border border-white/8 p-5">
              <p className="text-xs text-neutral-500 mb-3">Latest stored eval run</p>
              <EvalScorePanel run={storedRun} />
            </div>
          )}
        </div>
      )}

      {activeTab === "batch" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-white/8 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-white/2 border-b border-white/8">
              <p className="text-xs font-medium text-neutral-400">Select Problems for Batch Eval</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setBatchSelected(DSA_INTERVIEW_PROBLEMS.map(p => p.id))} className="text-xs text-violet-400 hover:text-violet-300">Select all</button>
                <button onClick={() => setBatchSelected([])} className="text-xs text-neutral-500 hover:text-neutral-300">Clear</button>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {DSA_INTERVIEW_PROBLEMS.map(p => {
                const isSelected = batchSelected.includes(p.id);
                const r = batchResults[p.id];
                return (
                  <div key={p.id}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer",
                        isSelected ? "bg-violet-900/10" : "hover:bg-white/2"
                      )}
                      onClick={() => toggleBatch(p.id)}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                        isSelected ? "bg-violet-600 border-violet-500" : "border-white/20"
                      )}>
                        {isSelected && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-200 truncate">{p.title}</p>
                        <p className="text-xs text-neutral-600 font-mono">{p.id} · {p.problemType} · {p.difficulty}</p>
                      </div>
                      {r ? (
                        <ScoreBadge score={r.compositeScore} max={5} showMax size="sm" />
                      ) : (
                        <span className="text-xs text-neutral-600">not run</span>
                      )}
                      {r && (
                        <button
                          onClick={e => { e.stopPropagation(); setExpandedBatch(expandedBatch === p.id ? null : p.id); }}
                          className="text-neutral-600 hover:text-neutral-400"
                        >
                          {expandedBatch === p.id ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        </button>
                      )}
                    </div>
                    {expandedBatch === p.id && r && (
                      <div className="px-4 pb-4">
                        <EvalScorePanel run={r} />
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
              disabled={batchRunning || batchSelected.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >
              {batchRunning ? <Loader2 size={14} className="animate-spin" /> : <FlaskConical size={14} />}
              {batchRunning ? `Running ${batchSelected.length} evals…` : `Run Batch Eval (${batchSelected.length})`}
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
