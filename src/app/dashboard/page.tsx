"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardStats, Score } from "@/types";
import { getScores, updateScore, deleteScore } from "@/lib/services/scoreService";
import { getActiveDraw } from "@/lib/services/drawService";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Heart, Trophy, Activity, Plus, Edit2, Trash2, X, Settings } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

function DashboardContent() {
  const [scores, setScores] = useState<Score[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [scoresData, drawData] = await Promise.all([
          getScores(),
          getActiveDraw(),
        ]);
        setScores(scoresData);
        setStats({
          matches: drawData.matches || 0,
          jackpot: drawData.jackpot || 0,
          charityDonated: drawData.charityDonated || 0,
          activeCharity: drawData.activeCharity || "Select a Charity",
          subscriptionStatus: drawData.subscriptionStatus || "Active",
          activeNumbers: drawData.activeNumbers || [],
          charityPercentage: drawData.charityPercentage || 10,
          renewalDate: drawData.renewalDate || "",
          drawsEntered: drawData.drawsEntered || 0,
          totalWon: drawData.totalWon || 0,
          pendingWinnings: drawData.pendingWinnings || 0,
          nextDrawDate: drawData.nextDrawDate || "",
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDeleteScore = async (id: string) => {
    if (!confirm("Are you sure you want to delete this score?")) return;
    try {
      await deleteScore(id);
      setScores(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleUpdateScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScore) return;
    try {
      const val = parseInt(editValue);
      if (val < 1 || val > 45) throw new Error("Score must be between 1 and 45");
      await updateScore(editingScore.id, val);
      setScores(prev => prev.map(s => s.id === editingScore.id ? { ...s, score_value: val } : s));
      setEditingScore(null);
    } catch (err: any) {
      alert("Update failed: " + err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-gold font-black uppercase tracking-widest animate-pulse">
      Loading Your Impact...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center text-red-500">
      {error}
    </div>
  );

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-brand-dark p-8 md:p-12 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 animate-fade-in-up">
          <div className="space-y-1">
            <h1 className="text-5xl font-display font-black tracking-tighter leading-none italic uppercase">Prosperity & Purpose</h1>
            <p className="text-xl text-gray-400 font-medium pb-2">
                You're fueling <span className="text-brand-emerald font-black brightness-125">{stats.activeCharity}</span> with a <span className="text-brand-gold font-black">{stats.charityPercentage}%</span> commitment.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="glass px-8 py-4 rounded-3xl border-brand-emerald/20 bg-brand-emerald/5 animate-glow-pulse">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-black">Subscription Status</p>
                <div className="flex flex-col">
                  <p className="text-brand-emerald font-black text-lg">{stats.subscriptionStatus}</p>
                  {stats.renewalDate && (
                    <p className="text-[10px] text-gray-500 font-bold uppercase">
                      Renews: {new Date(stats.renewalDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
             </div>
             <Link href="/settings" className="p-4 bg-white/5 rounded-3xl border border-white/5 hover:border-brand-gold transition-all flex items-center justify-center">
                <Settings size={22} className="text-gray-400 hover:text-brand-gold" />
             </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-fade-in-up [animation-delay:200ms]">
          {[
            { label: "Community Impact", value: `$${(stats.charityDonated || 0).toLocaleString()}`, icon: Heart, color: "text-brand-emerald" },
            { label: "Pending Prosperity", value: `$${(stats.pendingWinnings || 0).toLocaleString()}`, icon: Activity, color: "text-brand-gold" },
            { label: "Total Prosperity", value: `$${(stats.totalWon || 0).toLocaleString()}`, icon: Trophy, color: "text-brand-gold" },
            { label: "Next Draw", value: stats.nextDrawDate ? new Date(stats.nextDrawDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "TBD", icon: TrendingUp, color: "text-blue-400" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[2.5rem] border border-white/5 group hover:border-brand-emerald/20 transition-all relative overflow-hidden"
            >
               <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-brand-emerald/10 transition-all"></div>
               <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 ${item.color}`}>
                  <item.icon size={24} />
               </div>
               <p className="text-[11px] uppercase font-black text-gray-500 tracking-widest mb-2">{item.label}</p>
               <p className="text-4xl font-black tracking-tight">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-surface to-brand-dark border border-white/5 p-10"
            >
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                  <div className="relative">
                    <svg className="w-56 h-56 -rotate-90">
                      <circle cx="112" cy="112" r="104" className="stroke-white/5 fill-none" strokeWidth="8" />
                      <motion.circle
                        initial={{ strokeDashoffset: 653 }}
                        animate={{ strokeDashoffset: 653 - (653 * stats.matches) / 5 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="112" cy="112" r="104"
                        className="stroke-brand-emerald fill-none"
                        strokeWidth="8"
                        strokeDasharray="653"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                       <span className="text-6xl font-black">{stats.matches}</span>
                       <span className="text-[10px] text-gray-500 uppercase tracking-widest leading-tight">Active<br/>Matches</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-6 w-full">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                      <h3 className="text-gray-500 text-[10px] uppercase font-black mb-2">Winning Status</h3>
                      <p className="text-3xl font-black text-brand-emerald">
                        {stats.matches >= 3 ? `Tier ${stats.matches} Qualified` : "Keep Tracking"}
                      </p>
                    </div>
                    {stats.activeNumbers.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-500 mb-3">Live Winning Numbers</p>
                        <div className="flex gap-3">
                          {stats.activeNumbers.map((n: number) => (
                            <span key={n} className="w-12 h-12 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-lg font-black text-brand-emerald">{n}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
              </div>
            </motion.div>

            <div className="glass rounded-3xl p-8 border-white/5">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-bold">Score History</h2>
                 <Link href="/scores/new" className="px-6 py-2 rounded-full border border-brand-emerald/50 text-brand-emerald text-[10px] uppercase font-black hover:bg-brand-emerald hover:text-brand-dark transition-all flex items-center gap-2">
                   <Plus size={14} />
                   Log Score
                 </Link>
              </div>
              {scores.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-bold mb-2">No scores yet</p>
                  <p className="text-sm">Log your first Stableford score to enter the draw.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                   {scores.map((score, index) => {
                      const isMatch = stats.activeNumbers.includes(score.score_value);
                      return (
                          <div key={score.id} className={`relative group p-6 rounded-2xl border transition-all text-center ${
                              isMatch ? 'bg-brand-emerald/10 border-brand-emerald/30' : 'bg-white/5 border-white/5'
                          }`}>
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button
                                   onClick={() => { setEditingScore(score); setEditValue(String(score.score_value)); }}
                                   className="p-1.5 bg-white/10 rounded-lg hover:text-brand-gold"
                                 >
                                   <Edit2 size={12}/>
                                 </button>
                                 <button
                                   onClick={() => handleDeleteScore(score.id)}
                                   className="p-1.5 bg-white/10 rounded-lg hover:text-red-500"
                                 >
                                   <Trash2 size={12}/>
                                 </button>
                              </div>
                              <p className="text-[9px] text-gray-500 uppercase font-black mb-2 tracking-widest">Entry {index + 1}</p>
                              <p className={`text-3xl font-black mb-1 ${isMatch ? 'text-brand-emerald' : 'text-white'}`}>{score.score_value}</p>
                              <p className="text-[9px] text-gray-600 font-bold">
                                  {new Date(score.score_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </p>
                          </div>
                      );
                   })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
             <div className="glass rounded-3xl p-10 relative overflow-hidden bg-brand-gold text-brand-dark">
              <h2 className="text-[10px] uppercase tracking-widest font-black opacity-60 mb-2">Live Jackpot Pool</h2>
              <p className="text-6xl font-black mb-8 tracking-tighter">${(stats.jackpot || 0).toLocaleString()}</p>
              <div className="space-y-4 font-black uppercase tracking-widest text-[10px]">
                 {[
                   { tier: 5, pct: 0.4 },
                   { tier: 4, pct: 0.35 },
                   { tier: 3, pct: 0.25 },
                 ].map((t) => (
                   <div key={t.tier} className="flex justify-between items-center opacity-80">
                      <span>{t.tier} Match ({t.pct * 100}%)</span>
                      <span className="text-xl font-black">${((stats.jackpot || 0) * t.pct).toLocaleString()}</span>
                   </div>
                 ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-8 bg-white/5 border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <Heart size={18} className="text-brand-emerald" />
                   Impact Partner
                </h2>
                <div className="flex items-center gap-5 mb-8">
                   <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">🌳</div>
                   <div>
                      <p className="font-black text-lg">{stats.activeCharity}</p>
                      <p className="text-xs text-brand-emerald font-black uppercase tracking-widest">{stats.charityPercentage}% Contribution</p>
                   </div>
                </div>
                <Link href="/charities" className="block w-full text-center py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] uppercase font-black tracking-widest hover:bg-white/10 transition-all">
                   Manage Cause
                </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Score Modal */}
      <AnimatePresence>
        {editingScore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingScore(null)} className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md" />
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative glass w-full max-w-md p-10 rounded-4xl border border-white/10 shadow-2xl"
             >
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-3xl font-black uppercase italic tracking-tighter">Edit Score</h2>
                   <button onClick={() => setEditingScore(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={24}/></button>
                </div>
                <form onSubmit={handleUpdateScore} className="space-y-8">
                   <div>
                      <label className="text-[10px] text-gray-500 uppercase font-black mb-4 block">New Stableford Score</label>
                      <input
                        type="number"
                        min="1" max="45"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full bg-white/5 border-2 border-white/5 rounded-2xl p-6 text-4xl font-black text-center focus:border-brand-gold outline-none"
                        autoFocus
                      />
                   </div>
                   <button type="submit" className="w-full py-5 rounded-2xl bg-brand-gold text-brand-dark font-black transition-all hover:scale-[1.02]">
                      Update Entry
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute requireSubscription>
      <DashboardContent />
    </ProtectedRoute>
  );
}
