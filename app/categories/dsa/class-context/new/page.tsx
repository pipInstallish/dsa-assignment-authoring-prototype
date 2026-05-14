"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DSA_CONCEPTS } from "@/lib/seed/dsa";
import { ConceptBadge } from "@/components/domain/ConceptBadge";
import { mockExtractConcepts } from "@/lib/mock/llm";
import { addUserClassContext } from "@/lib/storage/local";
import { toast } from "sonner";
import { Upload, Check, ChevronRight, Loader2, FileText, X } from "lucide-react";

const STEPS = ["Upload Files", "Review Concepts", "Confirm & Save"];

const DEPTH_OPTIONS = ["introduced", "applied", "mastered"] as const;
const DEPTH_COLORS = {
  introduced: "text-yellow-400 border-yellow-700/40 bg-yellow-900/10",
  applied: "text-blue-400 border-blue-700/40 bg-blue-900/10",
  mastered: "text-emerald-400 border-emerald-700/40 bg-emerald-900/10",
};

interface ExtractedResult {
  conceptId: string;
  depth: "introduced" | "applied" | "mastered";
  confidence: number;
  confirmedByInstructor: boolean;
}

export default function NewClassContextPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [moduleId, setModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [fileInput, setFileInput] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedResult[]>([]);
  const [saving, setSaving] = useState(false);

  async function handleExtract() {
    if (!title.trim() || files.length === 0) {
      toast.error("Please add a title and at least one file");
      return;
    }
    setExtracting(true);
    const concepts: ExtractedResult[] = [];
    await mockExtractConcepts((conceptId, depth, confidence) => {
      concepts.push({ conceptId, depth, confidence, confirmedByInstructor: false });
    });
    setExtracted(concepts);
    setExtracting(false);
    setStep(1);
  }

  function toggleDepth(conceptId: string, depth: "introduced" | "applied" | "mastered") {
    setExtracted(prev => prev.map(e => e.conceptId === conceptId ? { ...e, depth } : e));
  }

  function toggleConfirm(conceptId: string) {
    setExtracted(prev => prev.map(e => e.conceptId === conceptId ? { ...e, confirmedByInstructor: !e.confirmedByInstructor } : e));
  }

  function removeExtracted(conceptId: string) {
    setExtracted(prev => prev.filter(e => e.conceptId !== conceptId));
  }

  async function handleSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    const ctx = {
      id: `ctx-user-${Date.now()}`,
      categoryId: "dsa" as const,
      moduleId: moduleId || `module-${Date.now()}`,
      title,
      uploadedFiles: files.map(f => ({ name: f, uri: `/uploads/${f}` })),
      extractedConcepts: extracted.map(e => ({ ...e, confirmedByInstructor: true })),
      createdAt: new Date().toISOString(),
    };
    addUserClassContext(ctx);
    setSaving(false);
    toast.success("Class context saved");
    router.push("/categories/dsa/class-context");
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
          <a href="/categories/dsa" className="hover:text-neutral-300">DSA</a>
          <span>/</span>
          <a href="/categories/dsa/class-context" className="hover:text-neutral-300">Class Contexts</a>
          <span>/</span>
          <span className="text-neutral-300">New</span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-100">Upload Module</h1>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
              i < step ? "bg-indigo-600 text-white" :
              i === step ? "bg-indigo-600/30 border border-indigo-500 text-indigo-300" :
              "bg-white/5 border border-white/10 text-neutral-600"
            }`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-xs ${i === step ? "text-neutral-200" : "text-neutral-500"}`}>{s}</span>
            {i < STEPS.length - 1 && <ChevronRight size={12} className="text-neutral-700 ml-1" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <div className="rounded-lg border border-white/8 p-5 space-y-4">
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Module Title *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Week 3: Arrays and Hashing"
                className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Module ID</label>
              <input
                value={moduleId}
                onChange={e => setModuleId(e.target.value)}
                placeholder="e.g. w3-arrays-hashing"
                className="w-full bg-neutral-800 border border-white/10 rounded px-3 py-2 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 font-mono"
              />
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-white/15 p-8 text-center">
            <Upload size={24} className="text-neutral-600 mx-auto mb-3" />
            <p className="text-sm text-neutral-400 mb-1">Drag and drop lecture slides, notes, or syllabi</p>
            <p className="text-xs text-neutral-600 mb-4">PDF, DOCX, TXT — concepts will be extracted via LLM</p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                value={fileInput}
                onChange={e => setFileInput(e.target.value)}
                placeholder="filename.pdf"
                className="flex-1 bg-neutral-800 border border-white/10 rounded px-3 py-1.5 text-sm text-neutral-200 outline-none focus:border-indigo-500/60"
              />
              <button
                onClick={() => { if (fileInput.trim()) { setFiles(prev => [...prev, fileInput.trim()]); setFileInput(""); } }}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-neutral-300 text-sm rounded transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-1.5">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-md bg-white/3 border border-white/8">
                  <FileText size={14} className="text-neutral-500 shrink-0" />
                  <span className="text-sm text-neutral-300 flex-1">{f}</span>
                  <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} className="text-neutral-600 hover:text-rose-400">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleExtract}
            disabled={extracting || !title.trim() || files.length === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm transition-colors"
          >
            {extracting ? <><Loader2 size={14} className="animate-spin" />Extracting concepts...</> : "Extract Concepts"}
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-300">{extracted.length} concepts extracted — review and confirm</p>
            <button onClick={() => setExtracted(prev => prev.map(e => ({ ...e, confirmedByInstructor: true })))} className="text-xs text-indigo-400 hover:text-indigo-300">Confirm all</button>
          </div>

          <div className="space-y-2">
            {extracted.map(ec => {
              const concept = DSA_CONCEPTS.find(c => c.id === ec.conceptId);
              return (
                <div key={ec.conceptId} className="p-3 rounded-lg border border-white/8 flex items-center gap-3">
                  <button
                    onClick={() => toggleConfirm(ec.conceptId)}
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                      ec.confirmedByInstructor ? "bg-indigo-600 border-indigo-500" : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    {ec.confirmedByInstructor && <Check size={11} className="text-white" />}
                  </button>
                  <ConceptBadge conceptId={ec.conceptId} label={concept?.canonicalName} size="xs" />
                  <span className="text-xs text-neutral-500 flex-1">{concept?.definition?.slice(0, 60)}…</span>
                  <div className="flex gap-1">
                    {DEPTH_OPTIONS.map(d => (
                      <button
                        key={d}
                        onClick={() => toggleDepth(ec.conceptId, d)}
                        className={`px-2 py-0.5 rounded text-xs border transition-colors ${ec.depth === d ? DEPTH_COLORS[d] : "border-white/10 text-neutral-600 hover:text-neutral-400"}`}
                      >
                        {d[0].toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-neutral-600 w-10 text-right">{Math.round(ec.confidence * 100)}%</span>
                  <button onClick={() => removeExtracted(ec.conceptId)} className="text-neutral-700 hover:text-rose-400 transition-colors">
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => setStep(0)} className="px-4 py-2 border border-white/10 text-neutral-400 rounded text-sm hover:text-neutral-200 transition-colors">Back</button>
            <button onClick={() => setStep(2)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded py-2 text-sm transition-colors">Continue</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="rounded-lg border border-white/8 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Title</span>
              <span className="text-neutral-200">{title}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Module ID</span>
              <span className="text-neutral-200 font-mono text-xs">{moduleId || "auto-generated"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">Files</span>
              <span className="text-neutral-200">{files.join(", ")}</span>
            </div>
            <div className="flex items-start justify-between text-sm">
              <span className="text-neutral-400">Concepts</span>
              <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                {extracted.filter(e => e.confirmedByInstructor).map(ec => (
                  <ConceptBadge key={ec.conceptId} conceptId={ec.conceptId} size="xs" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="px-4 py-2 border border-white/10 text-neutral-400 rounded text-sm hover:text-neutral-200 transition-colors">Back</button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded py-2 text-sm transition-colors"
            >
              {saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : "Save Class Context"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
