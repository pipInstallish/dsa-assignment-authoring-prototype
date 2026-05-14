"use client";

import { useState } from "react";
import Link from "next/link";
import { DSA_PROMPTS, DSA_PROMPT_PROPOSALS } from "@/lib/seed/dsa";
import { getPromptProposalStatuses } from "@/lib/storage/local";
import { AlertCircle, ChevronDown, ChevronRight } from "lucide-react";

const PROMPT_TYPE_LABELS: Record<string, string> = {
  generation: "Generation",
  concept_extraction: "Concept Extraction",
  eval_judge: "Eval Judge",
  difficulty_assessor: "Difficulty Assessor",
};

export default function PromptsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const proposalStatuses = getPromptProposalStatuses();
  const pendingCount = DSA_PROMPT_PROPOSALS.filter(p => (proposalStatuses[p.id] || p.status) === "pending").length;

  // Group by promptType
  const grouped: Record<string, typeof DSA_PROMPTS> = {};
  DSA_PROMPTS.forEach(p => {
    if (!grouped[p.promptType]) grouped[p.promptType] = [];
    grouped[p.promptType].push(p);
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
            <span>/</span>
            <span className="text-neutral-300">Prompts</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100">Prompt Management</h1>
          <p className="text-sm text-neutral-400 mt-1">{DSA_PROMPTS.length} prompt versions · {DSA_PROMPTS.filter(p => p.active).length} active</p>
        </div>
        {pendingCount > 0 && (
          <Link
            href="/categories/dsa/prompts/proposals"
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-amber-800/50 bg-amber-900/10 text-amber-400 text-xs hover:bg-amber-900/20 transition-colors"
          >
            <AlertCircle size={13} />
            {pendingCount} pending proposal{pendingCount !== 1 ? "s" : ""}
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([type, prompts]) => (
          <div key={type} className="rounded-lg border border-white/8 overflow-hidden">
            <div className="px-4 py-3 bg-white/2 border-b border-white/8">
              <p className="text-xs font-medium text-neutral-300">{PROMPT_TYPE_LABELS[type] || type}</p>
            </div>
            <div className="divide-y divide-white/5">
              {prompts.map(prompt => (
                <div key={prompt.id}>
                  <button
                    onClick={() => setExpandedId(expandedId === prompt.id ? null : prompt.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors text-left"
                  >
                    {expandedId === prompt.id ? <ChevronDown size={13} className="text-neutral-500 shrink-0" /> : <ChevronRight size={13} className="text-neutral-500 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-200 font-medium font-mono">{prompt.id}</span>
                        {prompt.active && <span className="text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-800/40 rounded px-1.5 py-0.5">active</span>}
                        {prompt.dimension && <span className="text-xs text-neutral-500">· {prompt.dimension}</span>}
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">v{prompt.version} · by {prompt.createdBy} · {prompt.createdAt.slice(0, 10)}</p>
                    </div>
                    <span className="text-xs text-neutral-600">{prompt.body.split("\n").length} lines</span>
                  </button>
                  {expandedId === prompt.id && (
                    <div className="mx-4 mb-3 rounded-md bg-neutral-950 border border-white/8 overflow-auto max-h-80">
                      <pre className="text-xs text-neutral-300 font-mono p-4 leading-relaxed whitespace-pre-wrap">{prompt.body}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
