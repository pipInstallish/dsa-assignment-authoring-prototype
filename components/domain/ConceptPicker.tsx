"use client";

import { useState } from "react";
import { Search, Plus, X, Check } from "lucide-react";
import { DSA_CONCEPTS } from "@/lib/seed/dsa";
import { ConceptBadge } from "./ConceptBadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { addUserConceptProposal } from "@/lib/storage/local";

interface ConceptPickerProps {
  selected: string[];
  onChange: (ids: string[]) => void;
  label: string;
  color?: "indigo" | "violet" | "rose";
  placeholder?: string;
  maxItems?: number;
  onProposeConcept?: (name: string) => void;
}

export function ConceptPicker({
  selected,
  onChange,
  label,
  color = "indigo",
  placeholder = "Search concepts...",
  maxItems,
  onProposeConcept,
}: ConceptPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [proposeMode, setProposeMode] = useState(false);
  const [proposalName, setProposalName] = useState("");
  const [proposalRationale, setProposalRationale] = useState("");

  const allConcepts = DSA_CONCEPTS.filter(c => c.status === "active");

  const filtered = allConcepts.filter(c => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.canonicalName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.aliases.some(a => a.toLowerCase().includes(q))
    );
  });

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else {
      if (maxItems && selected.length >= maxItems) return;
      onChange([...selected, id]);
    }
  }

  function handlePropose() {
    if (!proposalName.trim()) return;
    const id = `proposal-${Date.now()}`;
    const proposal = {
      id,
      proposedBy: "Sarah Chen",
      categoryId: "dsa" as const,
      proposed: {
        id: proposalName.toLowerCase().replace(/\s+/g, "_"),
        canonicalName: proposalName,
        categoryId: "dsa" as const,
        aliases: [],
        definition: proposalRationale,
        parentId: null,
        depthCriteria: { introduced: "", applied: "", mastered: "" },
        status: "active" as const,
        taxonomyVersion: 1
      },
      rationale: proposalRationale,
      status: "pending" as const,
    };
    addUserConceptProposal(proposal);
    setProposeMode(false);
    setProposalName("");
    setProposalRationale("");
    toast.success(`Concept "${proposalName}" proposed`, {
      description: "Auto-approving in 5 seconds...",
    });
    // Auto-approve after 5 seconds
    setTimeout(() => {
      toast.success(`Concept "${proposalName}" approved!`, {
        description: "The concept has been added to the taxonomy.",
      });
    }, 5000);
  }

  const borderColor = {
    indigo: "border-indigo-500/30 focus-within:border-indigo-500/60",
    violet: "border-violet-500/30 focus-within:border-violet-500/60",
    rose: "border-rose-500/30 focus-within:border-rose-500/60",
  }[color];

  return (
    <div>
      <label className="block text-xs font-medium text-neutral-400 mb-1.5">{label}</label>

      {/* Selected badges */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map(id => {
            const concept = allConcepts.find(c => c.id === id);
            return (
              <ConceptBadge
                key={id}
                conceptId={id}
                label={concept?.canonicalName}
                size="sm"
                onRemove={() => toggle(id)}
              />
            );
          })}
        </div>
      )}

      {/* Dropdown trigger */}
      <div className="relative">
        <div
          className={cn(
            "flex items-center gap-2 rounded-md border bg-neutral-900 px-3 py-2 text-sm cursor-text",
            borderColor
          )}
          onClick={() => setOpen(true)}
        >
          <Search size={14} className="text-neutral-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm text-neutral-200 placeholder:text-neutral-600"
          />
        </div>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute z-20 top-full mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-white/10 bg-neutral-900 shadow-xl">
              {filtered.length === 0 ? (
                <div className="px-3 py-4 text-sm text-neutral-500 text-center">
                  No concepts found
                </div>
              ) : (
                filtered.map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => { toggle(concept.id); setQuery(""); }}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-white/5 transition-colors text-left"
                  >
                    <div>
                      <span className="text-neutral-200">{concept.canonicalName}</span>
                      {concept.parentId && (
                        <span className="ml-2 text-xs text-neutral-500">
                          {concept.parentId.replace(/_/g, " ")}
                        </span>
                      )}
                    </div>
                    {selected.includes(concept.id) && (
                      <Check size={13} className="text-indigo-400 shrink-0" />
                    )}
                  </button>
                ))
              )}

              {/* Propose new concept */}
              <div className="border-t border-white/8">
                {proposeMode ? (
                  <div className="p-3 space-y-2">
                    <p className="text-xs font-medium text-neutral-400">Propose new concept</p>
                    <input
                      type="text"
                      value={proposalName}
                      onChange={e => setProposalName(e.target.value)}
                      placeholder="Concept name (e.g. Segment Tree)"
                      className="w-full bg-neutral-800 border border-white/10 rounded px-2 py-1.5 text-sm text-neutral-200 outline-none"
                    />
                    <input
                      type="text"
                      value={proposalRationale}
                      onChange={e => setProposalRationale(e.target.value)}
                      placeholder="Brief rationale..."
                      className="w-full bg-neutral-800 border border-white/10 rounded px-2 py-1.5 text-sm text-neutral-200 outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handlePropose}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded px-2 py-1.5 transition-colors"
                      >
                        Submit Proposal
                      </button>
                      <button
                        onClick={() => setProposeMode(false)}
                        className="text-xs text-neutral-500 hover:text-neutral-300 px-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setProposeMode(true)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-white/5 transition-colors"
                  >
                    <Plus size={13} />
                    Propose new concept
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
