"use client";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useState } from "react";
import type { GeneratedFile } from "@/types/scaffold";

type Props = {
  files: GeneratedFile[];
};

export function DownloadZipButton({ files }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    setIsDownloading(true);
    try {
      const zip = new JSZip();

      for (const file of files) {
        zip.file(file.path, file.content);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "scaffold.zip");
    } catch (err) {
      console.error("Failed to create zip", err);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading || files.length === 0}
      className="inline-flex items-center justify-center rounded-lg border border-neutral-700 px-3 py-1 text-xs text-neutral-100 disabled:opacity-40"
    >
      {isDownloading ? "Preparing…" : "Download ZIP"}
    </button>
  );
}
