"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { TrendingUp, Heart, Trophy, Activity, Plus } from "lucide-react";

export default function Dashboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [scoresData, drawData] = await Promise.all([
          api.get('/scores'),
          api.get('/draws/active')
        ]);
        setScores(scoresData);
        setStats({
          matches: drawData.matches || 0,
          potentialPrize: drawData.estimatedPrize || 0,
          charityDonated: drawData.userCharityTotal || 0,
          activeCharity: drawData.charityName || "Select a Charity",
          subscriptionStatus: drawData.subscriptionStatus || "Active",
          totalPool: drawData.totalPool || 0
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-gold font-black uppercase tracking-widest animate-pulse">Loading Your Impact...</div>;
  if (error) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-brand-dark p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-display font-black mb-2 text-white">Welcome Back</h1>
            <p className="text-gray-400">Your score logging helps support <span className="text-brand-emerald font-bold">{stats.activeCharity}</span>.</p>
          </div>
          <div className="flex gap-4">
             <div className="glass px-6 py-3 rounded-2xl border-brand-emerald/20">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-black">Status</p>
                <p className="text-brand-emerald font-bold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-emerald animate-pulse"></span>
                  Impact Member
                </p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Matches", value: stats.matches, icon: Activity, color: "text-brand-emerald" },
            { label: "Est. Prize", value: `$${stats.potentialPrize?.toLocaleString()}`, icon: Trophy, color: "text-brand-gold" },
            { label: "Your Impact", value: `$${stats.charityDonated?.toLocaleString()}`, icon: Heart, color: "text-red-400" },
            { label: "Total Pool", value: `$${stats.totalPool?.toLocaleString()}`, icon: TrendingUp, color: "text-blue-400" },
          ].map((item, i) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-3xl border border-white/5 active:scale-95 transition-transform"
            >
               <div className={`p-3 rounded-2xl bg-white/5 w-fit mb-4 ${item.color}`}>
                  <item.icon size={20} />
               </div>
               <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1">{item.label}</p>
               <p className="text-2xl font-black text-white">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-surface to-brand-dark border border-white/5 p-10"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-emerald/5 rounded-full blur-[120px]"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Monthly Match Status</h2>
                  <span className="text-[10px] bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full uppercase font-black tracking-widest">Draw in Progress</span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-16">
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
                      <motion.span 
                         initial={{ opacity: 0, scale: 0.5 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="text-6xl font-black text-white"
                      >
                          {stats.matches}
                      </motion.span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest leading-tight">Active<br/>Matches</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 cursor-default hover:border-brand-emerald/30 transition-all">
                      <h3 className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-black">Winning Status</h3>
                      <p className="text-3xl font-black text-brand-emerald">{stats.matches >= 3 ? `Tier ${stats.matches} Qualified` : "Keep Tracking"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="glass rounded-3xl p-8 border-white/5">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-bold text-white">Recent Entries</h2>
                 <Link href="/scores/new" className="px-6 py-2 rounded-full border border-brand-emerald/50 text-brand-emerald text-[10px] uppercase font-black hover:bg-brand-emerald hover:text-brand-dark transition-all flex items-center gap-2">
                   <Plus size={14} />
                   Log Score
                 </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 {scores.map((score, index) => (
                   <motion.div 
                     key={score.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.7 + (index * 0.1) }}
                     whileHover={{ y: -5 }}
                     className="relative group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-brand-gold/5 transition-all text-center"
                   >
                     {index < stats.matches && (
                       <motion.div 
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-emerald shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                       />
                     )}
                     <p className="text-[9px] text-gray-500 uppercase font-black mb-2 tracking-widest">Entry {index + 1}</p>
                     <p className="text-3xl font-black mb-1 text-white group-hover:text-brand-gold transition-colors">{score.score_value}</p>
                     <p className="text-[9px] text-gray-600 uppercase font-bold tracking-tighter">
                        {new Date(score.score_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                     </p>
                   </motion.div>
                 ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass rounded-3xl p-8 relative overflow-hidden bg-linear-to-br from-brand-emerald/10 to-brand-surface border-brand-emerald/20"
            >
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                   <Heart size={18} className="text-brand-emerald" /> 
                   Impact Partner
                </h2>
                <div className="flex items-center gap-5 mb-8">
                   <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">🌳</div>
                   <div>
                      <p className="font-black text-lg text-white">{stats.activeCharity}</p>
                      <p className="text-xs text-brand-emerald font-black uppercase tracking-widest">Sustainability</p>
                   </div>
                </div>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between text-[10px] uppercase font-black text-gray-500 mb-2 tracking-widest">
                         <span>Contribution</span>
                         <span className="text-brand-emerald text-xs">${stats.charityDonated.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: "65%" }}
                           className="h-full bg-brand-emerald rounded-full"
                         />
                      </div>
                   </div>
                   <Link href="/charities" className="block w-full text-center py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] uppercase font-black tracking-widest hover:bg-white/10 transition-all text-white">
                      Change Cause
                   </Link>
                </div>
              </div>
            </motion.div>

            <div className="rounded-4xl bg-brand-gold p-10 text-brand-dark shadow-[0_20px_50px_rgba(212,175,55,0.2)]">
              <h2 className="text-[10px] uppercase tracking-widest font-black opacity-60 mb-2">Live Prize Pool</h2>
              <p className="text-6xl font-black mb-8 tracking-tighter">${stats.totalPool?.toLocaleString()}</p>
              
              <div className="space-y-4 font-black uppercase tracking-widest text-[10px]">
                 {[
                   { tier: 5, pct: 0.4 },
                   { tier: 4, pct: 0.35 },
                   { tier: 3, pct: 0.25 },
                 ].map((t) => (
                   <div key={t.tier} className="flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
                      <span>{t.tier} Match ({t.pct * 100}%)</span>
                      <span className="text-xl font-black">${(stats.totalPool * t.pct).toLocaleString()}</span>
                   </div>
                 ))}
              </div>
              
              <motion.div 
                key={stats.matches}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 p-6 rounded-3xl bg-brand-dark/10 border border-brand-dark/10 backdrop-blur-sm"
              >
                 <p className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Your Guaranteed Split</p>
                 <p className="text-3xl font-black italic">
                    {stats.matches >= 3 ? `$${(stats.totalPool * (stats.matches === 5 ? 0.4 : stats.matches === 4 ? 0.35 : 0.25) / 10).toFixed(2)}` : "$0.00"}
                 </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
