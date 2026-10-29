"use client";

import { useState } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorksheetUploadDropzoneProps {
  onUpload: (data: { name: string; file: File }) => void;
  isLoading?: boolean;
}

export function WorksheetUploadDropzone({ onUpload, isLoading }: WorksheetUploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      setUploadedFile(file);
      onUpload({ name: file.name, file });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      onUpload({ name: file.name, file });
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
        dragActive ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20" : "border-gray-300 dark:border-gray-700"
      )}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-muted-foreground">Processing...</p>
        </div>
      ) : uploadedFile ? (
        <div className="flex flex-col items-center gap-2">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
          <p className="text-sm font-medium">{uploadedFile.name}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <UploadCloud className="w-10 h-10 text-muted-foreground" />
          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Drag and drop .xlsx file here</p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>or click to browse</p>
          <label className="mt-2 px-4 py-2 text-sm font-semibold rounded-lg text-white cursor-pointer" style={{ backgroundColor: "var(--primary)" }}>
            Select File
            <input type="file" accept=".xlsx" className="hidden" onChange={handleChange} />
          </label>
        </div>
      )}
    </div>
  );
}
