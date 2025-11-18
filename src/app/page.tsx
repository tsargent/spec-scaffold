"use client";

import { useState } from "react";
import type { ScaffoldResult, GeneratedFile } from "@/types/scaffold";
import { DownloadZipButton } from "@/app/DownloadZipButton";

export default function HomePage() {
  const [spec, setSpec] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScaffoldResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSelectedFile(null);

    try {
      const res = await fetch("/api/scaffold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spec }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate scaffold");
      }

      const data = (await res.json()) as ScaffoldResult;
      setResult(data);
      setSelectedFile(data.files[0] ?? null);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col gap-8 p-6 md:p-10 bg-neutral-950 text-neutral-50">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">
          Spec → Scaffold Developer Agent
        </h1>
        <p className="text-sm text-neutral-400">
          Paste a short feature description and generate a project scaffold
          (files, components, tests, notes).
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
        {/* Left: input */}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-neutral-200">
              Feature Specification
            </span>
            <textarea
              className="min-h-[200px] rounded-xl border border-neutral-800 bg-neutral-900/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/60"
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              placeholder={`Example:\n\n"Build a simple user management panel with a list of users, a form to create a new user, and Jest tests for the main component."`}
            />
          </label>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !spec.trim()}
            className="inline-flex items-center justify-center rounded-xl border border-sky-500/60 bg-sky-500/80 px-4 py-2 text-sm font-medium text-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating..." : "Generate Scaffold"}
          </button>

          {error && <p className="text-sm text-red-400">Error: {error}</p>}

          {result && (
            <div className="mt-4 text-sm text-neutral-200 space-y-2">
              <h2 className="font-semibold">Summary</h2>
              <p>{result.summary}</p>
              <h3 className="font-semibold mt-3">Architecture Notes</h3>
              <p className="whitespace-pre-wrap text-neutral-300">
                {result.architectureNotes}
              </p>
            </div>
          )}
        </div>

        {/* Right: file tree + preview */}
        <div className="flex flex-col gap-4">
          {result ? (
            <div className="flex flex-col h-full gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-neutral-200">
                  Generated Files ({result.files.length})
                </h2>
                <DownloadZipButton files={result.files} />
              </div>

              <div className="flex flex-1 gap-3 min-h-[260px]">
                {/* File list */}
                <div className="w-1/3 rounded-xl border border-neutral-800 bg-neutral-900/70 text-xs overflow-auto">
                  <ul>
                    {result.files.map((file) => (
                      <li
                        key={file.path}
                        className={`cursor-pointer border-b border-neutral-800/60 px-3 py-2 hover:bg-neutral-800/80 ${
                          selectedFile?.path === file.path
                            ? "bg-neutral-800"
                            : ""
                        }`}
                        onClick={() => setSelectedFile(file)}
                      >
                        <div className="truncate font-mono">{file.path}</div>
                        <div className="text-[10px] text-neutral-400 truncate">
                          {file.description}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Code preview */}
                <div className="w-2/3 rounded-xl border border-neutral-800 bg-neutral-950/90 text-xs overflow-auto">
                  {selectedFile ? (
                    <pre className="p-3 font-mono whitespace-pre">
                      {selectedFile.content}
                    </pre>
                  ) : (
                    <div className="p-3 text-neutral-500 text-xs">
                      Select a file to preview its contents.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-950/60 flex items-center justify-center text-sm text-neutral-500 min-h-[260px]">
              Generated files will appear here.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
