"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ConceptPicker } from "@/components/domain/ConceptPicker";
import { MonacoDisplay } from "@/components/domain/MonacoDisplay";
import {
  MOCK_GENERATED_INTERVIEW,
  DIFFICULTY_TIME_DEFAULTS,
  PROBLEM_TYPE_DESCRIPTIONS,
  getDifficultyRubric,
  type GeneratedInterviewProblem,
  type InterviewProblemType,
} from "@/lib/seed/dsa";
import { toast } from "sonner";
import {
  Sparkles, Check, ChevronRight, Loader2, CheckCircle, ThumbsUp, ThumbsDown,
  AlertTriangle, Info, Clock, Shield
} from "lucide-react";

const STEPS = ["Configure", "Generating", "Review Output", "Approve"];

const INTERVIEW_STAGES = [
  { stage: "concept-grounding", label: "Grounding in interview gold set" },
  { stage: "leakage-check", label: "Anti-leakage scan (vs public corpus)" },
  { stage: "problem-draft", label: "Drafting problem statement" },
  { stage: "solutions", label: "Generating brute + optimal solutions" },
  { stage: "rubric", label: "Building evaluator rubric" },
  { stage: "hint-ladder", label: "Composing hint ladder" },
  { stage: "follow-ups", label: "Generating follow-up extensions" },
  { stage: "red-flags", label: "Cataloging common wrong approaches" },
  { stage: "self-eval", label: "Self-eval against differentiation criteria" },
];

