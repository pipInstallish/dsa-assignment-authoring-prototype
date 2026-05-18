"use client";

import { useState } from "react";
import Link from "next/link";
import { DSA_INTERVIEW_GOLD_SET } from "@/lib/seed/dsa";
import { ConceptBadge } from "@/components/domain/ConceptBadge";
import { BookMarked, Star, Upload, Download, X, FileText } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose
} from "@/components/ui/dialog";
import { toast } from "sonner";

const STATUS_STYLES: Record<string, string> = {
  canonical: "text-emerald-400 bg-emerald-900/20 border-emerald-800/40",
  candidate: "text-amber-400 bg-amber-900/20 border-amber-800/40",
};

// CSV schema for bulk upload
const CSV_HEADERS = [
  { name: "problem_id", required: true, type: "string", example: "iv_001", desc: "Unique ID — must match an existing problem in the Interview library" },
  { name: "title", required: true, type: "string", example: "Order Frequency Anomaly Detector", desc: "Problem title for display" },
  { name: "concepts", required: true, type: "pipe-separated", example: "hashmaps|frequency_counting", desc: "Concept IDs separated by | (must exist in DSA taxonomy)" },
  { name: "difficulty", required: true, type: "enum", example: "medium", desc: "One of: easy, medium, hard" },
  { name: "actual_solve_rate", required: true, type: "float (0-1)", example: "0.62", desc: "Real deployed solve rate. Required — gold set entries must have calibration data." },
  { name: "attempts", required: true, type: "int", example: "84", desc: "Number of candidate attempts the solve rate is based on (≥ 30 for canonical)" },
  { name: "signal_axes", required: true, type: "pipe-separated", example: "decomposition|edge-cases|complexity-reasoning", desc: "Rubric axes this problem strongly differentiates on" },
  { name: "status", required: false, type: "enum", example: "canonical", desc: "canonical or candidate. Defaults to candidate if blank." },
  { name: "notes", required: false, type: "string", example: "Discriminates well at the optimization step", desc: "Free-text notes for future authors" },
];

const SAMPLE_ROW = CSV_HEADERS.map(h => h.example).map(v => v.includes(",") ? `"${v}"` : v).join(",");
const HEADER_ROW = CSV_HEADERS.map(h => h.name).join(",");

function downloadTemplate() {
  const csv = HEADER_ROW + "\n" + SAMPLE_ROW + "\n";
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "interview-gold-set-template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("Template downloaded");
}

function CsvUploadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Upload size={14} className="text-violet-400" />
            <DialogTitle>Bulk add to Interview Gold Set</DialogTitle>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Upload a CSV to add multiple gold-set entries at once. Each row becomes one calibrated exemplar.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Headers reference */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-neutral-200">Expected CSV columns</p>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300"
              >
                <Download size={11} />
                Download template
              </button>
            </div>
            <div className="rounded-md border border-white/8 overflow-hidden">
              <div className="grid grid-cols-[160px_90px_110px_1fr] text-[10px] text-neutral-500 border-b border-white/8 bg-white/2 uppercase tracking-wider">
                <div className="px-3 py-2">Column</div>
                <div className="px-3 py-2">Required</div>
                <div className="px-3 py-2">Type</div>
                <div className="px-3 py-2">Description</div>
              </div>
              <div className="divide-y divide-white/5">
                {CSV_HEADERS.map(h => (
                  <div key={h.name} className="grid grid-cols-[160px_90px_110px_1fr] text-xs">
                    <div className="px-3 py-2 font-mono text-violet-300">{h.name}</div>
                    <div className="px-3 py-2">
                      {h.required ? (
                        <span className="text-rose-400">required</span>
                      ) : (
                        <span className="text-neutral-500">optional</span>
                      )}
                    </div>
                    <div className="px-3 py-2 text-neutral-400 font-mono text-[11px]">{h.type}</div>
                    <div className="px-3 py-2 text-neutral-400">
                      {h.desc}
                      <p className="text-[10px] text-neutral-600 mt-0.5 font-mono">e.g. {h.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sample row */}
          <div>
            <p className="text-sm font-medium text-neutral-200 mb-2">Sample row</p>
            <div className="rounded-md border border-white/8 bg-neutral-950/60 p-3 overflow-x-auto">
              <pre className="text-[11px] text-neutral-300 font-mono whitespace-pre">{HEADER_ROW}
{SAMPLE_ROW}</pre>
            </div>
          </div>

          {/* Upload */}
          <div>
            <p className="text-sm font-medium text-neutral-200 mb-2">Upload CSV</p>
            <label className="flex items-center justify-center gap-2 rounded-md border border-dashed border-white/15 bg-white/2 hover:border-violet-500/40 hover:bg-violet-950/10 px-4 py-6 cursor-pointer transition-colors">
              <FileText size={14} className="text-neutral-400" />
              <span className="text-sm text-neutral-300">
                {file ? file.name : "Click to choose a CSV file"}
              </span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
            </label>
            {file && (
              <p className="text-[11px] text-neutral-500 mt-1.5">
                {(file.size / 1024).toFixed(1)} KB · Click "Import" to validate and add rows.
              </p>
            )}
          </div>

          <div className="rounded-md bg-amber-950/20 border border-amber-800/30 p-3 text-[11px] text-amber-300/80">
            <p className="font-medium mb-1">Validation rules</p>
            <ul className="space-y-0.5 list-disc list-inside text-amber-400/70">
              <li>problem_id must reference an existing entry in the Interview Problems library</li>
              <li>concepts must all exist in the DSA taxonomy</li>
              <li>actual_solve_rate must be between 0 and 1</li>
              <li>For status=canonical, attempts must be ≥ 30</li>
              <li>Duplicate problem_ids are merged (latest row wins)</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
          <DialogClose className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1">
            <X size={11} />
            Cancel
          </DialogClose>
          <button
            disabled={!file}
            onClick={() => {
              toast.success(`Imported ${file?.name} — 0 rows added (prototype: parser not wired)`);
              onClose();
              setFile(null);
            }}
            className="px-4 py-1.5 rounded-md bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs transition-colors flex items-center gap-1.5"
          >
            <Upload size={11} />
            Import
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function InterviewGoldSetPage() {
  const entries = DSA_INTERVIEW_GOLD_SET;
  const canonical = entries.filter(e => e.status === "canonical").length;
  const [csvOpen, setCsvOpen] = useState(false);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <Link href="/categories/dsa" className="hover:text-neutral-300">DSA</Link>
            <span>/</span>
            <Link href="/categories/dsa/interview" className="hover:text-neutral-300">Interview</Link>
            <span>/</span>
            <span className="text-neutral-300">Gold Set</span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-100">Interview Gold Set</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {entries.length} entries · {canonical} canonical · grounds the interview generator with calibrated examples
          </p>
          <p className="text-[11px] text-neutral-600 mt-1 flex items-center gap-1.5">
            <BookMarked size={11} />
            Separate from the assignment gold set — entries here have actual deployed solve rates, not just hand-authored exemplars.
          </p>
        </div>
        <button
          onClick={() => setCsvOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white text-xs transition-colors shrink-0"
        >
          <Upload size={13} />
          Bulk Add (CSV)
        </button>
      </div>

      <div className="rounded-lg border border-white/8 overflow-hidden">
        <div className="grid grid-cols-[1fr_180px_90px_120px_120px] text-xs text-neutral-500 border-b border-white/8 bg-white/2">
          <div className="px-4 py-2.5">Problem</div>
          <div className="px-4 py-2.5">Signal Axes</div>
          <div className="px-4 py-2.5">Difficulty</div>
          <div className="px-4 py-2.5">Solve Rate</div>
          <div className="px-4 py-2.5">Status</div>
        </div>
        <div className="divide-y divide-white/5">
          {entries.map(e => (
            <div key={e.id} className="grid grid-cols-[1fr_180px_90px_120px_120px] hover:bg-white/3 transition-colors">
              <div className="px-4 py-3">
                <p className="text-sm text-neutral-200">{e.title}</p>
                <p className="text-xs text-neutral-600 mt-0.5 italic">{e.notes}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {e.concepts.slice(0, 3).map(c => (
                    <ConceptBadge key={c} conceptId={c} size="xs" />
                  ))}
                </div>
              </div>
              <div className="px-4 py-3 flex flex-wrap items-center gap-1">
                {e.signalAxes.map(a => (
                  <span key={a} className="text-[10px] text-violet-300 bg-violet-900/20 border border-violet-800/40 rounded px-1.5 py-0.5">{a}</span>
                ))}
              </div>
              <div className="px-4 py-3 flex items-center text-xs capitalize text-neutral-300">{e.difficulty}</div>
              <div className="px-4 py-3 flex items-center gap-1.5 text-xs">
                <Star size={12} className="text-violet-400" fill="currentColor" />
                <span className="text-neutral-200 font-medium">{Math.round(e.actualSolveRate * 100)}%</span>
                <span className="text-neutral-600">({e.attempts})</span>
              </div>
              <div className="px-4 py-3 flex items-center">
                <span className={`text-[10px] border rounded px-1.5 py-0.5 ${STATUS_STYLES[e.status]}`}>{e.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CsvUploadDialog open={csvOpen} onClose={() => setCsvOpen(false)} />
    </div>
  );
}
