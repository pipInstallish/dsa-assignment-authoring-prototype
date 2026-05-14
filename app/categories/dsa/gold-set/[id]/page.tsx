"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { DSA_GOLD_SET } from "@/lib/seed/dsa";
import { getUserGoldSetEntries } from "@/lib/storage/local";
import { ConceptBadge } from "@/components/domain/ConceptBadge";
import { AssignmentPreview } from "@/components/domain/AssignmentPreview";
import { MonacoDisplay } from "@/components/domain/MonacoDisplay";
import { Star, Code2, FileText } from "lucide-react";

const DIM_LABELS: Record<string, string> = {
  problem_clarity: "Clarity",
  test_case_coverage: "Test Coverage",
  complexity_correctness: "Complexity",
  concept_rubric_alignment: "Rubric Align.",
  real_world_fidelity: "Real-World",
  novelty: "Novelty",
};

export default function GoldSetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userEntries = getUserGoldSetEntries();
  const entry = [...DSA_GOLD_SET, ...userEntries].find(e => e.id === id);
  const [activeTab, setActiveTab] = useState<"problem" | "solution" | "rubric" | "reasoning">("problem");

  if (!entry) return (
    <div className="p-8 text-center text-neutral-500">
      <p>Gold set entry not found</p>
      <a href="/categories/dsa/gold-set" className="text-indigo-400 text-sm mt-2 inline-block">← Back</a>
    </div>
  );

  const { output } = entry;
  const avgRating = entry.humanRatings.length > 0
    ? Object.values(entry.humanRatings[0].perDimension).reduce((a, b) => a + b, 0) /
      Object.values(entry.humanRatings[0].perDimension).length
    : null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-5">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
          <span>/</span>
          <a href="/categories/dsa/gold-set" className="hover:text-neutral-300">Gold Set</a>
          <span>/</span>
          <span className="text-neutral-300">{entry.id}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-100">{output.problem.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              {output.metadata.conceptsRequired.map(cid => (
                <ConceptBadge key={cid} conceptId={cid} size="sm" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {avgRating !== null && (
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} className={i <= Math.round(avgRating) ? "text-amber-400" : "text-neutral-700"} fill="currentColor" />
                ))}
                <span className="text-xs text-neutral-400 ml-1">{avgRating.toFixed(1)}/5</span>
              </div>
            )}
            <span className={`text-xs border rounded px-2 py-0.5 ${entry.status === "canonical" ? "text-emerald-400 bg-emerald-900/20 border-emerald-800/40" : "text-amber-400 bg-amber-900/20 border-amber-800/40"}`}>
              {entry.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/8 mb-5 gap-1">
        {(["problem", "solution", "rubric", "reasoning"] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px ${activeTab === t ? "border-indigo-500 text-indigo-300" : "border-transparent text-neutral-500 hover:text-neutral-300"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === "problem" && <AssignmentPreview assignment={output} />}

      {activeTab === "solution" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-white/8 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/2 border-b border-white/8">
              <Code2 size={14} className="text-neutral-400" />
              <span className="text-xs text-neutral-400">Reference Solution — {output.referenceSolution.language}</span>
              <span className="ml-auto text-xs text-neutral-600">{output.referenceSolution.complexityTime} · {output.referenceSolution.complexitySpace}</span>
            </div>
            <MonacoDisplay code={output.referenceSolution.code} language={output.referenceSolution.language} />
          </div>
          {output.testCases.length > 0 && (
            <div className="rounded-lg border border-white/8 overflow-hidden">
              <div className="px-4 py-2.5 bg-white/2 border-b border-white/8 text-xs text-neutral-400">
                Test Cases ({output.testCases.length})
              </div>
              <div className="divide-y divide-white/5">
                {output.testCases.map(tc => (
                  <div key={tc.id} className="px-4 py-3 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Input</p>
                      <code className="text-xs text-neutral-300 font-mono whitespace-pre">{tc.input}</code>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Expected Output</p>
                      <code className="text-xs text-neutral-300 font-mono">{tc.expectedOutput}</code>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-xs rounded px-1.5 py-0.5 ${tc.visibility === "sample" ? "text-blue-400 bg-blue-900/20" : "text-neutral-500 bg-neutral-800"}`}>{tc.visibility}</span>
                      <span className="text-xs text-neutral-600 ml-2">{tc.rationale}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "rubric" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-white/8 overflow-hidden">
            <div className="px-4 py-3 bg-white/2 border-b border-white/8 text-xs text-neutral-400">Evaluation Dimensions</div>
            <div className="divide-y divide-white/5">
              {output.rubric.evaluationDimensions.map(dim => (
                <div key={dim.dimension} className="px-4 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-neutral-200">{DIM_LABELS[dim.dimension] || dim.dimension}</p>
                    <span className="text-xs text-neutral-500">weight {dim.weight}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    {([1,3,5] as const).map(anchor => (
                      <div key={anchor} className={`p-2 rounded border ${anchor === 1 ? "border-rose-800/30 bg-rose-900/10" : anchor === 3 ? "border-amber-800/30 bg-amber-900/10" : "border-emerald-800/30 bg-emerald-900/10"}`}>
                        <span className={`font-medium ${anchor === 1 ? "text-rose-400" : anchor === 3 ? "text-amber-400" : "text-emerald-400"}`}>Score {anchor}</span>
                        <p className="text-neutral-400 mt-1">{dim.anchors[anchor]}</p>
                      </div>
                    ))}
                  </div>
                  {dim.evidenceRequired && (
                    <p className="text-xs text-neutral-500 mt-2">Evidence: {dim.evidenceRequired}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {entry.humanRatings.length > 0 && (
            <div className="rounded-lg border border-white/8 overflow-hidden">
              <div className="px-4 py-3 bg-white/2 border-b border-white/8 text-xs text-neutral-400">Human Ratings</div>
              <div className="p-4 space-y-2">
                {Object.entries(entry.humanRatings[0].perDimension).map(([dim, score]) => (
                  <div key={dim} className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500 w-32">{DIM_LABELS[dim] || dim}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-5 h-5 rounded text-xs flex items-center justify-center ${i <= score ? "bg-amber-500 text-neutral-900" : "bg-neutral-800 text-neutral-600"}`}>{i <= score ? "★" : "☆"}</div>
                      ))}
                    </div>
                    <span className="text-xs text-neutral-400">{score}/5</span>
                  </div>
                ))}
                {entry.humanRatings[0].overallComment && (
                  <p className="text-xs text-neutral-400 mt-3 pt-3 border-t border-white/5">{entry.humanRatings[0].overallComment}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "reasoning" && (
        <div className="space-y-3">
          {Object.entries(output.reasoningTrace).map(([key, value]) => (
            <div key={key} className="rounded-lg border border-white/8 p-4">
              <p className="text-xs font-medium text-neutral-400 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-sm text-neutral-300 leading-relaxed">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
