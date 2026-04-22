"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Heart, CreditCard, ChevronRight, LogOut, Shield, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getSubscriptionStatus, cancelSubscription } from "@/lib/services/subscriptionService";
import { updateCharityPreference } from "@/lib/services/charityService";
import ProtectedRoute from "@/components/ProtectedRoute";
import type { Subscription } from "@/types";

function SettingsContent() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subStatus, setSubStatus] = useState<string>("none");
  const [loading, setLoading] = useState(true);
  const [impactPercent, setImpactPercent] = useState(10);
  const [updating, setUpdating] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSubscriptionStatus();
        setSubStatus(data.status);
        setSubscription(data.subscription);
        setImpactPercent(profile?.charity_percentage || 10);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profile]);

  const handleUpdateImpact = async () => {
    setUpdating(true);
    try {
      await updateCharityPreference(profile?.charity_id || "", impactPercent);
      await refreshProfile();
      alert("Impact settings updated!");
    } catch (err: any) {
      alert("Update failed: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Cancel your subscription? You'll keep access until the end of your billing period.")) return;
    setCanceling(true);
    try {
      const result = await cancelSubscription();
      setSubStatus("canceling");
      alert(`Subscription will end on ${new Date(result.period_end).toLocaleDateString()}.`);
    } catch (err: any) {
      alert("Failed to cancel: " + err.message);
    } finally {
      setCanceling(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-gold font-black uppercase tracking-widest animate-pulse">
      Accessing Secure Vault...
    </div>
  );

  const statusColor = {
    active: "text-brand-emerald",
    canceling: "text-yellow-400",
    past_due: "text-red-400",
    canceled: "text-gray-500",
    none: "text-gray-500",
  }[subStatus] || "text-gray-500";

  return (
    <div className="min-h-screen bg-brand-dark p-8 md:p-12 text-white">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-8 transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-display font-black mb-2">Platform Settings</h1>
          <p className="text-gray-400">Manage your identity, impact, and subscription.</p>
        </header>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2rem] p-8 border border-white/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-white/5 text-brand-gold"><User size={20} /></div>
              <h2 className="text-xl font-bold">Identity & Account</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Email Address</label>
                <p className="text-lg font-medium">{user?.email || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Subscription Tier</label>
                <p className={`text-lg font-medium capitalize ${statusColor}`}>
                  {subStatus === "none" ? "No Subscription" : subStatus}
                </p>
                {subscription?.period_end && (
                  <p className="text-[10px] text-gray-500 font-bold uppercase">
                    {subStatus === "canceling" ? "Ends" : "Renews"}: {new Date(subscription.period_end).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </motion.section>

          {/* Impact Section */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-[2rem] p-8 border border-white/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-white/5 text-brand-emerald"><Heart size={20} /></div>
              <h2 className="text-xl font-bold">Philanthropy Strategy</h2>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Voluntary Contribution (%)</label>
                  <span className="text-brand-emerald font-black text-xl">{impactPercent}%</span>
                </div>
                <input
                  type="range" min="10" max="100" step="5"
                  value={impactPercent} onChange={(e) => setImpactPercent(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-emerald"
                />
                <div className="flex justify-between mt-2 text-[8px] text-gray-600 uppercase font-black">
                  <span>Min. Requirement (10%)</span>
                  <span>Max Impact (100%)</span>
                </div>
              </div>
              <button
                onClick={handleUpdateImpact} disabled={updating}
                className="w-full py-4 rounded-2xl bg-brand-emerald text-brand-dark font-black uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {updating ? "Syncing..." : "Save Impact Settings"}
              </button>
            </div>
          </motion.section>

          {/* Subscription Management */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-[2rem] p-8 border border-white/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-white/5 text-blue-400"><CreditCard size={20} /></div>
              <h2 className="text-xl font-bold">Subscription Management</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2">Current Plan</p>
                <p className="text-xl font-black capitalize">{subscription?.plan || "None"}</p>
                <p className={`text-xs font-bold mt-1 ${statusColor}`}>{subStatus}</p>
              </div>
              {subStatus === "active" && (
                <button
                  onClick={handleCancelSubscription} disabled={canceling}
                  className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-all text-left group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle size={16} className="text-red-400" />
                    <p className="font-bold text-red-400">Cancel Subscription</p>
                  </div>
                  <p className="text-[10px] text-gray-500">Access continues until period end.</p>
                </button>
              )}
              {subStatus === "canceling" && (
                <div className="p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
                  <p className="font-bold text-yellow-400 mb-1">Cancellation Scheduled</p>
                  <p className="text-[10px] text-gray-500">Your access will end at the billing period end.</p>
                </div>
              )}
            </div>
          </motion.section>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/charities" className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-brand-emerald/10 text-brand-emerald"><Heart size={18}/></div>
                <div>
                  <p className="font-bold">Change Charity</p>
                  <p className="text-[10px] text-gray-500">Switch your Impact Partner</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-700"/>
            </Link>
            <button className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-brand-gold/10 text-brand-gold"><Shield size={18}/></div>
                <div>
                  <p className="font-bold">Privacy Controls</p>
                  <p className="text-[10px] text-gray-500">Manage data & cookies</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-700"/>
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full py-6 rounded-2xl bg-red-500/10 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all mt-4"
          >
            <LogOut size={18} />
            Sign Out of Session
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
