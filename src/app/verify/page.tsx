"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { DashboardStats, DrawResult } from "@/types";

export default function WinnerVerification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const drawResultId = searchParams.get("draw_result_id");

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function checkEligibility() {
      if (!drawResultId) {
        setIsValidating(false);
        setErrorMsg("Missing draw result ID.");
        return;
      }
      try {
        // Mocking validation: In production, backend should confirm owner & status
        const results = await api.get('/draws/active'); 
        // Logic: if current user doesn't have an active win matching this ID, block.
        // For now, we trust the backend check on upload (which is already implemented).
      } catch (err) {
        setErrorMsg("Ineligible to claim this prize.");
      } finally {
        setIsValidating(false);
      }
    }
    checkEligibility();
  }, [drawResultId]);

  const handleUpload = async () => {
    if (!file || !drawResultId) return;
    
    setIsUploading(true);
    setStatus("idle");
    setErrorMsg("");

    try {
        // 1. Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${drawResultId}-${Math.random()}.${fileExt}`;
        const filePath = `proofs/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from('winner-proofs')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('winner-proofs')
            .getPublicUrl(filePath);

        // 3. Register with Backend
        await api.post('/verifications/upload', {
            draw_result_id: drawResultId,
            proof_file_url: publicUrl
        });

        setStatus("success");
    } catch (err: any) {
        console.error("Upload failed:", err);
        setStatus("error");
        setErrorMsg(err.message || "Failed to upload proof. Please try again.");
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark p-8 md:p-12 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full">
        <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-8 transition-colors">
            ← Back to Dashboard
        </Link>
        
        <div className="glass rounded-3xl p-10 border border-white/5 relative overflow-hidden">
             {/* Background Glow */}
             <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/10 rounded-full blur-[80px]"></div>

             <div className="relative z-10">
                <h1 className="text-3xl font-display font-black mb-2">Claim Your Prize</h1>
                <p className="text-gray-400 text-sm mb-8">
                  Congratulations! To receive your payout, please upload a screenshot of your score from your primary golf tracking platform (e.g., GHIN, GolfNow).
                </p>

                {status === "idle" && (
                  <div className="space-y-6">
                    <div 
                      className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center transition-colors hover:border-brand-gold/50 cursor-pointer group"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                      }}
                    >
                      <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">📸</span>
                      <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">
                        {file ? file.name : "Drag & Drop Screenshot"}
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      <input 
                        type="file" 
                        id="file-upload" 
                        className="hidden" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <label htmlFor="file-upload" className="mt-6 px-6 py-2 bg-white/5 rounded-full text-xs font-bold hover:bg-white/10 cursor-pointer">
                        Browse Files
                      </label>
                    </div>

                    <button
                      onClick={handleUpload}
                      disabled={!file || isUploading}
                      className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
                        !file || isUploading
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "gold-gradient text-brand-dark hover:scale-[1.02]"
                      }`}
                    >
                      {isUploading ? "Uploading..." : "Submit for Verification"}
                    </button>
                  </div>
                )}

                {status === "success" && (
                  <div className="text-center py-12">
                     <div className="w-20 h-20 bg-brand-emerald/20 text-brand-emerald rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                        ✓
                     </div>
                     <h2 className="text-2xl font-bold mb-2">Submission Received</h2>
                     <p className="text-gray-400 mb-8">An admin will review your proof within 24-48 hours. You'll receive an email once the payout is initiated.</p>
                     <Link href="/dashboard" className="text-brand-gold font-bold hover:underline">Return to Dashboard</Link>
                  </div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
}
