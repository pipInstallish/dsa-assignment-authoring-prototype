"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAssignmentSections } from "@/lib/storage/local";
import { DSA_CLASS_CONTEXTS } from "@/lib/seed/dsa";
import type { AssignmentSection } from "@/lib/types";
import { Archive, Plus, Clock, CheckCircle, AlertTriangle, XCircle, FileCode2 } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  drafting: "text-neutral-400 bg-neutral-800 border-neutral-700",
  awaiting_approval: "text-amber-400 bg-amber-900/20 border-amber-800/40",
  approved: "text-emerald-400 bg-emerald-900/20 border-emerald-800/40",
  rejected: "text-rose-400 bg-rose-900/20 border-rose-800/40",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  drafting: <Clock size={11} />,
  awaiting_approval: <AlertTriangle size={11} />,
  approved: <CheckCircle size={11} />,
  rejected: <XCircle size={11} />,
};

const TYPE_LABELS: Record<string, string> = {
  assignment: "Assignment Section",
  homework: "Homework Section",
};

const TYPE_STYLES: Record<string, string> = {
  assignment: "text-indigo-300 bg-indigo-900/20 border-indigo-800/40",
  homework: "text-sky-300 bg-sky-900/20 border-sky-800/40",
};

export default function SectionsPage() {
  const [sections, setSections] = useState<AssignmentSection[]>([]);

  useEffect(() => {
    setSections(getAssignmentSections());
  }, []);

  const awaiting = sections.filter(s => s.status === "awaiting_approval").length;
  const approved = sections.filter(s => s.status === "approved").length;
  const drafting = sections.filter(s => s.status === "drafting").length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <Link href="/categories/dsa" className="hover:text-neutral-300">DSA</Link>
            <span>/</span>
            <span className="text-neutral-300">Sections</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100">Sections</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Grouped problem sets bound to a class context. {sections.length} total · {drafting} drafting · {awaiting} awaiting approval · {approved} approved.
          </p>
        </div>
        <Link
          href="/categories/dsa/generate"
          className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition-colors shrink-0"
        >
          <Plus size={13} />
          New Section
        </Link>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/10 bg-white/2 p-12 text-center">
          <Archive size={28} className="mx-auto text-neutral-600 mb-3" />
          <p className="text-sm text-neutral-300 mb-1">No sections yet</p>
          <p className="text-xs text-neutral-500 mb-4">Create a section to group multiple problems for a single class and send them for approval as one bundle.</p>
          <Link
            href="/categories/dsa/generate"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition-colors"
          >
            <Plus size={11} />
            Create First Section
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-white/8 overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_180px_90px_150px_120px] text-xs text-neutral-500 border-b border-white/8 bg-white/2">
            <div className="px-4 py-2.5">Section</div>
            <div className="px-4 py-2.5">Type</div>
            <div className="px-4 py-2.5">Class Context</div>
            <div className="px-4 py-2.5">Problems</div>
            <div className="px-4 py-2.5">Created</div>
            <div className="px-4 py-2.5">Status</div>
          </div>
          <div className="divide-y divide-white/5">
            {sections.map(s => {
              const ctx = DSA_CLASS_CONTEXTS.find(c => c.id === s.classContextId);
              return (
                <div key={s.id} className="grid grid-cols-[1fr_140px_180px_90px_150px_120px] hover:bg-white/3 transition-colors">
                  <div className="px-4 py-3">
                    <p className="text-sm text-neutral-200">{s.name}</p>
                    <p className="text-xs text-neutral-600 mt-0.5 font-mono">{s.id}</p>
                  </div>
                  <div className="px-4 py-3 flex items-center">
                    <span className={`text-[10px] border rounded px-1.5 py-0.5 ${TYPE_STYLES[s.type]}`}>
                      {TYPE_LABELS[s.type]}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center text-xs text-neutral-300">
                    {ctx?.title || s.classContextId}
                  </div>
                  <div className="px-4 py-3 flex items-center gap-1 text-xs text-neutral-300">
                    <FileCode2 size={11} className="text-neutral-500" />
                    {s.problems.length}
                  </div>
                  <div className="px-4 py-3 flex items-center text-xs text-neutral-500">{s.createdAt}</div>
                  <div className="px-4 py-3 flex items-center">
                    <span className={`text-[10px] border rounded px-1.5 py-0.5 flex items-center gap-1 ${STATUS_STYLES[s.status]}`}>
                      {STATUS_ICONS[s.status]}
                      {s.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-[11px] text-neutral-600 mt-3 flex items-center gap-1.5">
        <Archive size={11} />
        Sections move from <span className="text-neutral-400">drafting</span> → <span className="text-amber-400">awaiting approval</span> when you click Finalise. Shivank reviews the section as one bundle.
      </p>
    </div>
  );
}
