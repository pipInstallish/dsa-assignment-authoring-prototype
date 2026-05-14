"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then(m => m.default),
  { ssr: false, loading: () => <div className="h-full bg-[#1e1e1e] rounded animate-pulse" /> }
);

interface MonacoDisplayProps {
  code: string;
  language?: string;
  height?: string | number;
  readOnly?: boolean;
}

export function MonacoDisplay({
  code,
  language = "python",
  height = 300,
  readOnly = true,
}: MonacoDisplayProps) {
  return (
    <div className="rounded-md overflow-hidden border border-white/8">
      <MonacoEditor
        height={height}
        defaultLanguage={language}
        value={code}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: "'Geist Mono', 'Fira Code', monospace",
          lineNumbers: "on",
          renderLineHighlight: "none",
          padding: { top: 12, bottom: 12 },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: { vertical: "auto", horizontal: "auto" },
          wordWrap: "off",
          folding: false,
          lineDecorationsWidth: 0,
          contextmenu: false,
        }}
      />
    </div>
  );
}