export default function GenerateInterviewPage() {
  const [step, setStep] = useState(0);

  // Configure
  const [problemType, setProblemType] = useState<InterviewProblemType>("written_coding_interview");
  const [primaryConcepts, setPrimaryConcepts] = useState<string[]>([]);
  const [secondaryConcepts, setSecondaryConcepts] = useState<string[]>([]);
  const [mustNotConcepts, setMustNotConcepts] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [timeBudget, setTimeBudget] = useState<number>(DIFFICULTY_TIME_DEFAULTS.written_coding_interview.medium);
  const [timeManuallyOverridden, setTimeManuallyOverridden] = useState(false);
  const [domain, setDomain] = useState("e-commerce");

  // Generating
  const [stages, setStages] = useState(INTERVIEW_STAGES.map(s => ({ ...s, done: false })));
  const [isGenerating, setIsGenerating] = useState(false);

  // Result
  const [problem, setProblem] = useState<GeneratedInterviewProblem | null>(null);
  const [activeTab, setActiveTab] = useState<"problem" | "rubric" | "hints" | "followups" | "solutions" | "redflags" | "leakage">("problem");

  // Approval
  const [approveLoading, setApproveLoading] = useState(false);

  // When difficulty or problem type changes, auto-update time budget (unless user manually overrode it)
  function handleDifficultyChange(d: "easy" | "medium" | "hard") {
    setDifficulty(d);
    if (!timeManuallyOverridden) setTimeBudget(DIFFICULTY_TIME_DEFAULTS[problemType][d]);
  }

  function handleProblemTypeChange(t: InterviewProblemType) {
    setProblemType(t);
    if (!timeManuallyOverridden) setTimeBudget(DIFFICULTY_TIME_DEFAULTS[t][difficulty]);
  }

  function handleTimeChange(t: number) {
    setTimeBudget(t);
    setTimeManuallyOverridden(true);
  }

  const rubricInfo = useMemo(
    () => getDifficultyRubric([...primaryConcepts, ...secondaryConcepts], difficulty, problemType),
    [primaryConcepts, secondaryConcepts, difficulty, problemType]
  );

  const timeMismatch = useMemo(() => {
    const defaultTime = DIFFICULTY_TIME_DEFAULTS[problemType][difficulty];
    return Math.abs(timeBudget - defaultTime) > 10;
  }, [difficulty, timeBudget, problemType]);

  async function handleGenerate() {
    if (primaryConcepts.length === 0) {
      toast.error("Select at least one primary concept");
      return;
    }
    setStages(INTERVIEW_STAGES.map(s => ({ ...s, done: false })));
    setIsGenerating(true);
    setStep(1);

    // Animate stages
    for (let i = 0; i < INTERVIEW_STAGES.length; i++) {
      await new Promise(r => setTimeout(r, 350));
      setStages(prev => prev.map((s, idx) => idx <= i ? { ...s, done: true } : s));
    }

    setProblem({
      ...MOCK_GENERATED_INTERVIEW,
      title: domain === "e-commerce" ? MOCK_GENERATED_INTERVIEW.title : MOCK_GENERATED_INTERVIEW.title.replace(/Refund/i, "Activity"),
    });
    setIsGenerating(false);
    await new Promise(r => setTimeout(r, 400));
    setStep(2);
  }

  async function handleApprove() {
    setApproveLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setApproveLoading(false);
    setStep(3);
    toast.success("Interview problem approved — added awaiting calibration");
  }

  function reset() {
    setStep(0);
    setProblem(null);
    setPrimaryConcepts([]);
    setSecondaryConcepts([]);
    setMustNotConcepts([]);
    setTimeManuallyOverridden(false);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <Link href="/categories/dsa" className="hover:text-neutral-300">DSA</Link>
          <span>/</span>
          <Link href="/categories/dsa/interview" className="hover:text-neutral-300">Interview</Link>
          <span>/</span>
          <span className="text-neutral-300">Generate</span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-100">Generate Interview Problem</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Output includes problem statement, rubric, hint ladder, follow-ups, and multi-level reference solutions.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
              i < step ? "bg-violet-600 text-white" :
              i === step ? "bg-violet-600/30 border border-violet-500 text-violet-300" :
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
              <ConceptPicker selected={primaryConcepts} onChange={setPrimaryConcepts} label="Primary Concepts" color="violet" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Secondary Concepts <span className="text-neutral-600">(may appear incidentally)</span></label>
              <ConceptPicker selected={secondaryConcepts} onChange={setSecondaryConcepts} label="Secondary Concepts" color="violet" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Must Not Require</label>
              <ConceptPicker selected={mustNotConcepts} onChange={setMustNotConcepts} label="Must Not Require" color="rose" />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Problem Type</label>
              <div className="flex gap-2">
                {([
                  { id: "written_coding" as const, label: "Coding" },
                  { id: "written_coding_interview" as const, label: "Interview" },
                ]).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleProblemTypeChange(opt.id)}
                    className={`flex-1 py-2 rounded text-sm border transition-colors ${problemType === opt.id ? "border-violet-500 bg-violet-900/20 text-violet-300" : "border-white/10 text-neutral-500 hover:text-neutral-300"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1.5 leading-relaxed">
                {PROBLEM_TYPE_DESCRIPTIONS[problemType]}
              </p>
            </div>

            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Difficulty</label>
              <div className="flex gap-2">
                {(["easy", "medium", "hard"] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => handleDifficultyChange(d)}
                    className={`flex-1 py-2 rounded text-sm capitalize border transition-colors ${difficulty === d ? "border-violet-500 bg-violet-900/20 text-violet-300" : "border-white/10 text-neutral-500 hover:text-neutral-300"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Inline rubric definition */}
              <div className="mt-2 rounded-md bg-neutral-900/60 border border-white/8 p-3">
                <div className="flex items-start gap-2 mb-2">
                  <Info size={13} className="text-violet-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-neutral-300 font-medium">
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} {problemType === "written_coding" ? "standalone coding" : "interview"} for {primaryConcepts.length === 0 ? "this concept combo" : primaryConcepts.slice(0, 2).join(" + ")} typically means:
                    </p>
                  </div>
                </div>
                <ul className="space-y-1 ml-5">
                  {rubricInfo.features.map((f, i) => (
                    <li key={i} className="text-xs text-neutral-400 flex gap-1.5">
                      <span className="text-violet-500">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/5 text-[10px] text-neutral-500">
                  <span>Target: {rubricInfo.targetSolve}</span>
                  <span>·</span>
                  <span>
                    Calibration:{" "}
                    <span className={
                      rubricInfo.calibrationStrength === "strong" ? "text-emerald-400" :
                      rubricInfo.calibrationStrength === "moderate" ? "text-amber-400" :
                      "text-rose-400"
                    }>
                      {rubricInfo.calibrationStrength}
                    </span>
                    {" "}({rubricInfo.goldExamples} gold)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block flex items-center gap-1.5">
                <Clock size={11} />
                Time Budget (minutes)
                {!timeManuallyOverridden && <span className="text-neutral-600 font-normal">(auto from difficulty)</span>}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={timeBudget}
                  onChange={e => handleTimeChange(parseInt(e.target.value) || 0)}
                  min={5}
                  max={120}
                  className="w-24 bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-violet-500/60"
                />
                {timeManuallyOverridden && (
                  <button
                    onClick={() => { setTimeManuallyOverridden(false); setTimeBudget(DIFFICULTY_TIME_DEFAULTS[problemType][difficulty]); }}
                    className="text-[11px] text-neutral-500 hover:text-neutral-300 underline"
                  >
                    reset to default
                  </button>
                )}
              </div>
              {timeMismatch && (
                <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-amber-400/80">
                  <AlertTriangle size={11} className="mt-0.5 shrink-0" />
                  <span>
                    Unusual: {difficulty} {problemType === "written_coding" ? "standalone coding" : "interview"} problems typically take {DIFFICULTY_TIME_DEFAULTS[problemType][difficulty]} min.
                    Intentionally creating a time-pressure variant?
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Real-World Domain</label>
              <input
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-violet-500/60"
                placeholder="e.g. e-commerce, fintech, social"
              />
            </div>

            <div className="rounded-md bg-violet-950/30 border border-violet-800/30 p-3 text-xs text-violet-300/80">
              <p className="font-medium mb-1 flex items-center gap-1.5">
                <Shield size={11} />
                Interview-specific generation
              </p>
              <p className="text-violet-400/60 leading-relaxed">
                Will include anti-leakage scan vs public problem corpus, plus rubric, hint ladder, follow-ups, and multi-level reference solutions.
              </p>
            </div>
          </div>

          <div className="col-span-2">
            <button
              onClick={handleGenerate}
              disabled={primaryConcepts.length === 0 || isGenerating}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              <Sparkles size={16} />
              Generate Interview Problem
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Generating */}
      {step === 1 && (
        <div className="max-w-lg mx-auto py-8">
          <div className="flex items-center gap-3 mb-6">
            <Loader2 size={18} className="text-violet-400 animate-spin" />
            <h2 className="text-base font-medium text-neutral-200">Generating interview problem...</h2>
          </div>
          <div className="space-y-2">
            {stages.map((s, i) => {
              const isActive = !s.done && stages.slice(0, i).every(prev => prev.done);
              return (
                <div key={s.stage} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
                  s.done ? "border-emerald-800/40 bg-emerald-900/10" :
                  isActive ? "border-violet-500/40 bg-violet-900/10" :
                  "border-white/5 bg-white/2"
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    s.done ? "bg-emerald-600" :
                    isActive ? "bg-violet-600/50 border border-violet-500" :
                    "bg-neutral-800 border border-white/10"
                  }`}>
                    {s.done ? <Check size={11} className="text-white" /> :
                     isActive ? <Loader2 size={11} className="text-violet-300 animate-spin" /> :
                     <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full" />}
                  </div>
                  <span className={`text-xs ${s.done ? "text-neutral-300" : isActive ? "text-neutral-200" : "text-neutral-600"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && problem && (
        <div className="space-y-4">
          {/* Outcome banner */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-emerald-800/40 bg-emerald-900/10">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Generation passed self-eval</span>
            <span className="text-neutral-500 text-xs ml-auto flex items-center gap-3">
              <span>Est. solve band: <span className="text-violet-300">{problem.estimatedSolveBand}</span></span>
              <span className="text-neutral-700">·</span>
              <span>Leakage score: <span className={problem.leakageScore < 0.3 ? "text-emerald-400" : "text-amber-400"}>{problem.leakageScore.toFixed(2)}</span></span>
            </span>
          </div>

          {/* Tabs */}
          <div className="rounded-lg border border-white/8 overflow-hidden">
            <div className="flex border-b border-white/8 bg-white/2 overflow-x-auto">
              {([
                { id: "problem", label: "Problem" },
                { id: "rubric", label: "Rubric" },
                { id: "hints", label: "Hint Ladder" },
                { id: "followups", label: "Follow-ups" },
                { id: "solutions", label: "Solutions" },
                { id: "redflags", label: "Red Flags" },
                { id: "leakage", label: "Leakage Check" },
              ] as const).map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2.5 text-xs whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === t.id ? "border-violet-500 text-violet-300" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
                >
                  {t.label}
                </button>
              ))}
              <div className="ml-auto flex items-center px-3 gap-2 text-xs text-neutral-500">
                <span>{problem.title}</span>
              </div>
            </div>

            <div className="p-5">
              {activeTab === "problem" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-100 mb-2">{problem.title}</h3>
                    <p className="text-sm text-neutral-300 leading-relaxed">{problem.statement}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-neutral-500 mb-1">Input format</p>
                      <p className="text-neutral-300 font-mono bg-neutral-900/60 border border-white/8 rounded p-2">{problem.inputFormat}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 mb-1">Output format</p>
                      <p className="text-neutral-300 font-mono bg-neutral-900/60 border border-white/8 rounded p-2">{problem.outputFormat}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-neutral-500 mb-1">Example input</p>
                      <pre className="text-neutral-300 font-mono bg-neutral-900/60 border border-white/8 rounded p-2 whitespace-pre-wrap">{problem.exampleInput}</pre>
                    </div>
                    <div>
                      <p className="text-neutral-500 mb-1">Example output</p>
                      <pre className="text-neutral-300 font-mono bg-neutral-900/60 border border-white/8 rounded p-2 whitespace-pre-wrap">{problem.exampleOutput}</pre>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Constraints</p>
                    <ul className="space-y-0.5">
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="text-xs text-neutral-300 font-mono flex gap-1.5">
                          <span className="text-neutral-600">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Edge cases (candidate should discover)</p>
                    <ul className="space-y-0.5">
                      {problem.edgeCases.map((e, i) => (
                        <li key={i} className="text-xs text-neutral-300 flex gap-1.5">
                          <span className="text-violet-500">•</span>
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "rubric" && (
                <div className="space-y-3">
                  <p className="text-xs text-neutral-500 mb-3">Evaluator scores each axis 1–5. Bands show what each score looks like in practice.</p>
                  {problem.rubric.map((r, i) => (
                    <div key={i} className="rounded-md border border-white/8 bg-white/2 p-3">
                      <p className="text-sm font-medium text-neutral-200 mb-2">{r.axis}</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="rounded bg-rose-950/30 border border-rose-900/30 p-2">
                          <p className="text-rose-400 font-medium mb-1">Band 1 — Weak</p>
                          <p className="text-neutral-400">{r.band1}</p>
                        </div>
                        <div className="rounded bg-amber-950/30 border border-amber-900/30 p-2">
                          <p className="text-amber-400 font-medium mb-1">Band 3 — Baseline</p>
                          <p className="text-neutral-400">{r.band3}</p>
                        </div>
                        <div className="rounded bg-emerald-950/30 border border-emerald-900/30 p-2">
                          <p className="text-emerald-400 font-medium mb-1">Band 5 — Strong</p>
                          <p className="text-neutral-400">{r.band5}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "hints" && (
                <div className="space-y-3">
                  <p className="text-xs text-neutral-500 mb-2">Graded hints — interviewer offers in order if candidate is stuck. Each is more specific than the last.</p>
                  {problem.hintLadder.map(h => (
                    <div key={h.level} className="flex gap-3 p-3 rounded-md border border-white/8 bg-white/2">
                      <div className="shrink-0 w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300 flex items-center justify-center text-xs font-medium">
                        H{h.level}
                      </div>
                      <p className="text-sm text-neutral-300 flex-1">{h.hint}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "followups" && (
                <div className="space-y-2">
                  <p className="text-xs text-neutral-500 mb-2">If the candidate solves the core problem quickly, probe deeper with these.</p>
                  {problem.followUps.map((f, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-md border border-white/8 bg-white/2">
                      <span className="text-violet-400 text-xs font-medium">F{i + 1}</span>
                      <p className="text-sm text-neutral-300">{f}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "solutions" && (
                <div className="space-y-4">
                  {problem.solutions.map((s, i) => (
                    <div key={i} className="rounded border border-white/8 overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 bg-white/2 border-b border-white/8 text-xs">
                        <span className={`px-2 py-0.5 rounded capitalize ${
                          s.level === "optimal" ? "bg-emerald-900/30 text-emerald-300 border border-emerald-800/40" :
                          s.level === "intermediate" ? "bg-amber-900/30 text-amber-300 border border-amber-800/40" :
                          "bg-rose-900/30 text-rose-300 border border-rose-800/40"
                        }`}>{s.level}</span>
                        <span className="text-neutral-400">{s.complexityTime} time · {s.complexitySpace} space</span>
                        <span className="ml-auto text-neutral-500 italic">{s.insight}</span>
                      </div>
                      <MonacoDisplay code={s.code} language="python" height={s.code.split("\n").length * 18 + 30} />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "redflags" && (
                <div className="space-y-2">
                  <p className="text-xs text-neutral-500 mb-2">Common wrong approaches. If you spot one in a candidate's solve, it's diagnostic — flag in the rubric.</p>
                  {problem.redFlags.map((r, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-md border border-rose-900/30 bg-rose-950/20">
                      <AlertTriangle size={14} className="text-rose-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-neutral-300">{r}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "leakage" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-md border border-emerald-800/40 bg-emerald-950/20">
                    <Shield size={14} className="text-emerald-400" />
                    <p className="text-sm text-neutral-300">
                      Leakage score: <span className="text-emerald-400 font-medium">{problem.leakageScore.toFixed(2)}</span>
                      <span className="text-neutral-500 ml-2 text-xs">(threshold: 0.30 — lower is better)</span>
                    </p>
                  </div>
                  <div className="rounded-md border border-white/8 bg-white/2 p-3">
                    <p className="text-xs text-neutral-400 mb-2">Nearest public problems found:</p>
                    <div className="space-y-1.5">
                      {[
                        { title: "LC 1004 — Max Consecutive Ones III", sim: 0.18 },
                        { title: "LC 567 — Permutation in String", sim: 0.14 },
                        { title: "Striver A2Z — Sliding Window patterns", sim: 0.12 },
                      ].map((m, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-neutral-300">{m.title}</span>
                          <span className="text-neutral-500 font-mono">sim {m.sim.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    Compared against ~12,400 public problems (LeetCode, GFG, Striver, NeetCode, Codeforces). Domain reframing and constraint changes are the main novelty drivers.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleApprove}
              disabled={approveLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              {approveLoading ? <Loader2 size={14} className="animate-spin" /> : <ThumbsUp size={14} />}
              Approve & queue for calibration
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-rose-800/60 bg-rose-900/10 text-rose-400 text-sm hover:bg-rose-900/20 transition-colors"
            >
              <ThumbsDown size={14} />
              Discard
            </button>
            <p className="text-xs text-neutral-500 ml-auto">
              After approval, problem enters <span className="text-amber-400">awaiting_calibration</span> until ≥30 candidates have attempted it.
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Approved */}
      {step === 3 && (
        <div className="max-w-md mx-auto py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-100 mb-2">Interview problem approved</h2>
          <p className="text-sm text-neutral-400 mb-2">{problem?.title} added to library.</p>
          <p className="text-xs text-neutral-500 mb-6">Status: <span className="text-amber-400">awaiting_calibration</span>. Real solve rate will populate after deployment.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/categories/dsa/interview/problems" className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white text-sm transition-colors">
              View Library
            </Link>
            <button
              onClick={reset}
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
