"use client"
import { useState } from "react";
import { api } from "@/lib/api";
import { Check, Shield, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function SubscribePage() {
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
        setLoading(plan);
        try {
            const { url } = await api.post('/subscriptions/create-checkout', { plan });
            window.location.href = url;
        } catch (err: any) {
            alert("Checkout failed: " + err.message);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark py-20 px-8">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <header className="text-center mb-20 animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 uppercase tracking-tighter italic">Choose Your Impact</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Your monthly passion fuels global progress. Track your game, support a cause, and enter the massive monthly jackpot.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                    {/* Monthly Plan */}
                    <motion.div 
                        whileHover={{ y: -10 }}
                        className="glass p-12 rounded-[2.5rem] border border-white/5 relative flex flex-col"
                    >
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Monthly Impact</h3>
                            <div className="flex items-end gap-2">
                                <span className="text-6xl font-black text-white">$19</span>
                                <span className="text-gray-500 mb-2 font-bold uppercase tracking-widest text-xs">/ Month</span>
                            </div>
                        </div>

                        <ul className="space-y-6 mb-12 flex-1">
                            {[
                                "Enter all Monthly Jackpot Draws",
                                "Full Score Tracking & History",
                                "Select your own Impact Partner",
                                "10% contribution to charity",
                                "Real-time Verification Status"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-4 text-gray-400 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-brand-emerald/10 flex items-center justify-center text-brand-emerald">
                                        <Check size={12} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={() => handleSubscribe('monthly')}
                            disabled={loading !== null}
                            className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading === 'monthly' ? "Processing..." : "Join Monthly"}
                        </button>
                    </motion.div>

                    {/* Yearly Plan */}
                    <motion.div 
                        whileHover={{ y: -10 }}
                        className="glass p-12 rounded-[2.5rem] border-brand-gold bg-brand-gold/5 relative overflow-hidden flex flex-col border-2"
                    >
                        <div className="absolute top-8 right-8 bg-brand-gold text-brand-dark px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Best Value</div>
                        
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-2xl font-bold text-white">Yearly Impact</h3>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-6xl font-black text-white">$159</span>
                                <span className="text-gray-500 mb-2 font-bold uppercase tracking-widest text-xs">/ Year</span>
                            </div>
                            <p className="text-brand-gold text-[10px] font-black uppercase tracking-widest mt-2">Save $69 compared to monthly</p>
                        </div>

                        <ul className="space-y-6 mb-12 flex-1">
                            {[
                                "Everything in Monthly Impact",
                                "Exclusive Yearly Impact Badge",
                                "Advanced Performance Reports",
                                "Priority Winner Verification",
                                "Bonus entry in High-Stakes draws"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-4 text-white font-semibold">
                                    <div className="w-5 h-5 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                                        <Zap size={10} fill="currentColor" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={() => handleSubscribe('yearly')}
                            disabled={loading !== null}
                            className="w-full py-5 rounded-2xl bg-brand-gold text-brand-dark font-black uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 shadow-[0_20px_40px_rgba(212,175,55,0.2)] disabled:opacity-50"
                        >
                            {loading === 'yearly' ? "Processing..." : "Get Yearly Impact"}
                        </button>
                    </motion.div>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-emerald mb-4">
                            <Shield size={24} />
                        </div>
                        <h4 className="font-bold text-white mb-2">Secure Payments</h4>
                        <p className="text-xs text-gray-500">PCI-compliant processing via Stripe encryption.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-gold mb-4">
                            <TrendingUp size={24} />
                        </div>
                        <h4 className="font-bold text-white mb-2">Transparent Giving</h4>
                        <p className="text-xs text-gray-500">Track exactly where 10% of your fee goes.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-emerald mb-4">
                            <Zap size={24} />
                        </div>
                        <h4 className="font-bold text-white mb-2">Instant Access</h4>
                        <p className="text-xs text-gray-500">Start logging your 5 scores immediately.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
