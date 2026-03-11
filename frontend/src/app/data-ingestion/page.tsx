"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, CheckCircle, XCircle, Loader2,
  Eye, ChevronDown, ChevronUp, ArrowRight, Database, RefreshCw, Edit3
} from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";
import { Meteors } from "@/components/ui/Meteors";

interface UploadedDoc {
  id: string;
  originalName: string;
  extractedText: string;
  classification: string;
  confidence: number;
  size: number;
  analystVerified?: boolean;
}

export default function DataIngestionPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [classificationsDone, setClassificationsDone] = useState(false);

  const workspaceId = typeof window !== "undefined" ? localStorage.getItem("creditai_workspace") : null;

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    if (workspaceId) formData.append("workspaceId", workspaceId);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setDocuments((prev) => [...prev, ...data.documents]);
      }
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  }, [workspaceId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const updateClassification = (docId: string, newClass: string) => {
    setDocuments((prev) => prev.map((d) => d.id === docId ? { ...d, classification: newClass, analystVerified: true } : d));
  };

  const handleProcessClassification = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          documents: documents.map((d) => ({
            id: d.id,
            classification: d.classification,
            extractedText: d.extractedText,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) setClassificationsDone(true);
    } catch (err) {
      console.error(err);
    }
    setProcessing(false);
  };

  const docCategories = [
    "Annual Report", "ALM", "Shareholding Pattern", "Borrowing Profile",
    "GST Returns", "Bank Statement", "Portfolio Performance", "Legal Document", "Other Financial Document"
  ];

  return (
    <div className="w-full flex justify-center pb-20 pt-4">
      <div className="w-full max-w-7xl flex flex-col gap-8 relative z-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <ShinyText text="Intelligent Data Ingestion" disabled={false} speed={2} className="text-[#f8fafc]" />
          </h1>
          <p className="text-gray-400 text-sm">
            Upload documents for AI-powered OCR extraction and automatic classification.
          </p>
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center min-h-[250px] overflow-hidden shadow-xl ${dragOver
              ? "border-emerald-500 bg-emerald-500/5"
              : "border-[#1e293b] bg-[#080d1a] hover:border-[#334155]"
            }`}
        >
          <Meteors number={10} />
          <div className="relative z-10 flex flex-col items-center">
            {uploading ? (
              <>
                <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-200">Processing with Gemini Vision OCR...</p>
                <p className="text-sm text-gray-400 mt-1">Extracting text and classifying documents</p>
              </>
            ) : (
              <>
                <div className="bg-brand/20 p-4 rounded-full mb-6 border border-brand/30 shadow-[0_0_20px_rgba(22,58,92,0.4)]">
                  <Upload className="w-12 h-12 text-brand" />
                </div>
                <p className="text-xl font-bold text-gray-200 mb-2">Drop files here or click to upload</p>
                <p className="text-gray-400 text-sm mb-6 text-center max-w-md">
                  Supports PDF, Images (PNG/JPG), Excel, Word documents. Each file will be processed via Gemini Flash 2.5 Vision OCR.
                </p>
                <label className="px-6 py-2.5 bg-brand hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-lg cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv,.doc,.docx"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  />
                </label>
              </>
            )}
          </div>
        </div>

        {/* Uploaded Documents List */}
        {documents.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <ShinyText text={`Processed Documents (${documents.length})`} disabled={false} speed={2} className="text-gray-200" />
              </h2>
              {!classificationsDone && (
                <button
                  onClick={handleProcessClassification}
                  disabled={processing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {processing ? "Extracting Schema..." : "Confirm & Extract Schema"}
                </button>
              )}
              {classificationsDone && (
                <button
                  onClick={() => router.push("/agent-analysis")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  Continue to Analysis <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {documents.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl bg-[#080d1a] border border-[#1e293b] overflow-hidden shadow-xl"
                >
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-brand/20 p-2.5 rounded-xl border border-brand/30">
                        <FileText className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-200">{doc.originalName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{(doc.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Classification Badge */}
                      <div className="flex items-center gap-2">
                        <select
                          value={doc.classification}
                          onChange={(e) => updateClassification(doc.id, e.target.value)}
                          className="bg-[#0f172a] border border-[#1e293b] rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                        >
                          {docCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        {doc.analystVerified ? (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <Edit3 className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">
                            AI: {doc.confidence}%
                          </span>
                        )}
                      </div>

                      <CheckCircle className="w-5 h-5 text-emerald-400" />

                      <button
                        onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
                        className="p-2 hover:bg-[#1e293b] rounded-lg transition-colors"
                      >
                        {expandedDoc === doc.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded OCR Content */}
                  <AnimatePresence>
                    {expandedDoc === doc.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[#1e293b] overflow-hidden"
                      >
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Eye className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-gray-300">Gemini OCR Extracted Text</span>
                          </div>
                          <pre className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 text-xs text-gray-300 font-mono max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                            {doc.extractedText || "No text extracted."}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
