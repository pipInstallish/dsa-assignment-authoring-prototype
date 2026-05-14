"use client";

import { useState } from "react";
import { DSA_PROMPTS, DSA_PROMPT_PROPOSALS } from "@/lib/seed/dsa";
import { getPromptProposalStatuses, setPromptProposalStatus } from "@/lib/storage/local";
import { mockApprovePromptProposal, mockRejectPromptProposal } from "@/lib/mock/llm";
import { toast } from "sonner";
import { Check, X, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight } from "lucide-react";

const DIM_LABELS: Record<string, string> = {
  problem_clarity: "Clarity",
  test_case_coverage: "Test Coverage",
  complexity_correctness: "Complexity",
  concept_rubric_alignment: "Rubric Align.",
  real_world_fidelity: "Real-World",
  novelty: "Novelty",
};

export default function ProposalsPage() {
  const [statuses, setStatuses] = useState(() => getPromptProposalStatuses());
  const [loading, setLoading] = useState<string | null>(null);
  const [expandedDiff, setExpandedDiff] = useState<string | null>(null);

  const proposals = DSA_PROMPT_PROPOSALS.map(p => ({
    ...p,
    status: statuses[p.id] || p.status,
  }));

  const getBasePrompt = (id: string) => DSA_PROMPTS.find(p => p.id === id);

  async function handleApprove(id: string) {
    setLoading(id);
    await mockApprovePromptProposal(id);
    setPromptProposalStatus(id, "approved");
    setStatuses(prev => ({ ...prev, [id]: "approved" }));
    setLoading(null);
    toast.success("Proposal approved — new prompt version activated");
  }

  async function handleReject(id: string) {
    setLoading(id);
    await mockRejectPromptProposal(id);
    setPromptProposalStatus(id, "rejected");
    setStatuses(prev => ({ ...prev, [id]: "rejected" }));
    setLoading(null);
    toast.info("Proposal rejected");
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
          <span>/</span>
          <a href="/categories/dsa/prompts" className="hover:text-neutral-300">Prompts</a>
          <span>/</span>
          <span className="text-neutral-300">Proposals</span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-100">Prompt Proposals</h1>
        <p className="text-sm text-neutral-400 mt-1">{proposals.filter(p => p.status === "pending").length} pending · {proposals.length} total</p>
      </div>

      <div className="space-y-5">
        {proposals.map(proposal => {
          const basePrompt = getBasePrompt(proposal.basePromptId);
          const isDiffExpanded = expandedDiff === proposal.id;
          const statusStyle = proposal.status === "pending"
            ? "text-amber-400 bg-amber-900/20 border-amber-800/40"
            : proposal.status === "approved"
            ? "text-emerald-400 bg-emerald-900/20 border-emerald-800/40"
            : "text-rose-400 bg-rose-900/20 border-rose-800/40";

          return (
            <div key={proposal.id} className="rounded-lg border border-white/8 overflow-hidden">
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-neutral-200">{proposal.id}</span>
                      <span className={`text-xs border rounded px-1.5 py-0.5 ${statusStyle}`}>{proposal.status}</span>
                      <span className="text-xs text-neutral-600">Proposed by {proposal.proposingAgent}</span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Base: <span className="font-mono text-neutral-400">{proposal.basePromptId}</span>
                      {basePrompt && <span className="ml-1">(v{basePrompt.version})</span>}
                    </p>
                  </div>
                  {proposal.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(proposal.id)}
                        disabled={loading === proposal.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-emerald-900/20 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/30 transition-colors disabled:opacity-60"
                      >
                        <Check size={11} />Approve
                      </button>
                      <button
                        onClick={() => handleReject(proposal.id)}
                        disabled={loading === proposal.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-rose-900/20 text-rose-400 border border-rose-800/40 hover:bg-rose-900/30 transition-colors disabled:opacity-60"
                      >
                        <X size={11} />Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Reasoning */}
                <p className="text-sm text-neutral-400 leading-relaxed mb-4">{proposal.reasoning}</p>

                {/* Gold set comparison */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-neutral-500 mb-2">Gold Set Score Impact</p>
                  <div className="grid grid-cols-3 gap-2">
                    {proposal.goldSetComparison.map(comp => {
                      const delta = comp.newMedian - comp.oldMedian;
                      return (
                        <div key={comp.dimension} className="flex items-center justify-between p-2 rounded bg-white/3 border border-white/5">
                          <span className="text-xs text-neutral-500">{DIM_LABELS[comp.dimension] || comp.dimension}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-neutral-400">{comp.oldMedian.toFixed(1)}</span>
                            <span className="text-neutral-600">→</span>
                            <span className="text-xs text-neutral-200">{comp.newMedian.toFixed(1)}</span>
                            {delta > 0.05 ? <TrendingUp size={11} className="text-emerald-400" /> :
                             delta < -0.05 ? <TrendingDown size={11} className="text-rose-400" /> :
                             <Minus size={11} className="text-neutral-600" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Diff toggle */}
                <button
                  onClick={() => setExpandedDiff(isDiffExpanded ? null : proposal.id)}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {isDiffExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  View proposed prompt body
                </button>
              </div>

              {/* Diff */}
              {isDiffExpanded && (
                <div className="border-t border-white/8">
                  <div className="grid grid-cols-2 divide-x divide-white/8">
                    <div className="p-4">
                      <p className="text-xs text-neutral-500 mb-2 font-medium">Current ({proposal.basePromptId})</p>
                      <pre className="text-xs text-neutral-400 font-mono leading-relaxed whitespace-pre-wrap max-h-64 overflow-auto">
                        {basePrompt?.body || "Prompt not found"}
                      </pre>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-neutral-500 mb-2 font-medium">Proposed</p>
                      <pre className="text-xs text-neutral-300 font-mono leading-relaxed whitespace-pre-wrap max-h-64 overflow-auto">
                        {proposal.proposedBody}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
