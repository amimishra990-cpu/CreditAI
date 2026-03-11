"use client";

import { Meteors } from "@/components/ui/Meteors";
import { Database } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";

export default function DataIngestionPage() {
  return (
    <div className="w-full flex justify-center pb-20 pt-4">
      <div className="w-full max-w-7xl flex flex-col gap-8 relative z-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">
             <ShinyText text="Data Ingestion" disabled={false} speed={2} className="text-[#f8fafc]" />
          </h1>
          <p className="text-gray-400 text-sm">
            Manage data streams and file uploads for AI analysis.
          </p>
        </div>

        <div className="p-12 rounded-2xl bg-[#080d1a] border border-[#1e293b] flex flex-col items-center justify-center relative overflow-hidden shadow-xl min-h-[400px]">
           <Meteors number={15} />
           <div className="bg-brand/20 p-4 rounded-full mb-6 border border-brand/30 shadow-[0_0_20px_rgba(22,58,92,0.4)]">
             <Database className="w-12 h-12 text-brand" />
           </div>
           <h2 className="text-2xl font-bold mb-2 z-10">
             <ShinyText text="Data Pipeline Ready" disabled={false} speed={2.5} className="text-gray-200" />
           </h2>
           <p className="text-gray-400 max-w-md text-center z-10">
             Drop your financial documents, GST returns, and bank statements here to begin multi-agent pipeline processing.
           </p>
           <button className="mt-8 px-6 py-2.5 bg-brand hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-lg z-10">
              Upload Files
           </button>
        </div>
      </div>
    </div>
  );
}
