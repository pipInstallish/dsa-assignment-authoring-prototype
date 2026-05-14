"use client";

import { useParams } from "next/navigation";
import { DSA_CLASS_CONTEXTS, DSA_CONCEPTS } from "@/lib/seed/dsa";
import { getUserClassContexts } from "@/lib/storage/local";
import { ConceptBadge } from "@/components/domain/ConceptBadge";
import { FolderOpen, FileText } from "lucide-react";

const DEPTH_COLORS = {
  introduced: "text-yellow-400 bg-yellow-900/10 border-yellow-800/40",
  applied: "text-blue-400 bg-blue-900/10 border-blue-800/40",
  mastered: "text-emerald-400 bg-emerald-900/10 border-emerald-800/40",
};

export default function ClassContextDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userContexts = getUserClassContexts();
  const ctx = [...DSA_CLASS_CONTEXTS, ...userContexts].find(c => c.id === id);

  if (!ctx) return (
    <div className="p-8 text-center text-neutral-500">
      <p>Class context not found</p>
      <a href="/categories/dsa/class-context" className="text-indigo-400 text-sm mt-2 inline-block">← Back</a>
    </div>
  );

  const confirmed = ctx.extractedConcepts.filter(e => e.confirmedByInstructor);
  const pending = ctx.extractedConcepts.filter(e => !e.confirmedByInstructor);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
          <span>/</span>
          <a href="/categories/dsa/class-context" className="hover:text-neutral-300">Class Contexts</a>
          <span>/</span>
          <span className="text-neutral-300">{ctx.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center">
            <FolderOpen size={18} className="text-neutral-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-neutral-100">{ctx.title}</h1>
            <p className="text-xs font-mono text-neutral-500">{ctx.moduleId}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg border border-white/8 bg-white/2">
          <p className="text-xs text-neutral-500 mb-3">Uploaded Files</p>
          <div className="space-y-2">
            {ctx.uploadedFiles.map(f => (
              <div key={f.name} className="flex items-center gap-2 text-sm">
                <FileText size={13} className="text-neutral-500" />
                <span className="text-neutral-300">{f.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-lg border border-white/8 bg-white/2">
          <p className="text-xs text-neutral-500 mb-2">Stats</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-neutral-500">Total concepts</span><span className="text-neutral-200">{ctx.extractedConcepts.length}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Confirmed</span><span className="text-emerald-400">{confirmed.length}</span></div>
            {pending.length > 0 && <div className="flex justify-between"><span className="text-neutral-500">Pending review</span><span className="text-amber-400">{pending.length}</span></div>}
            <div className="flex justify-between"><span className="text-neutral-500">Created</span><span className="text-neutral-400">{ctx.createdAt.slice(0, 10)}</span></div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/8 overflow-hidden">
        <div className="px-4 py-3 bg-white/2 border-b border-white/8">
          <p className="text-xs font-medium text-neutral-400">Extracted Concepts</p>
        </div>
        <div className="divide-y divide-white/5">
          {ctx.extractedConcepts.map(ec => {
            const concept = DSA_CONCEPTS.find(c => c.id === ec.conceptId);
            return (
              <div key={ec.conceptId} className="px-4 py-3 flex items-center gap-3">
                <ConceptBadge conceptId={ec.conceptId} label={concept?.canonicalName} size="sm" />
                <span className={`text-xs px-2 py-0.5 rounded border ${DEPTH_COLORS[ec.depth]}`}>{ec.depth}</span>
                <span className="text-xs text-neutral-600 flex-1">{concept?.definition?.slice(0, 80)}…</span>
                <span className="text-xs text-neutral-600">{Math.round(ec.confidence * 100)}% conf</span>
                <span className={`text-xs ${ec.confirmedByInstructor ? "text-emerald-400" : "text-amber-400"}`}>
                  {ec.confirmedByInstructor ? "Confirmed" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
