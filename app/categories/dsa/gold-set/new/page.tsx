"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DSA_CONCEPTS, DSA_CLASS_CONTEXTS } from "@/lib/seed/dsa";
import { ConceptPicker } from "@/components/domain/ConceptPicker";
import { addUserGoldSetEntry } from "@/lib/storage/local";
import { toast } from "sonner";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import type { AssignmentRequest } from "@/lib/types";

const STEPS = ["Problem", "Solution & Tests", "Rubric", "Confirm"];

const DIMS = [
  { id: "problem_clarity", label: "Problem Clarity" },
  { id: "test_case_coverage", label: "Test Coverage" },
  { id: "complexity_correctness", label: "Complexity Correctness" },
  { id: "concept_rubric_alignment", label: "Rubric Alignment" },
  { id: "real_world_fidelity", label: "Real-World Fidelity" },
  { id: "novelty", label: "Novelty" },
];

export default function NewGoldSetPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 1 — Problem
  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");
  const [inputFormat, setInputFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [constraints, setConstraints] = useState("1 ≤ n ≤ 10^5");
  const [primaryConcepts, setPrimaryConcepts] = useState<string[]>([]);
  const [classContextId, setClassContextId] = useState(DSA_CLASS_CONTEXTS[0]?.id || "");

  // Step 2 — Solution
  const [solutionCode, setSolutionCode] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");

  // Step 3 — Rubric ratings
  const [ratings, setRatings] = useState<Record<string, number>>(
    Object.fromEntries(DIMS.map(d => [d.id, 4]))
  );
  const [ratingComment, setRatingComment] = useState("");

  async function handleSave() {
    if (!title.trim() || !statement.trim() || primaryConcepts.length === 0) {
      toast.error("Please complete all required fields");
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));

    const request: AssignmentRequest = {
      categoryId: "dsa",
      classContextId,
      targetConcepts: { primary: primaryConcepts, secondary: [], mustNotRequire: [] },
      difficultyTarget: { tier: "medium", expectedSolveTimeMinutes: 30, expectedConceptCount: primaryConcepts.length, constraintComplexity: "moderate" },
      assignmentType: "coding_problem",
      corpusSliceIds: [],
    };

    const id = `gold-user-${Date.now()}`;
    addUserGoldSetEntry({
      id,
      categoryId: "dsa",
      input: request,
      output: {
        id: `${id}-output`,
        request,
        problem: {
          title,
          statement,
          inputFormat,
          outputFormat,
          constraints: constraints.split("\n").filter(Boolean),
          examples: [],
        },
        starterCode: [{ language: "python", code: `def solution():\n    pass` }],
        referenceSolution: { language: "python", code: solutionCode, complexityTime: timeComplexity, complexitySpace: spaceComplexity },
        testCases: [],
        rubric: {
          evaluationDimensions: DIMS.map(d => ({
            dimension: d.id,
            weight: 1,
            anchors: { 1: "Below standard", 3: "Meets standard", 5: "Exceeds standard" },
            evidenceRequired: "",
          })),
          conceptsBeingAssessed: primaryConcepts,
          redFlags: [],
        },
        metadata: {
          conceptsRequired: primaryConcepts,
          conceptsOptional: [],
          estimatedDifficultyScore: 3,
          estimatedSolveTimeMinutes: 30,
          noveltyHash: `hash-${Date.now()}`,
          sourceInspirations: [],
        },
        reasoningTrace: {
          conceptSelectionRationale: "Manually authored",
          scenarioSelectionRationale: "Manually authored",
          difficultyCalibrationRationale: "Manually authored",
          deviationsFromCorpus: "N/A — gold set entry",
        },
        versions: {
          pipelineVersion: "manual:1.0",
          promptVersion: "manual",
          judgeVersion: "manual",
          taxonomyVersion: 1,
          goldSetVersion: 1,
        },
        createdAt: new Date().toISOString(),
      },
      authoredBy: "Sarah Chen",
      authoredAt: new Date().toISOString(),
      status: "candidate",
      taxonomyVersion: 1,
      humanRatings: [{
        rater: "user-sarah-chen",
        perDimension: ratings,
        overallComment: ratingComment,
      }],
    });
    setSaving(false);
    toast.success("Gold set entry saved");
    router.push("/categories/dsa/gold-set");
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
          <span>/</span>
          <a href="/categories/dsa/gold-set" className="hover:text-neutral-300">Gold Set</a>
          <span>/</span>
          <span className="text-neutral-300">New</span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-100">Author Gold Set Entry</h1>
      </div>

      {/* Steps */}
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

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 mb-1.5 block">Problem Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60" placeholder="e.g. First Recurring Error Code" />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1.5 block">Problem Statement *</label>
            <textarea value={statement} onChange={e => setStatement(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 h-32 resize-none" placeholder="Full problem description (markdown supported)..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Input Format</label>
              <textarea value={inputFormat} onChange={e => setInputFormat(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 h-20 resize-none" placeholder="Describe input format..." />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Output Format</label>
              <textarea value={outputFormat} onChange={e => setOutputFormat(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 h-20 resize-none" placeholder="Describe output format..." />
            </div>
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1.5 block">Constraints (one per line)</label>
            <textarea value={constraints} onChange={e => setConstraints(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 h-20 resize-none font-mono" />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1.5 block">Primary Concepts *</label>
            <ConceptPicker selected={primaryConcepts} onChange={setPrimaryConcepts} label="Primary Concepts" />
          </div>
          <div>
            <label className="text-xs text-neutral-400 mb-1.5 block">Class Context</label>
            <select value={classContextId} onChange={e => setClassContextId(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-300 outline-none focus:border-indigo-500/60">
              {DSA_CLASS_CONTEXTS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setStep(1)} disabled={!title.trim() || !statement.trim() || primaryConcepts.length === 0} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded py-2 text-sm transition-colors">Continue</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 mb-1.5 block">Reference Solution (Python)</label>
            <textarea value={solutionCode} onChange={e => setSolutionCode(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 h-48 resize-none font-mono" placeholder="def solution(...):\n    pass" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Time Complexity</label>
              <input value={timeComplexity} onChange={e => setTimeComplexity(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 font-mono" placeholder="O(n)" />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Space Complexity</label>
              <input value={spaceComplexity} onChange={e => setSpaceComplexity(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 font-mono" placeholder="O(n)" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setStep(0)} className="px-4 py-2 border border-white/10 text-neutral-400 rounded text-sm hover:text-neutral-200 transition-colors">Back</button>
            <button onClick={() => setStep(2)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded py-2 text-sm transition-colors">Continue</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-neutral-400">Rate the quality of this gold set entry across dimensions.</p>
          {DIMS.map(dim => (
            <div key={dim.id} className="flex items-center gap-3">
              <span className="text-xs text-neutral-400 w-36 shrink-0">{dim.label}</span>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={() => setRatings(prev => ({ ...prev, [dim.id]: v }))} className={`w-8 h-8 rounded text-sm transition-colors border ${ratings[dim.id] >= v ? "bg-amber-500/20 border-amber-500/60 text-amber-300" : "border-white/10 text-neutral-600 hover:border-white/20"}`}>{v}</button>
                ))}
              </div>
              <span className="text-xs text-neutral-500">{ratings[dim.id]}/5</span>
            </div>
          ))}
          <div>
            <label className="text-xs text-neutral-400 mb-1.5 block">Overall Comment</label>
            <textarea value={ratingComment} onChange={e => setRatingComment(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 h-20 resize-none" placeholder="Optional comments..." />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setStep(1)} className="px-4 py-2 border border-white/10 text-neutral-400 rounded text-sm hover:text-neutral-200 transition-colors">Back</button>
            <button onClick={() => setStep(3)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded py-2 text-sm transition-colors">Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div className="rounded-lg border border-white/8 p-5 space-y-3 text-sm">
            <div className="flex items-start justify-between"><span className="text-neutral-500">Title</span><span className="text-neutral-200 max-w-xs text-right">{title}</span></div>
            <div className="flex items-start justify-between"><span className="text-neutral-500">Concepts</span><span className="text-neutral-200">{primaryConcepts.join(", ")}</span></div>
            <div className="flex items-start justify-between"><span className="text-neutral-500">Solution</span><span className="text-neutral-200">{solutionCode ? `${solutionCode.split("\n").length} lines` : "—"}</span></div>
            <div className="flex items-start justify-between"><span className="text-neutral-500">Complexity</span><span className="text-neutral-200 font-mono">{timeComplexity || "?"} / {spaceComplexity || "?"}</span></div>
            <div className="flex items-start justify-between"><span className="text-neutral-500">Avg Rating</span><span className="text-amber-400">{(Object.values(ratings).reduce((a,b)=>a+b,0)/DIMS.length).toFixed(1)}/5</span></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="px-4 py-2 border border-white/10 text-neutral-400 rounded text-sm hover:text-neutral-200 transition-colors">Back</button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded py-2 text-sm transition-colors"
            >
              {saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : "Save Gold Set Entry"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
