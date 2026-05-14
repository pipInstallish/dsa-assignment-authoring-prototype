"use client";

import type { GeneratedAssignment } from "@/lib/types";
import { ConceptBadge } from "./ConceptBadge";
import { DSA_CONCEPTS } from "@/lib/seed/dsa";

interface AssignmentPreviewProps {
  assignment: GeneratedAssignment;
  showConstraints?: boolean;
}

export function AssignmentPreview({ assignment, showConstraints = true }: AssignmentPreviewProps) {
  const { problem, metadata } = assignment;

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-100">{problem.title}</h2>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {metadata.conceptsRequired.map(id => {
            const concept = DSA_CONCEPTS.find(c => c.id === id);
            return <ConceptBadge key={id} conceptId={id} label={concept?.canonicalName} size="xs" />;
          })}
          {metadata.realWorldDomain && (
            <span className="text-xs text-neutral-500 bg-neutral-800 rounded border border-white/8 px-1.5 py-0.5">
              {metadata.realWorldDomain}
            </span>
          )}
        </div>
      </div>

      {/* Problem statement */}
      <div>
        <p className="text-sm font-medium text-neutral-400 mb-1.5">Problem Statement</p>
        <div className="text-sm text-neutral-200 leading-relaxed prose-neutral whitespace-pre-wrap">
          {/* Simple markdown-like rendering */}
          {problem.statement.split("\n").map((line, i) => {
            if (line.startsWith("**") && line.endsWith("**")) {
              return <p key={i} className="font-semibold">{line.slice(2, -2)}</p>;
            }
            // Replace **bold** inline
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} className={line === "" ? "h-2" : ""}>
                {parts.map((part, j) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={j}>{part.slice(2, -2)}</strong>
                  ) : part.includes("`") ? (
                    part.split(/(`[^`]+`)/g).map((p, k) =>
                      p.startsWith("`") && p.endsWith("`") ? (
                        <code key={k} className="font-mono text-xs bg-neutral-800 rounded px-1 py-0.5 text-indigo-300">{p.slice(1, -1)}</code>
                      ) : p
                    )
                  ) : part
                )}
              </p>
            );
          })}
        </div>
      </div>

      {/* Examples */}
      {problem.examples.length > 0 && (
        <div>
          <p className="text-sm font-medium text-neutral-400 mb-2">Examples</p>
          <div className="space-y-3">
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-neutral-900 rounded-md border border-white/8 p-3">
                <p className="text-xs text-neutral-500 mb-1.5">Example {i + 1}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Input</p>
                    <pre className="font-mono text-xs text-neutral-200 whitespace-pre-wrap">{ex.input}</pre>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Output</p>
                    <pre className="font-mono text-xs text-emerald-300">{ex.output}</pre>
                  </div>
                </div>
                {ex.explanation && (
                  <p className="text-xs text-neutral-400 mt-2 border-t border-white/5 pt-2">{ex.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* I/O format */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-medium text-neutral-500 mb-1">Input Format</p>
          <p className="text-xs text-neutral-300">{problem.inputFormat}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-neutral-500 mb-1">Output Format</p>
          <p className="text-xs text-neutral-300">{problem.outputFormat}</p>
        </div>
      </div>

      {/* Constraints */}
      {showConstraints && problem.constraints.length > 0 && (
        <div>
          <p className="text-xs font-medium text-neutral-500 mb-1">Constraints</p>
          <ul className="space-y-0.5">
            {problem.constraints.map((c, i) => (
              <li key={i} className="text-xs text-neutral-300 font-mono">
                • {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-neutral-500 pt-1 border-t border-white/5">
        <span>Difficulty: <span className="text-neutral-300 capitalize">{assignment.request.difficultyTarget?.tier || "medium"}</span></span>
        <span>Est. {metadata.estimatedSolveTimeMinutes}min</span>
        <span>Score: {metadata.estimatedDifficultyScore.toFixed(2)}</span>
      </div>
    </div>
  );
}
