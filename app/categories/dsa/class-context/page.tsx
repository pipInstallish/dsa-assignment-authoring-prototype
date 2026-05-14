"use client";

import { useState } from "react";
import Link from "next/link";
import { DSA_CLASS_CONTEXTS, DSA_CONCEPTS } from "@/lib/seed/dsa";
import { ConceptBadge } from "@/components/domain/ConceptBadge";
import { Plus, FolderOpen, ChevronRight } from "lucide-react";
import { getUserClassContexts } from "@/lib/storage/local";

const DEPTH_COLORS = {
  introduced: "text-yellow-400",
  applied: "text-blue-400",
  mastered: "text-emerald-400",
};

export default function ClassContextPage() {
  const userContexts = getUserClassContexts();
  const allContexts = [...DSA_CLASS_CONTEXTS, ...userContexts];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
            <span>/</span>
            <span className="text-neutral-300">Class Contexts</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100">Class Contexts</h1>
          <p className="text-sm text-neutral-400 mt-1">{allContexts.length} curriculum modules · concept extraction via LLM</p>
        </div>
        <Link
          href="/categories/dsa/class-context/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition-colors"
        >
          <Plus size={13} />
          Upload Module
        </Link>
      </div>

      <div className="space-y-3">
        {allContexts.map(ctx => {
          const confirmedConcepts = ctx.extractedConcepts.filter(c => c.confirmedByInstructor);
          const pendingConcepts = ctx.extractedConcepts.filter(c => !c.confirmedByInstructor);

          return (
            <Link
              key={ctx.id}
              href={`/categories/dsa/class-context/${ctx.id}`}
              className="block p-5 rounded-lg border border-white/8 hover:border-white/20 bg-white/2 hover:bg-white/3 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                    <FolderOpen size={16} className="text-neutral-400" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-100">{ctx.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 font-mono">{ctx.moduleId}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-600 group-hover:text-neutral-400 transition-colors mt-1" />
              </div>

              <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                <span>{ctx.uploadedFiles.length} file{ctx.uploadedFiles.length !== 1 ? "s" : ""}</span>
                <span className="text-neutral-700">·</span>
                <span>{confirmedConcepts.length} confirmed</span>
                {pendingConcepts.length > 0 && (
                  <>
                    <span className="text-neutral-700">·</span>
                    <span className="text-amber-400">{pendingConcepts.length} pending review</span>
                  </>
                )}
                <span className="text-neutral-700">·</span>
                <span>{ctx.createdAt.slice(0, 10)}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {ctx.extractedConcepts.slice(0, 8).map(ec => {
                  const concept = DSA_CONCEPTS.find(c => c.id === ec.conceptId);
                  return (
                    <div key={ec.conceptId} className="flex items-center gap-1">
                      <ConceptBadge conceptId={ec.conceptId} label={concept?.canonicalName} size="xs" />
                      <span className={`text-xs ${DEPTH_COLORS[ec.depth]}`}>{ec.depth[0].toUpperCase()}</span>
                    </div>
                  );
                })}
                {ctx.extractedConcepts.length > 8 && (
                  <span className="text-xs text-neutral-600">+{ctx.extractedConcepts.length - 8} more</span>
                )}
              </div>
            </Link>
          );
        })}

        {allContexts.length === 0 && (
          <div className="py-16 text-center">
            <FolderOpen size={32} className="text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No class contexts yet</p>
            <Link href="/categories/dsa/class-context/new" className="text-indigo-400 text-xs mt-2 inline-block hover:text-indigo-300">
              Upload your first module
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
