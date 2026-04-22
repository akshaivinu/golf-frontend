"use client"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Trophy, Heart, Activity, BarChart3, Settings, Plus, Edit2, Trash2, CheckCircle, XCircle, X, ShieldCheck, Ban } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import * as adminService from "@/lib/services/adminService";
import * as drawService from "@/lib/services/drawService";
import * as charityService from "@/lib/services/charityService";
import ProtectedRoute from "@/components/ProtectedRoute";
import type { AdminDashboardStats, User, Draw, WinnerVerification, Charity } from "@/types";

type Tab = "draws" | "claims" | "users" | "charities" | "analytics";

function AdminContent() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("draws");
  const [drawType, setDrawType] = useState<"random" | "algorithmic">("random");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [drawHistory, setDrawHistory] = useState<Draw[]>([]);
  const [pendingClaims, setPendingClaims] = useState<WinnerVerification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [isAddingCharity, setIsAddingCharity] = useState(false);
  const [adminUpdating, setAdminUpdating] = useState(false);

  useEffect(() => { fetchTabData(); }, [activeTab]);

  const fetchTabData = async () => {
    try {
      if (activeTab === "draws") setDrawHistory(await drawService.getAllDraws());
      else if (activeTab === "claims") setPendingClaims(await adminService.getPendingClaims());
      else if (activeTab === "users") setUsers(await adminService.getAllUsers());
      else if (activeTab === "charities") setCharities(await charityService.getCharities());
      else if (activeTab === "analytics") setStats(await adminService.getAdminStats());
    } catch (err) { console.error(err); }
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const result = await drawService.runSimulation(drawType);
      setSimulationResult(result);
    } catch (err: any) {
      alert("Simulation failed: " + err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const handlePublish = async () => {
    if (!simulationResult?.id) return alert("Run a simulation first.");
    if (!confirm("Publish this draw? This cannot be undone.")) return;
    try {
      await drawService.publishDraw(simulationResult.id);
      alert("Draw published successfully.");
      setSimulationResult(null);
      fetchTabData();
    } catch (err: any) {
      alert("Publish failed: " + err.message);
    }
  };

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    try {
      await adminService.reviewClaim(id, status);
      setPendingClaims(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert("Failed to review: " + err.message);
    }
  };

  const handleAssignRole = async (userId: string, role: "subscriber" | "admin" | "suspended") => {
    try {
      await adminService.assignUserRole(userId, role);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
      if (selectedUser?.id === userId) setSelectedUser(prev => prev ? { ...prev, role } : null);
    } catch (err: any) {
      alert("Failed: " + err.message);
    }
  };

  const handleScoreOverride = async (scoreId: string, value: number) => {
    try {
      await adminService.overrideScore(scoreId, value);
    } catch (err: any) {
      alert("Override failed: " + err.message);
    }
  };

  const handleCharitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminUpdating(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const payload = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        imageUrl: formData.get("imageUrl") as string,
        is_featured: formData.get("is_featured") === "on",
      };
      if (selectedCharity) await charityService.updateCharity(selectedCharity.id, payload);
      else await charityService.createCharity(payload);
      setIsAddingCharity(false);
      setSelectedCharity(null);
      fetchTabData();
    } catch (err: any) {
      alert("Action failed: " + err.message);
    } finally {
      setAdminUpdating(false);
    }
  };

  const handleDeleteCharity = async (id: string) => {
    if (!confirm("Delete this charity? This cannot be undone.")) return;
    try {
      await charityService.deleteCharity(id);
      setCharities(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert("Delete failed.");
    }
  };

  const tabs = [
    { id: "draws", icon: Trophy, label: "Draws" },
    { id: "claims", icon: CheckCircle, label: "Claims" },
    { id: "users", icon: Users, label: "Users" },
    { id: "charities", icon: Heart, label: "Charities" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-brand-dark p-8 md:p-12 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-display font-black mb-2 flex items-center gap-3">
              <Settings className="text-brand-gold animate-spin-slow" /> Admin Command Center
            </h1>
            <p className="text-gray-400">Logged in as <span className="text-brand-gold font-bold">{profile?.email}</span></p>
          </div>
          <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? "bg-brand-gold text-brand-dark shadow-lg" : "text-gray-500 hover:text-white"}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="min-h-[60vh]">

            {/* DRAWS TAB */}
            {activeTab === "draws" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="glass rounded-[2rem] p-10 border border-white/5">
                  <h2 className="text-2xl font-bold mb-8">Monthly Draw Engine</h2>
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-brand-dark/50 border border-white/10">
                      <label className="block text-[10px] text-gray-500 uppercase font-black mb-3">Winning Strategy</label>
                      <select value={drawType} onChange={(e) => setDrawType(e.target.value as any)}
                        className="w-full bg-transparent border-b-2 border-white/10 py-2 font-black text-xl text-brand-gold focus:border-brand-gold outline-none">
                        <option value="random">Standard Random</option>
                        <option value="algorithmic">Hybrid Algorithmic</option>
                      </select>
                    </div>
                    <button onClick={handleSimulate} disabled={isSimulating}
                      className="w-full py-5 rounded-2xl bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/20 transition-all disabled:opacity-50">
                      {isSimulating ? "Simulating..." : "Run Simulation"}
                    </button>
                    {simulationResult && (
                      <div className="p-6 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/20 space-y-4">
                        <p className="text-brand-emerald font-black text-sm uppercase tracking-widest">Simulation Complete</p>
                        <div className="flex gap-2">
                          {simulationResult.drawn_numbers?.map((n: number) => (
                            <span key={n} className="w-10 h-10 rounded-lg bg-brand-emerald/20 border border-brand-emerald/30 flex items-center justify-center font-black text-brand-emerald">{n}</span>
                          ))}
                        </div>
                        <button onClick={handlePublish}
                          className="w-full py-4 rounded-2xl bg-brand-gold text-brand-dark font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                          Publish Results
                        </button>
                      </div>
                    )}
                  </div>
                </section>
                <section className="glass rounded-[2rem] p-10 border border-white/5 overflow-y-auto max-h-[600px]">
                  <h2 className="text-2xl font-bold mb-8">Historical Records</h2>
                  <div className="space-y-4">
                    {drawHistory.length > 0 ? drawHistory.map(draw => (
                      <div key={draw.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center hover:bg-white/10 transition-all">
                        <div>
                          <p className="font-bold">{new Date(draw.draw_date).toLocaleDateString([], { month: "long", year: "numeric" })}</p>
                          <p className="text-[10px] text-brand-emerald font-black uppercase">{draw.draw_type} · {draw.status}</p>
                        </div>
                        <div className="flex gap-2">
                          {draw.drawn_numbers?.map((n: number) => (
                            <span key={n} className="w-8 h-8 rounded-lg bg-brand-dark border border-white/10 flex items-center justify-center text-xs font-black">{n}</span>
                          ))}
                        </div>
                      </div>
                    )) : <p className="text-gray-500 italic">No draws recorded yet.</p>}
                  </div>
                </section>
              </div>
            )}

            {/* CLAIMS TAB */}
            {activeTab === "claims" && (
              <div className="glass rounded-[2rem] p-10 border border-white/5 overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead>
                    <tr className="text-[10px] uppercase font-black text-gray-500 tracking-widest border-b border-white/5">
                      <th className="pb-6">User</th><th className="pb-6">Match</th><th className="pb-6">Amount</th><th className="pb-6">Proof</th><th className="pb-6 text-right">Audit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingClaims.length === 0 && (
                      <tr><td colSpan={5} className="py-12 text-center text-gray-500 italic">No pending claims.</td></tr>
                    )}
                    {pendingClaims.map(claim => (
                      <tr key={claim.id} className="border-b border-white/5">
                        <td className="py-8 font-black">{claim.draw_results?.user_id?.slice(0, 8)}...</td>
                        <td className="py-8">{claim.draw_results?.match_count} of 5</td>
                        <td className="py-8 text-brand-gold font-black">${claim.draw_results?.prize_amount?.toLocaleString()}</td>
                        <td className="py-8"><a href={claim.proof_file_url} target="_blank" className="text-brand-emerald font-bold hover:underline">View Evidence</a></td>
                        <td className="py-8 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => handleReview(claim.id, "approved")} className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-xl hover:bg-brand-emerald hover:text-brand-dark transition-all"><CheckCircle size={18}/></button>
                            <button onClick={() => handleReview(claim.id, "rejected")} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><XCircle size={18}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
              <div className="glass rounded-[2rem] p-10 border border-white/5 overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                  <thead>
                    <tr className="text-[10px] uppercase font-black text-gray-500 tracking-widest border-b border-white/5">
                      <th className="pb-6">Member</th><th className="pb-6">Role</th><th className="pb-6">Subscription</th><th className="pb-6">Scores</th><th className="pb-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-white/5 group">
                        <td className="py-6">
                          <p className="font-black">{user.name || "Incognito"}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </td>
                        <td className="py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            user.role === "admin" ? "bg-brand-gold/20 text-brand-gold" :
                            user.role === "suspended" ? "bg-red-500/20 text-red-400" :
                            "bg-white/10 text-gray-400"
                          }`}>{user.role || "subscriber"}</span>
                        </td>
                        <td className="py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${user.subscriptions?.[0]?.status === "active" ? "bg-brand-emerald/20 text-brand-emerald" : "bg-red-500/10 text-red-500"}`}>
                            {user.subscriptions?.[0]?.status || "none"}
                          </span>
                        </td>
                        <td className="py-6 flex gap-1.5 pt-8">
                          {user.scores?.slice(0, 5).map((s: any, i: number) => (
                            <span key={i} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold">{s.score_value}</span>
                          ))}
                        </td>
                        <td className="py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setSelectedUser(user)} className="px-4 py-2 rounded-xl border border-brand-gold text-brand-gold text-[10px] font-black uppercase hover:bg-brand-gold hover:text-brand-dark transition-all">Manage</button>
                            {user.role !== "suspended" && (
                              <button onClick={() => handleAssignRole(user.id, "suspended")} className="p-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all" title="Suspend"><Ban size={14}/></button>
                            )}
                            {user.role === "suspended" && (
                              <button onClick={() => handleAssignRole(user.id, "subscriber")} className="p-2 rounded-xl border border-brand-emerald/30 text-brand-emerald hover:bg-brand-emerald/20 transition-all" title="Restore"><CheckCircle size={14}/></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CHARITIES TAB */}
            {activeTab === "charities" && (
              <div className="glass rounded-[2rem] p-10 border border-white/5">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold">Charity Impact Partners</h2>
                  <button onClick={() => { setSelectedCharity(null); setIsAddingCharity(true); }}
                    className="px-8 py-3 bg-brand-gold text-brand-dark font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 transition-all flex items-center gap-2">
                    <Plus size={16}/> Register New Partner
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {charities.map(charity => (
                    <div key={charity.id} className="glass p-8 rounded-3xl border border-white/5 hover:border-brand-emerald/30 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">🌳</div>
                          <div className="flex gap-2">
                            <button onClick={() => { setSelectedCharity(charity); setIsAddingCharity(true); }} className="p-2.5 bg-white/5 rounded-xl hover:text-brand-gold transition-colors"><Edit2 size={15}/></button>
                            <button onClick={() => handleDeleteCharity(charity.id)} className="p-2.5 bg-white/5 rounded-xl hover:text-red-500 transition-colors"><Trash2 size={15}/></button>
                          </div>
                        </div>
                        <h3 className="text-xl font-black mb-2">{charity.name}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2">{charity.description}</p>
                      </div>
                      <div className="pt-6 border-t border-white/5 flex justify-between items-center mt-4">
                        <p className="text-[10px] text-gray-500 uppercase font-black">Featured</p>
                        <div className={`w-3 h-3 rounded-full ${charity.is_featured ? "bg-brand-emerald animate-pulse" : "bg-white/20"}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Users", val: stats?.totalUsers ?? 0, color: "text-white" },
                    { label: "Active Subscribers", val: stats?.activeSubscribers ?? 0, color: "text-brand-emerald" },
                    { label: "Platform Yield", val: `$${(stats?.totalPrizePool ?? 0).toLocaleString()}`, color: "text-brand-gold" },
                    { label: "Net Charity Flow", val: `$${(stats?.totalCharityImpact ?? 0).toLocaleString()}`, color: "text-brand-emerald" },
                  ].map((card, i) => (
                    <div key={i} className="glass p-10 rounded-[2rem] border border-white/5">
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-3">{card.label}</p>
                      <p className={`text-4xl font-black ${card.color}`}>{card.val}</p>
                    </div>
                  ))}
                </div>
                <div className="glass rounded-[2rem] p-12 border border-white/5 flex items-center justify-center text-gray-600 italic text-lg">
                  Revenue breakdown chart — coming soon.
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* User Overrides Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative glass w-full max-w-2xl p-12 rounded-[2.5rem] border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">{selectedUser.name || "User"}</h2>
                <button onClick={() => setSelectedUser(null)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all"><X size={24}/></button>
              </div>
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs uppercase font-black text-gray-500 tracking-widest mb-4">Role Management</h3>
                  <div className="flex gap-3">
                    {(["subscriber", "admin"] as const).map(role => (
                      <button key={role} onClick={() => handleAssignRole(selectedUser.id, role)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedUser.role === role ? "bg-brand-gold text-brand-dark" : "bg-white/5 text-gray-400 hover:text-white"}`}>
                        <ShieldCheck size={12} className="inline mr-1.5" />{role}
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-xs uppercase font-black text-gray-500 tracking-widest mb-4">Score Overrides</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedUser.scores?.map((score: any) => (
                      <div key={score.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-gray-400 font-bold mb-1 uppercase">{new Date(score.score_date).toLocaleDateString()}</p>
                          <p className="text-2xl font-black">Score: {score.score_value}</p>
                        </div>
                        <input type="number" defaultValue={score.score_value} min="1" max="45"
                          className="w-16 bg-brand-dark border-2 border-white/10 rounded-xl p-3 text-center font-black focus:border-brand-gold outline-none"
                          onBlur={(e) => handleScoreOverride(score.id, parseInt(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        )}

        {/* Charity Add/Edit Modal */}
        {isAddingCharity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAddingCharity(false); setSelectedCharity(null); }} className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative glass w-full max-w-xl p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter">{selectedCharity ? "Edit Partner" : "New Impact Partner"}</h2>
              <form onSubmit={handleCharitySubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Partner Name</label>
                  <input name="name" required defaultValue={selectedCharity?.name} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold outline-none focus:border-brand-gold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Mission Bio</label>
                  <textarea name="description" required rows={3} defaultValue={selectedCharity?.description} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold outline-none focus:border-brand-gold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Image URL</label>
                  <input name="imageUrl" defaultValue={selectedCharity?.images?.[0]} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold outline-none focus:border-brand-gold" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" name="is_featured" defaultChecked={selectedCharity?.is_featured} className="w-5 h-5 accent-brand-emerald" />
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Set as Monthly Spotlight</label>
                </div>
                <button type="submit" disabled={adminUpdating} className="w-full py-5 rounded-2xl bg-brand-emerald text-brand-dark font-black tracking-widest uppercase hover:scale-[1.02] transition-all disabled:opacity-50">
                  {adminUpdating ? "Processing..." : selectedCharity ? "Update Partner" : "Register Partner"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}
