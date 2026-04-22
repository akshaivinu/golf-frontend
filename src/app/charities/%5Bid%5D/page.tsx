"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Heart, Calendar, ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

export default function CharityProfile() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [charity, setCharity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);
  const [donationAmount, setDonationAmount] = useState("25");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api.get(`/charities/${id}`);
        setCharity(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  const handleDonate = async () => {
    setDonating(true);
    try {
        const { url } = await api.post('/charities/donate', { 
            charity_id: id, 
            amount: parseInt(donationAmount) 
        });
        window.location.href = url;
    } catch (err: any) {
        alert("Donation failed: " + err.message);
    } finally {
        setDonating(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-emerald font-black uppercase tracking-widest animate-pulse">Accessing Charity Files...</div>;
  if (!charity) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">Charity not found.</div>;

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Success Notification */}
      {searchParams.get('success') && (
        <div className="bg-brand-emerald text-brand-dark py-3 px-6 text-center font-black uppercase tracking-widest text-xs animate-slide-down">
          Donation Successful! Thank you for your impact.
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-12">
        <Link href="/charities" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Info & Impact */}
          <div className="space-y-12">
            <header>
               <h1 className="text-6xl font-display font-black mb-6 leading-tight">{charity.name}</h1>
               <p className="text-xl text-gray-400 leading-relaxed font-medium">
                  {charity.description}
               </p>
            </header>

            <div className="grid grid-cols-2 gap-6">
                <div className="glass p-8 rounded-3xl border border-white/5">
                   <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2">Total Contributions</p>
                   <p className="text-4xl font-black text-brand-emerald">${charity.total_contributions?.toLocaleString() || '0'}</p>
                </div>
                <div className="glass p-8 rounded-3xl border border-white/5">
                   <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2">Impact Status</p>
                   <p className="text-4xl font-black text-brand-gold">Verified</p>
                </div>
            </div>

            <section className="space-y-6">
               <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Calendar className="text-brand-gold" />
                  Upcoming Partner Events
               </h2>
               <div className="space-y-4">
                  {(charity.events || []).length > 0 ? (
                    charity.events.map((event: any, i: number) => (
                      <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                         <div>
                            <p className="font-bold text-lg">{event.title}</p>
                            <p className="text-xs text-gray-500 uppercase font-black">{new Date(event.date).toLocaleDateString()}</p>
                         </div>
                         <button className="p-3 bg-white/5 rounded-xl group-hover:text-brand-gold transition-colors"><ExternalLink size={18}/></button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic p-6 border border-dashed border-white/10 rounded-2xl text-center">No upcoming events scheduled.</p>
                  )}
               </div>
            </section>
          </div>

          {/* Right: Donation & Visuals */}
          <div className="space-y-8">
            <div className="relative aspect-video rounded-4xl overflow-hidden glass border border-white/10 group">
                {charity.images?.[0] ? (
                  <Image src={charity.images[0]} alt={charity.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-brand-emerald/20 to-brand-gold/10 flex items-center justify-center text-8xl">🌳</div>
                )}
            </div>

            <section className="glass rounded-[2.5rem] p-10 border border-brand-emerald/20 bg-brand-emerald/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Heart size={120} fill="currentColor" className="text-brand-emerald"/>
                </div>
                
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-6 italic">Support {charity.name} Directly</h2>
                    <p className="text-gray-400 text-sm mb-10 leading-relaxed">
                        A fixed 10% of every subscription always goes to your partner, but you can fuel their mission further with an independent one-time contribution.
                    </p>

                    <div className="space-y-6">
                        <div className="grid grid-cols-4 gap-3">
                            {["25", "50", "100", "250"].map((val) => (
                                <button 
                                    key={val}
                                    onClick={() => setDonationAmount(val)}
                                    className={`py-4 rounded-xl font-black text-sm transition-all border ${
                                        donationAmount === val ? "bg-brand-emerald text-brand-dark border-brand-emerald" : "bg-white/5 border-white/5 hover:border-brand-emerald/30"
                                    }`}
                                >
                                    ${val}
                                </button>
                            ))}
                        </div>
                        
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-bold">$</span>
                            <input 
                                type="number" 
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                                className="w-full bg-brand-dark/50 border border-white/5 rounded-2xl p-6 pl-12 text-2xl font-black focus:border-brand-emerald outline-none transition-all"
                            />
                        </div>

                        <button 
                            onClick={handleDonate}
                            disabled={donating}
                            className="w-full py-5 rounded-2xl bg-brand-emerald text-brand-dark font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all disabled:opacity-50"
                        >
                            {donating ? "Initiating Secure Portal..." : "Contribute Now"}
                        </button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase font-black">
                        <ShieldCheck size={14} className="text-brand-emerald"/>
                        100% Secure Transaction via Stripe
                    </div>
                </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
