"use client";

import Link from "next/link";
import { DSA_GOLD_SET, DSA_CONCEPTS } from "@/lib/seed/dsa";
import { getUserGoldSetEntries } from "@/lib/storage/local";
import { ConceptBadge } from "@/components/domain/ConceptBadge";
import { BookMarked, Plus, Star } from "lucide-react";

const STATUS_STYLES = {
  canonical: "text-emerald-400 bg-emerald-900/20 border-emerald-800/40",
  candidate: "text-amber-400 bg-amber-900/20 border-amber-800/40",
  deprecated: "text-neutral-500 bg-neutral-800 border-neutral-700",
};

export default function GoldSetPage() {
  const userEntries = getUserGoldSetEntries();
  const allEntries = [...DSA_GOLD_SET, ...userEntries];
  const canonicalCount = allEntries.filter(e => e.status === "canonical").length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
            <span>/</span>
            <span className="text-neutral-300">Gold Set</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100">Gold Set</h1>
          <p className="text-sm text-neutral-400 mt-1">{allEntries.length} entries · {canonicalCount} canonical · used for eval threshold calibration</p>
        </div>
        <Link
          href="/categories/dsa/gold-set/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition-colors"
        >
          <Plus size={13} />
          Author Entry
        </Link>
      </div>

      <div className="rounded-lg border border-white/8 overflow-hidden">
        <div className="grid grid-cols-[1fr_160px_100px_120px] text-xs text-neutral-500 border-b border-white/8 bg-white/2">
          <div className="px-4 py-2.5">Problem</div>
          <div className="px-4 py-2.5">Concepts</div>
          <div className="px-4 py-2.5">Ratings</div>
          <div className="px-4 py-2.5">Status</div>
        </div>
        <div className="divide-y divide-white/5">
          {allEntries.map(entry => {
            const avgRating = entry.humanRatings.length > 0
              ? Object.values(entry.humanRatings[0].perDimension).reduce((a, b) => a + b, 0) /
                Object.values(entry.humanRatings[0].perDimension).length
              : null;

            return (
              <Link
                key={entry.id}
                href={`/categories/dsa/gold-set/${entry.id}`}
                className="grid grid-cols-[1fr_160px_100px_120px] hover:bg-white/3 transition-colors"
              >
                <div className="px-4 py-3">
                  <p className="text-sm text-neutral-200">{entry.output.problem.title}</p>
                  <p className="text-xs text-neutral-600 mt-0.5 font-mono">{entry.id}</p>
                </div>
                <div className="px-4 py-3 flex items-center flex-wrap gap-1">
                  {entry.output.metadata.conceptsRequired.slice(0, 2).map(cid => (
                    <ConceptBadge key={cid} conceptId={cid} size="xs" />
                  ))}
                  {entry.output.metadata.conceptsRequired.length > 2 && (
                    <span className="text-xs text-neutral-600">+{entry.output.metadata.conceptsRequired.length - 2}</span>
                  )}
                </div>
                <div className="px-4 py-3 flex items-center gap-1">
                  {avgRating !== null ? (
                    <>
                      <Star size={12} className="text-amber-400" fill="currentColor" />
                      <span className="text-xs text-neutral-300">{avgRating.toFixed(1)}</span>
                    </>
                  ) : (
                    <span className="text-xs text-neutral-600">—</span>
                  )}
                </div>
                <div className="px-4 py-3 flex items-center">
                  <span className={`text-xs border rounded px-1.5 py-0.5 ${STATUS_STYLES[entry.status]}`}>{entry.status}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
