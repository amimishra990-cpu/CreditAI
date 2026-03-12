"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, CheckCircle, Loader2,
  Eye, ChevronDown, ChevronUp, ArrowRight, Database, RefreshCw, Edit3, AlertCircle
} from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";
import { Meteors } from "@/components/ui/Meteors";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

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
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [classificationsDone, setClassificationsDone] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");

  useEffect(() => {
    loadWorkspaces();
    const wsId = searchParams.get("workspaceId");
    if (wsId) {
      setWorkspaceId(wsId);
      setSelectedWorkspace(wsId);
      loadWorkspaceDocuments(wsId);
    }
  }, [searchParams]);

  const loadWorkspaces = async () => {
    try {
      if (!user?.currentOrganizationId) return;
      const response = await apiClient.getOrganizationWorkspaces(user.currentOrganizationId);
      setWorkspaces(response.data.workspaces);

      // If no workspace selected, select the first one
      if (!selectedWorkspace && response.data.workspaces.length > 0) {
        const firstWs = response.data.workspaces[0];
        setSelectedWorkspace(firstWs.id);
        setWorkspaceId(firstWs.id);
        loadWorkspaceDocuments(firstWs.id);
      }
    } catch (error) {
      console.error("Failed to load workspaces:", error);
    }
  };

  const loadWorkspaceDocuments = async (wsId: string) => {
    try {
      const response = await apiClient.getWorkspace(wsId);
      const workspace = response.data;
      if (workspace.documents && workspace.documents.length > 0) {
        setDocuments(workspace.documents);
      }
      if (workspace.classifications && workspace.classifications.length > 0) {
        setClassificationsDone(true);
      }
    } catch (error) {
      console.error("Failed to load workspace documents:", error);
    }
  };

  const handleWorkspaceChange = (wsId: string) => {
    setSelectedWorkspace(wsId);
    setWorkspaceId(wsId);
    setDocuments([]);
    setClassificationsDone(false);
    loadWorkspaceDocuments(wsId);
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    if (!workspaceId) {
      toast.error("Please select a workspace first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    formData.append("workspaceId", workspaceId);

    try {
      const res = await apiClient.uploadDocuments(formData);
      if (res.data.success) {
        setDocuments((prev) => [...prev, ...res.data.documents]);
        toast.success(`${res.data.documents.length} document(s) uploaded and processed`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [workspaceId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const updateClassification = (docId: string, newClass: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, classification: newClass, analystVerified: true } : d
      )
    );
  };

  const handleProcessClassification = async () => {
    if (!workspaceId) {
      toast.error("No workspace selected");
      return;
    }

    setProcessing(true);
    try {
      const res = await apiClient.classifyDocuments({
        workspaceId,
        documents: documents.map((d) => ({
          id: d.id,
          classification: d.classification,
          extractedText: d.extractedText,
          analystVerified: d.analystVerified,
        })),
      });

      if (res.data.success) {
        setClassificationsDone(true);
        toast.success("Classifications saved successfully");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Classification failed");
    } finally {
      setProcessing(false);
    }
  };

  const docCategories = [
    "Annual Report",
    "ALM",
    "Shareholding Pattern",
    "Borrowing Profile",
    "GST Returns",
    "Bank Statement",
    "Portfolio Performance",
    "Legal Document",
    "Other Financial Document"
  ];

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <ShinyText text="Intelligent Data Ingestion" disabled={false} speed={2} className="silver-text" />
            </h1>
            <p className="text-gray-400 text-sm">
              Upload documents for AI-powered OCR extraction and automatic classification.
            </p>
          </div>

          {/* Workspace Selector */}
          {workspaces.length > 0 && (
            <div className="p-6 bg-[#0a0a0a] border border-[#333333] rounded-2xl silver-glow-hover">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Workspace
              </label>
              <select
                value={selectedWorkspace}
                onChange={(e) => handleWorkspaceChange(e.target.value)}
                className="w-full bg-black border border-[#333333] rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C0C0C0]/50"
              >
                <option value="">Choose a workspace...</option>
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name} - {ws.company.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {workspaces.length === 0 && (
            <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium">No workspaces found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Please create a workspace first before uploading documents.
                </p>
                <button
                  onClick={() => router.push("/workspace/new")}
                  className="mt-3 px-4 py-2 bg-brand hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Create Workspace
                </button>
              </div>
            </div>
          )}

          {/* Upload Zone */}
          {selectedWorkspace && (
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
                    <Loader2 className="w-16 h-16 text-brand animate-spin mb-4" />
                    <p className="text-lg font-medium text-gray-200">Processing with Groq AI...</p>
                    <p className="text-sm text-gray-400 mt-1">Extracting text and classifying documents</p>
                  </>
                ) : (
                  <>
                    <div className="bg-brand/20 p-4 rounded-full mb-6 border border-brand/30 shadow-[0_0_20px_rgba(22,58,92,0.4)]">
                      <Upload className="w-12 h-12 text-brand" />
                    </div>
                    <p className="text-xl font-bold text-gray-200 mb-2">Drop files here or click to upload</p>
                    <p className="text-gray-400 text-sm mb-6 text-center max-w-md">
                      Supports PDF, Images (PNG/JPG), Excel, Word documents. Each file will be processed via AI OCR.
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
          )}

          {/* Uploaded Documents List */}
          {documents.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  <ShinyText
                    text={`Processed Documents (${documents.length})`}
                    disabled={false}
                    speed={2}
                    className="text-gray-200"
                  />
                </h2>
                {!classificationsDone && documents.length > 0 && (
                  <button
                    onClick={handleProcessClassification}
                    disabled={processing}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(22,58,92,0.4)] disabled:opacity-50"
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {processing ? "Saving..." : "Confirm & Save Classifications"}
                  </button>
                )}
                {classificationsDone && (
                  <button
                    onClick={() => router.push(`/agent-analysis?workspaceId=${workspaceId}`)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(22,58,92,0.4)]"
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
                          <p className="text-xs text-gray-500 mt-0.5">
                            {(doc.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Classification Badge */}
                        <div className="flex items-center gap-2">
                          <select
                            value={doc.classification}
                            onChange={(e) => updateClassification(doc.id, e.target.value)}
                            className="bg-[#0f172a] border border-[#1e293b] rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand/50"
                          >
                            {docCategories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          {doc.analystVerified ? (
                            <span className="text-xs text-blue-400 flex items-center gap-1">
                              <Edit3 className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">AI: {doc.confidence}%</span>
                          )}
                        </div>

                        <CheckCircle className="w-5 h-5 text-blue-400" />

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
                              <Eye className="w-4 h-4 text-blue-400" />
                              <span className="text-sm font-medium text-gray-300">
                                AI Extracted Text
                              </span>
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
    </div>
  );
}
