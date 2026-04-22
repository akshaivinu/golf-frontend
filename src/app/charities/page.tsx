"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Charity } from "@/types";

export default function CharityHub() {
  const [search, setSearch] = useState("");
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCharities() {
      try {
        const data = await api.get('/charities');
        setCharities(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCharities();
  }, []);

  const handleSelectCharity = async (charityId: string) => {
    try {
      await api.put('/charities/me/preference', { 
        charity_id: charityId,
        charity_percentage: 10 // Default minimum
      });
      alert("Charity selected successfully!");
    } catch (err: any) {
      alert("Failed to select charity: " + err.message);
    }
  };

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-emerald font-black uppercase tracking-widest animate-pulse">Consulting Impact Partners...</div>;
  if (error) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-brand-dark p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Hub Header */}
        <header className="mb-20 animate-fade-in-up">
          <div className="inline-block px-4 py-1 rounded-full border border-brand-emerald/30 text-brand-emerald text-[10px] font-black uppercase tracking-widest mb-6">
             Emotional Impact Directory
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black mb-6 leading-tight">
            Select Your <span className="text-brand-emerald italic">Legacy.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            Your subscription isn't just about winning—it's about giving. Choose a partner below and watch your monthly impact grow as you play.
          </p>
        </header>

        {/* Search Experience */}
        <div className="mb-16 animate-fade-in-up [animation-delay:200ms]">
          <div className="glass flex items-center px-8 py-5 rounded-3xl border border-white/5 max-w-2xl group focus-within:border-brand-emerald/40 transition-all">
             <span className="text-xl text-gray-500 mr-6 group-focus-within:text-brand-emerald transition-colors">🔍</span>
             <input 
                type="text"
                placeholder="Search by cause, name, or impact type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-white w-full text-lg placeholder:text-gray-600"
             />
          </div>
        </div>

        {/* Impact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up [animation-delay:400ms]">
           {filteredCharities.map((charity) => (
             <div key={charity.id} className="glass rounded-[40px] p-10 border border-white/5 transition-all hover:bg-white/10 group relative flex flex-col items-start text-left">
                {charity.is_featured && (
                  <div className="absolute top-8 right-8 bg-brand-gold text-brand-dark text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                    Priority Partner
                  </div>
                )}
                
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500">
                   {charity.images[0]}
                </div>
                
                <p className="text-[10px] uppercase font-black tracking-widest text-brand-emerald mb-2">{charity.impactCategory}</p>
                <h3 className="text-3xl font-black mb-4">{charity.name}</h3>
                <p className="text-brand-gold/80 italic font-medium mb-6">{charity.tagline}</p>
                <p className="text-gray-400 text-lg leading-relaxed mb-10 flex-grow">{charity.description}</p>
                
                <div className="w-full pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-end gap-6">
                   <div>
                      <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Measured Impact</p>
                      <p className="text-3xl font-black text-white">{charity.total_contributions?.toLocaleString() || '0'} total</p>
                   </div>
                    <div className="flex flex-col w-full gap-3">
                        <button 
                         onClick={() => handleSelectCharity(charity.id)}
                         className="w-full py-4 rounded-2xl bg-brand-emerald text-brand-dark font-black text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
                        >
                            Partner with {charity.name.split(' ')[0]}
                        </button>
                        <Link 
                            href={`/charities/${charity.id}`}
                            className="w-full text-center py-2 text-[10px] uppercase font-black tracking-widest text-gray-500 hover:text-white transition-colors"
                        >
                            Explore Impact Story →
                        </Link>
                    </div>
                </div>
             </div>
           ))}
        </div>

        {/* Global Transparency Note */}
        <div className="mt-24 p-12 rounded-[50px] bg-linear-to-r from-brand-surface to-brand-dark border border-white/5 text-center">
           <h2 className="text-2xl font-black mb-4">Total Transparency</h2>
           <p className="text-gray-500 text-sm max-w-xl mx-auto italic">
             Every cent of your contribution is audited monthly. We publish full transparency reports on charity payouts every month alongside our draw results. 
             If you have questions about where your money goes, <Link href="/transparency" className="text-brand-emerald hover:underline">read our charter.</Link>
           </p>
        </div>
      </div>
    </div>
  );
}
