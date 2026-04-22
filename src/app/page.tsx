"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-dark">
      {/* Emotion-Led Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/emotion_led_winning_impact_background_1776757256483.png"
          alt="Impact and Prosperity"
          fill
          className="object-cover opacity-40 scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-brand-dark/90 via-transparent to-brand-dark" />
      </div>

      {/* Hero: Impact First */}
      <section className="relative z-10 pt-32 pb-20 px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-brand-emerald/30 bg-brand-emerald/10 text-brand-emerald text-sm font-black uppercase tracking-widest mb-12 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-emerald"></span>
          </span>
          $285,400 Raised & Counting
        </div>

        <h1 className="text-7xl md:text-9xl font-display font-black leading-tight tracking-tighter mb-8 animate-fade-in-up [animation-delay:200ms] italic">
          Forge Purpose.<br />
          <span className="text-brand-gold not-italic">Win Prosperity.</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 animate-fade-in-up [animation-delay:400ms] leading-relaxed">
          The first luxury gaming experience where your monthly round fuels global progress. 
          Enjoy precision analytics while <span className="text-brand-emerald font-bold">10% of every subscription</span> secures a future for our charity partners.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up [animation-delay:600ms]">
          <Link href="/signup" className="shimmer-btn px-12 py-5 rounded-2xl gold-gradient text-brand-dark font-black text-xl transition-all hover:scale-105 shadow-[0_20px_50px_rgba(212,175,55,0.3)]">
            Start Your Impact
          </Link>
          <Link href="/charities" className="px-12 py-5 rounded-2xl border border-white/20 glass font-black text-xl transition-all hover:bg-white/10 uppercase tracking-widest text-xs flex items-center justify-center">
            Explore Causes
          </Link>
        </div>
      </section>

      {/* Impact & Strategy Sections */}
      <section className="relative z-10 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-32 animate-fade-in-up [animation-delay:800ms]">
        
        {/* Step 1 */}
        <div className="glass p-8 rounded-3xl group border-white/5 transition-all hover:bg-white/10">
          <div className="text-gray-500 font-black text-6xl mb-4 opacity-20 group-hover:opacity-100 transition-opacity">01</div>
          <h3 className="text-xl font-bold mb-2">Subscribe</h3>
          <p className="text-gray-400 text-sm">Join the community. A fixed cut of every fee builds the grand prize pool.</p>
        </div>

        {/* Step 2 */}
        <div className="glass p-8 rounded-3xl group border-white/5 transition-all hover:bg-white/10">
          <div className="text-gray-500 font-black text-6xl mb-4 opacity-20 group-hover:opacity-100 transition-opacity">02</div>
          <h3 className="text-xl font-bold mb-2">Pick A Cause</h3>
          <p className="text-gray-400 text-sm">Select a charity. At least 10% of your fee goes directly to them, verified by us.</p>
        </div>

        {/* Step 3 */}
        <div className="glass p-8 rounded-3xl group border-white/5 transition-all hover:bg-white/10">
          <div className="text-gray-500 font-black text-6xl mb-4 opacity-20 group-hover:opacity-100 transition-opacity">03</div>
          <h3 className="text-xl font-bold mb-2">Log Scores</h3>
          <p className="text-gray-400 text-sm">Track your progress. Every score is a ticket to the massive monthly draw.</p>
        </div>

        {/* Step 4 */}
        <div className="glass p-8 rounded-3xl group border-brand-emerald/20 bg-brand-emerald/5 transition-all">
          <div className="text-brand-emerald font-black text-6xl mb-4 opacity-20 group-hover:opacity-100 transition-opacity">04</div>
          <h3 className="text-xl font-bold mb-2 text-brand-emerald">Win & Share</h3>
          <p className="text-gray-400 text-sm">Match the monthly numbers. Split the jackpot and watch your impact grow.</p>
        </div>

      </section>

      {/* Monthly Spotlight - Section 08 Compliance */}
      <section className="relative z-10 px-8 py-32 max-w-7xl mx-auto">
        <div className="glass rounded-[3rem] p-12 md:p-20 border border-brand-emerald/20 bg-brand-emerald/5 relative overflow-hidden flex flex-col lg:flex-row gap-16 items-center">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-emerald/10 rounded-full blur-[120px]"></div>
            
            <div className="lg:w-1/2 space-y-8 relative z-10 text-left">
                <div className="inline-block px-4 py-1 rounded-full border border-brand-emerald/30 text-brand-emerald text-[10px] font-black uppercase tracking-widest">
                    Monthly Spotlight
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-black leading-tight">
                    This Month, we're supporting <span className="text-brand-emerald italic text-white font-black">Green Fairways.</span>
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed font-medium">
                    Helping golf courses transition to 100% sustainable water management while reforesting surrounding areas. Join 1,200 other players in making an impact this month.
                </p>
                <Link href="/charities" className="inline-flex items-center gap-2 text-brand-gold font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
                    View Impact Partner Profile <span className="text-2xl">→</span>
                </Link>
            </div>

            <div className="lg:w-1/2 w-full aspect-square md:aspect-video rounded-4xl bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center text-8xl grayscale hover:grayscale-0 transition-all duration-700">
               🌳
            </div>
        </div>
      </section>

      {/* Floating Trust Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 glass px-6 py-3 rounded-full border border-brand-emerald/30 text-[10px] uppercase font-bold flex items-center gap-4 animate-fade-in-up [animation-delay:1200ms]">
         <span className="flex items-center gap-2 text-brand-emerald">
            <span className="w-1.1 h-1.1 bg-brand-emerald rounded-full"></span>
            Stripe Verified
         </span>
         <span className="w-px h-3 bg-white/20"></span>
         <span className="flex items-center gap-2 text-brand-gold">
            <span className="w-1.1 h-1.1 bg-brand-gold rounded-full"></span>
            100% Secure
         </span>
         <span className="w-px h-3 bg-white/20"></span>
         <span className="text-white/60">No Hidden Fees</span>
      </div>
    </div>
  );
}
