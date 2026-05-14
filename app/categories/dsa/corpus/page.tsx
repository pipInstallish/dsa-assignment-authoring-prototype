"use client";

import { useState } from "react";
import { DSA_CORPUS, DSA_CONCEPTS } from "@/lib/seed/dsa";
import { ConceptBadge } from "@/components/domain/ConceptBadge";
import { Search, Plus, X, ChevronRight } from "lucide-react";
import type { InterviewQuestion } from "@/lib/types";

const DIFFICULTY_COLORS = {
  easy: "text-emerald-400 bg-emerald-900/20 border-emerald-800/40",
  medium: "text-amber-400 bg-amber-900/20 border-amber-800/40",
  hard: "text-rose-400 bg-rose-900/20 border-rose-800/40",
};

export default function CorpusPage() {
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<"" | "easy" | "medium" | "hard">("");
  const [conceptFilter, setConceptFilter] = useState("");
  const [selected, setSelected] = useState<InterviewQuestion | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addSource, setAddSource] = useState("");
  const [addDiff, setAddDiff] = useState<"easy" | "medium" | "hard">("medium");

  const filtered = DSA_CORPUS.filter(q => {
    const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.body.toLowerCase().includes(search.toLowerCase());
    const matchDiff = !diffFilter || q.difficulty === diffFilter;
    const matchConcept = !conceptFilter || q.taggedConcepts.includes(conceptFilter);
    return matchSearch && matchDiff && matchConcept;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
            <span>/</span>
            <span className="text-neutral-300">Corpus</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100">Interview Corpus</h1>
          <p className="text-sm text-neutral-400 mt-1">{DSA_CORPUS.length} reference questions · used for leakage detection</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition-colors"
        >
          <Plus size={13} />
          Add Question
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full bg-neutral-800/60 border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 placeholder:text-neutral-600"
          />
        </div>
        <div className="flex rounded-md border border-white/10 overflow-hidden">
          {(["", "easy", "medium", "hard"] as const).map(d => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`px-3 py-1.5 text-xs capitalize transition-colors ${diffFilter === d ? "bg-white/10 text-neutral-100" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              {d || "All"}
            </button>
          ))}
        </div>
        <select
          value={conceptFilter}
          onChange={e => setConceptFilter(e.target.value)}
          className="bg-neutral-800/60 border border-white/10 rounded-md px-3 py-2 text-xs text-neutral-300 outline-none focus:border-indigo-500/60"
        >
          <option value="">All concepts</option>
          {DSA_CONCEPTS.map(c => (
            <option key={c.id} value={c.id}>{c.canonicalName}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-4">
        {/* Table */}
        <div className="rounded-lg border border-white/8 overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_120px_100px] text-xs text-neutral-500 border-b border-white/8 bg-white/2">
            <div className="px-4 py-2.5">Question</div>
            <div className="px-4 py-2.5">Source</div>
            <div className="px-4 py-2.5">Concepts</div>
            <div className="px-4 py-2.5">Difficulty</div>
          </div>
          <div className="divide-y divide-white/5">
            {filtered.map(q => (
              <button
                key={q.id}
                onClick={() => setSelected(q)}
                className={`grid grid-cols-[1fr_100px_120px_100px] w-full text-left transition-colors ${selected?.id === q.id ? "bg-indigo-900/20" : "hover:bg-white/3"}`}
              >
                <div className="px-4 py-3">
                  <p className="text-sm text-neutral-200 truncate">{q.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5 truncate">{q.body.slice(0, 60)}…</p>
                </div>
                <div className="px-4 py-3 flex items-center">
                  <span className="text-xs text-neutral-500">{q.source}</span>
                </div>
                <div className="px-4 py-3 flex items-center flex-wrap gap-1">
                  {q.taggedConcepts.slice(0, 2).map(cid => (
                    <ConceptBadge key={cid} conceptId={cid} size="xs" />
                  ))}
                  {q.taggedConcepts.length > 2 && (
                    <span className="text-xs text-neutral-600">+{q.taggedConcepts.length - 2}</span>
                  )}
                </div>
                <div className="px-4 py-3 flex items-center">
                  <span className={`text-xs border rounded px-1.5 py-0.5 ${DIFFICULTY_COLORS[q.difficulty]}`}>{q.difficulty}</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-neutral-500 text-sm">No questions match filters</div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="rounded-lg border border-white/8 p-4 h-fit sticky top-4">
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-neutral-100 leading-snug">{selected.title}</h3>
                <button onClick={() => setSelected(null)} className="text-neutral-600 hover:text-neutral-400">
                  <X size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs border rounded px-1.5 py-0.5 ${DIFFICULTY_COLORS[selected.difficulty]}`}>{selected.difficulty}</span>
                <span className="text-xs text-neutral-500">{selected.source}</span>
                <span className="text-xs text-neutral-600">{selected.addedAt.slice(0, 10)}</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">{selected.body}</p>
              <div>
                <p className="text-xs text-neutral-500 mb-1.5">Tagged Concepts</p>
                <div className="flex flex-wrap gap-1">
                  {selected.taggedConcepts.map(cid => (
                    <ConceptBadge key={cid} conceptId={cid} size="xs" />
                  ))}
                </div>
              </div>
              <div className="text-xs text-neutral-600 font-mono pt-2 border-t border-white/5">{selected.id}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-600">
              <ChevronRight size={20} className="mb-2 opacity-40" />
              <p className="text-sm">Select a question to view</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Question Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-lg p-5 w-full max-w-md">
            <h3 className="text-base font-semibold text-neutral-100 mb-4">Add Corpus Question</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Title</label>
                <input value={addTitle} onChange={e => setAddTitle(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60" placeholder="e.g. Two Sum" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Source</label>
                <input value={addSource} onChange={e => setAddSource(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60" placeholder="e.g. LeetCode" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1 block">Difficulty</label>
                <div className="flex gap-2">
                  {(["easy", "medium", "hard"] as const).map(d => (
                    <button key={d} onClick={() => setAddDiff(d)} className={`flex-1 py-1.5 rounded text-xs capitalize border transition-colors ${addDiff === d ? "border-indigo-500 bg-indigo-900/20 text-indigo-300" : "border-white/10 text-neutral-500 hover:text-neutral-300"}`}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded py-2 text-sm transition-colors">Add Question</button>
              <button onClick={() => setShowAdd(false)} className="px-4 border border-white/10 text-neutral-400 rounded py-2 text-sm hover:text-neutral-200 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
