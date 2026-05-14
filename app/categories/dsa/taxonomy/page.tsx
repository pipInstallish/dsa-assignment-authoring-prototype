"use client";

import { useState } from "react";
import { DSA_CONCEPTS, DSA_CONCEPT_PROPOSALS } from "@/lib/seed/dsa";
import { ConceptBadge } from "@/components/domain/ConceptBadge";
import { ChevronRight, ChevronDown, Plus, Check, X, Edit3 } from "lucide-react";
import type { Concept } from "@/lib/types";
import { getUserConceptProposals } from "@/lib/storage/local";
import { toast } from "sonner";

function buildTree(concepts: Concept[]) {
  const roots: Concept[] = [];
  const childrenMap: Record<string, Concept[]> = {};

  concepts.forEach(c => {
    if (c.parentId === null) {
      roots.push(c);
    } else {
      if (!childrenMap[c.parentId]) childrenMap[c.parentId] = [];
      childrenMap[c.parentId].push(c);
    }
  });

  return { roots, childrenMap };
}

function ConceptNode({
  concept,
  children,
  depth,
  onSelect,
  selected,
}: {
  concept: Concept;
  children: Concept[];
  depth: number;
  onSelect: (c: Concept) => void;
  selected: Concept | null;
}) {
  const [expanded, setExpanded] = useState(depth === 0);
  const isSelected = selected?.id === concept.id;

  return (
    <div>
      <button
        onClick={() => { onSelect(concept); if (children.length) setExpanded(!expanded); }}
        className={`flex items-center gap-2 w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
          isSelected ? "bg-indigo-900/30 text-indigo-300" : "hover:bg-white/5 text-neutral-300"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {children.length > 0 ? (
          expanded ? <ChevronDown size={13} className="shrink-0 text-neutral-500" /> : <ChevronRight size={13} className="shrink-0 text-neutral-500" />
        ) : (
          <span className="w-[13px] shrink-0" />
        )}
        <span>{concept.canonicalName}</span>
        {concept.status === "deprecated" && (
          <span className="text-xs text-neutral-600 bg-neutral-800 rounded px-1">deprecated</span>
        )}
      </button>
      {expanded && children.map(child => (
        <ChildNode key={child.id} concept={child} depth={depth + 1} onSelect={onSelect} selected={selected} />
      ))}
    </div>
  );
}

function ChildNode({ concept, depth, onSelect, selected }: { concept: Concept; depth: number; onSelect: (c: Concept) => void; selected: Concept | null }) {
  const { childrenMap } = buildTree(DSA_CONCEPTS);
  return (
    <ConceptNode
      concept={concept}
      children={childrenMap[concept.id] || []}
      depth={depth}
      onSelect={onSelect}
      selected={selected}
    />
  );
}

export default function TaxonomyPage() {
  const [selected, setSelected] = useState<Concept | null>(null);
  const [tab, setTab] = useState<"tree" | "proposals">("tree");
  const [showPropose, setShowPropose] = useState(false);
  const [proposalName, setProposalName] = useState("");
  const [proposalDef, setProposalDef] = useState("");
  const [proposalRationale, setProposalRationale] = useState("");

  const { roots, childrenMap } = buildTree(DSA_CONCEPTS);
  const userProposals = getUserConceptProposals();
  const allProposals = [...DSA_CONCEPT_PROPOSALS, ...userProposals];

  function handlePropose() {
    if (!proposalName.trim()) return;
    toast.success(`Concept "${proposalName}" proposed`);
    setShowPropose(false);
    setProposalName(""); setProposalDef(""); setProposalRationale("");
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
            <span>/</span>
            <span className="text-neutral-300">Taxonomy</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100">Concept Taxonomy</h1>
          <p className="text-sm text-neutral-400 mt-1">{DSA_CONCEPTS.length} concepts · version 1</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="flex rounded-md border border-white/10 overflow-hidden">
            {(["tree", "proposals"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs capitalize transition-colors ${tab === t ? "bg-white/10 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"}`}
              >
                {t === "proposals" ? `Proposals (${allProposals.filter(p => p.status === "pending").length})` : "Tree"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowPropose(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition-colors"
          >
            <Plus size={13} />
            Propose Concept
          </button>
        </div>
      </div>

      {tab === "tree" ? (
        <div className="grid grid-cols-[280px_1fr] gap-4">
          {/* Tree panel */}
          <div className="rounded-lg border border-white/8 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="p-3 border-b border-white/8">
              <p className="text-xs font-medium text-neutral-500">CONCEPTS ({DSA_CONCEPTS.length})</p>
            </div>
            <div className="p-2">
              {roots.map(concept => (
                <ConceptNode
                  key={concept.id}
                  concept={concept}
                  children={childrenMap[concept.id] || []}
                  depth={0}
                  onSelect={setSelected}
                  selected={selected}
                />
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="rounded-lg border border-white/8 p-5">
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-100">{selected.canonicalName}</h2>
                    <p className="text-xs font-mono text-neutral-500 mt-0.5">{selected.id}</p>
                  </div>
                  <ConceptBadge conceptId={selected.id} label={selected.canonicalName} size="sm" />
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed">{selected.definition}</p>

                {selected.aliases.length > 0 && (
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Aliases</p>
                    <div className="flex flex-wrap gap-1">
                      {selected.aliases.map(a => (
                        <span key={a} className="text-xs bg-neutral-800 text-neutral-400 rounded px-2 py-0.5">{a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selected.parentId && (
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Parent concept</p>
                    <ConceptBadge conceptId={selected.parentId} size="sm" />
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-neutral-500 mb-2">Depth Criteria</p>
                  <div className="space-y-2">
                    {(["introduced", "applied", "mastered"] as const).map(depth => (
                      <div key={depth} className="flex gap-3">
                        <span className={`text-xs font-medium w-20 shrink-0 ${
                          depth === "introduced" ? "text-yellow-400" :
                          depth === "applied" ? "text-blue-400" :
                          "text-emerald-400"
                        }`}>{depth}</span>
                        <p className="text-xs text-neutral-400">{selected.depthCriteria[depth]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-neutral-500 pt-2 border-t border-white/5">
                  <span>Status: <span className={selected.status === "active" ? "text-emerald-400" : "text-rose-400"}>{selected.status}</span></span>
                  <span>Taxonomy v{selected.taxonomyVersion}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-neutral-600">
                <p className="text-sm">Select a concept to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {allProposals.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-sm">No concept proposals</div>
          ) : (
            allProposals.map(proposal => (
              <div key={proposal.id} className="p-4 rounded-lg border border-white/8">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-neutral-200">{proposal.proposed.canonicalName || "Unnamed concept"}</p>
                    <p className="text-xs text-neutral-500">Proposed by {proposal.proposedBy}</p>
                  </div>
                  <span className={`text-xs rounded px-2 py-0.5 ${
                    proposal.status === "pending" ? "bg-amber-900/20 text-amber-400 border border-amber-800/40" :
                    proposal.status === "approved" ? "bg-emerald-900/20 text-emerald-400 border border-emerald-800/40" :
                    "bg-rose-900/20 text-rose-400 border border-rose-800/40"
                  }`}>
                    {proposal.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mb-3">{proposal.rationale}</p>
                {proposal.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => toast.success("Proposal approved")} className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-emerald-900/20 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/30 transition-colors">
                      <Check size={11} />Approve
                    </button>
                    <button onClick={() => toast.info("Proposal rejected")} className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-rose-900/20 text-rose-400 border border-rose-800/40 hover:bg-rose-900/30 transition-colors">
                      <X size={11} />Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Propose modal */}
      {showPropose && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-lg p-5 w-full max-w-md">
            <h3 className="text-base font-semibold text-neutral-100 mb-4">Propose New Concept</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Canonical Name</label>
                <input value={proposalName} onChange={e => setProposalName(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60" placeholder="e.g. Segment Tree" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Definition</label>
                <textarea value={proposalDef} onChange={e => setProposalDef(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 h-20 resize-none" placeholder="1-2 sentence definition..." />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Rationale</label>
                <textarea value={proposalRationale} onChange={e => setProposalRationale(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 h-20 resize-none" placeholder="Why should this be added?" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handlePropose} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded py-2 text-sm transition-colors">Submit Proposal</button>
              <button onClick={() => setShowPropose(false)} className="px-4 border border-white/10 text-neutral-400 rounded py-2 text-sm hover:text-neutral-200 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
