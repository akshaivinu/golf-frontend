"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/Toast";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast("Account created! Check your email to verify.", "info");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast("Welcome back!", "success");
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-dark flex flex-col md:flex-row overflow-hidden">
      {/* Visual Side (Impact Focus) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-surface items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/emotion_led_winning_impact_background_1776757256483.png"
            alt="Impact and Prosperity"
            fill
            className="object-cover opacity-30 scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-brand-dark via-transparent to-brand-emerald/10" />
        </div>
        
        <div className="relative z-10 max-w-lg">
           <h2 className="text-5xl font-display font-black text-white mb-8 leading-tight">
             Your Passion,<br />
             <span className="text-brand-gold italic">Their Future.</span>
           </h2>
           <p className="text-gray-400 text-lg leading-relaxed mb-12">
             Join a community where every score you log helps provide clean water, plant forests, and educate the next generation.
           </p>
           <div className="space-y-4">
              <div className="flex items-center gap-4 text-brand-emerald font-bold">
                 <span className="w-8 h-px bg-brand-emerald"></span>
                 10% Donated Always
              </div>
              <div className="flex items-center gap-4 text-brand-gold font-bold">
                 <span className="w-8 h-px bg-brand-gold"></span>
                 Life-Changing Monthly Jackpots
              </div>
           </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12 relative">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-emerald/10 rounded-full blur-[100px] lg:hidden"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-12">
            <h1 className="text-3xl font-display font-black mb-2">
              {isSignUp ? "Create Your Account" : "Access Your Impact"}
            </h1>
            <p className="text-gray-400">
              {isSignUp ? "Join the movement and start winning today." : "Welcome back. Let's see your results."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-black mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-emerald transition-all"
                placeholder="alex@example.com"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-black mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-emerald transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
                loading
                ? "bg-gray-800 text-gray-600 animate-pulse cursor-not-allowed"
                : "gold-gradient text-brand-dark hover:scale-[1.02] active:scale-[0.98] shadow-[0_15px_40px_rgba(212,175,55,0.2)]"
              }`}
            >
              {loading ? "Processing..." : isSignUp ? "Proceed to Checkout" : "Log In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            {isSignUp ? "Already have an account?" : "Don't have an account yet?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-brand-emerald font-bold hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>

          <div className="mt-20 pt-8 border-t border-white/5 flex items-center justify-between opacity-40">
             <span className="text-[10px] uppercase font-bold text-gray-500">Securely Powered by</span>
             <div className="flex gap-4">
                <span className="text-xs font-black">STRIPE</span>
                <span className="text-xs font-black text-brand-emerald">SUPABASE</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
