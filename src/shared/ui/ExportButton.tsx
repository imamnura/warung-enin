"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "./Button";

interface ExportButtonProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  label?: string;
}

export function ExportButton({
  onExportCSV,
  onExportPDF,
  label = "Export",
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        {label}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
            <button
              onClick={() => {
                onExportCSV();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Export CSV</p>
                <p className="text-xs text-gray-500">File Excel/Spreadsheet</p>
              </div>
            </button>
            <button
              onClick={() => {
                onExportPDF();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-t border-gray-100"
            >
              <FileText className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">Export PDF</p>
                <p className="text-xs text-gray-500">Dokumen PDF</p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
