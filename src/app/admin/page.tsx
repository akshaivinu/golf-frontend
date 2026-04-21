"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"draws" | "claims" | "charities">("draws");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [drawHistory, setDrawHistory] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === "draws") {
        api.get('/draws').then(setDrawHistory).catch(console.error);
    }
  }, [activeTab]);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
        const result = await api.post('/draws/simulate', {});
        setSimulationResult(result);
    } catch (err: any) {
        alert("Simulation failed: " + err.message);
    } finally {
        setIsSimulating(false);
    }
  };

  const publishDraw = async () => {
    if (!simulationResult) return;
    try {
        await api.post('/draws/publish', { numbers: simulationResult.numbers });
        alert("Draw published successfully!");
        setSimulationResult(null);
    } catch (err: any) {
        alert("Failed to publish: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
             <h1 className="text-4xl font-display font-black mb-2">Admin Command Center</h1>
             <p className="text-gray-400">Manage draws, verify winners, and coordinate charity payouts.</p>
          </div>
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
             {(["draws", "claims", "charities"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                    activeTab === tab ? "bg-brand-gold text-brand-dark" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
             ))}
          </div>
        </header>

        {activeTab === "draws" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass rounded-3xl p-10 border border-white/5">
               <h2 className="text-2xl font-bold mb-6">Monthly Draw Engine</h2>
               <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                     <p className="text-xs text-gray-400 uppercase font-bold mb-4">Draw Configuration</p>
                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                           <label className="block text-[10px] text-gray-500 uppercase mb-1">Draw Type</label>
                           <select className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-brand-gold">
                              <option>Random (Lottery)</option>
                              <option>Weighted (Frequency)</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-[10px] text-gray-500 uppercase mb-1">Target Date</label>
                           <input type="date" className="w-full bg-brand-dark border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-brand-gold" defaultValue="2024-04-30" />
                        </div>
                     </div>
                     <button 
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className="w-full py-4 rounded-xl gold-gradient text-brand-dark font-black transition-all hover:scale-[1.02]"
                     >
                        {isSimulating ? "Running Simulation..." : "Run Draw Simulation"}
                     </button>
                  </div>

                  {simulationResult && (
                    <div className="p-6 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/20 animate-fade-in-up">
                       <h3 className="text-brand-emerald font-bold mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-emerald"></span>
                          Simulation Results
                       </h3>
                       <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center">
                             <p className="text-[10px] text-gray-500 uppercase">Jackpot (5)</p>
                             <p className="text-lg font-black text-brand-gold">{simulationResult.winners.tier5}</p>
                          </div>
                          <div className="text-center">
                             <p className="text-[10px] text-gray-500 uppercase">Tier 4 (4)</p>
                             <p className="text-lg font-black">{simulationResult.winners.tier4}</p>
                          </div>
                          <div className="text-center">
                             <p className="text-[10px] text-gray-500 uppercase">Tier 3 (3)</p>
                             <p className="text-lg font-black">{simulationResult.winners.tier3}</p>
                          </div>
                       </div>
                       <button 
                         onClick={publishDraw}
                         className="w-full py-3 rounded-xl border border-brand-emerald text-brand-emerald font-bold hover:bg-brand-emerald hover:text-brand-dark transition-all"
                       >
                          Publish & Notify Winners
                       </button>
                    </div>
                  )}
               </div>
            </div>

            <div className="glass rounded-3xl p-10 border border-white/5">
               <h2 className="text-2xl font-bold mb-6">Draw History</h2>
               <div className="space-y-4">
                  {drawHistory.map((draw) => (
                    <div key={draw.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                       <div>
                          <p className="font-bold">{new Date(draw.draw_date).toLocaleDateString()} Draw</p>
                          <p className="text-xs text-gray-400">Status: {draw.status}</p>
                       </div>
                       <div className="flex gap-2">
                          {draw.drawn_numbers?.map((n: number) => (
                            <span key={n} className="w-6 h-6 rounded flex items-center justify-center bg-brand-dark text-[10px] font-bold border border-white/10">{n}</span>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === "claims" && (
           <div className="glass rounded-3xl p-10 border border-white/5">
              <h2 className="text-2xl font-bold mb-6">Pending Prize Claims</h2>
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/5">
                       <th className="pb-4">User</th>
                       <th className="pb-4">Draw</th>
                       <th className="pb-4">Match</th>
                       <th className="pb-4">Prize</th>
                       <th className="pb-4">Proof</th>
                       <th className="pb-4 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    <tr>
                       <td className="py-6 font-bold">John Doe</td>
                       <td className="py-6">Mar 2024</td>
                       <td className="py-6">4 of 5</td>
                       <td className="py-6 text-brand-gold font-bold">$1,240</td>
                       <td className="py-6"><button className="text-brand-emerald hover:underline font-bold">View Image</button></td>
                       <td className="py-6 text-right">
                          <button className="px-4 py-2 bg-brand-emerald text-brand-dark rounded-lg font-bold mr-2 hover:opacity-80">Approve</button>
                          <button className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg font-bold hover:bg-red-500 hover:text-white">Reject</button>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        )}
      </div>
    </div>
  );
}
