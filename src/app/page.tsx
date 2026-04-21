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
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold text-sm font-medium mb-12 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
          </span>
          Together we've raised $285,400 for global causes
        </div>

        <h1 className="text-6xl md:text-8xl font-display font-black leading-tight tracking-tight mb-8 animate-fade-in-up [animation-delay:200ms]">
          Change Lives.<br />
          <span className="text-brand-emerald italic">Win Big.</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-3xl mb-12 animate-fade-in-up [animation-delay:400ms]">
          A revolutionary platform where your monthly passion fuels global progress. 
          Enjoy precision score tracking while contributing <span className="text-brand-emerald font-bold">10% of every subscription</span> to a charity YOU choose.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up [animation-delay:600ms]">
          <Link href="/signup" className="px-10 py-4 rounded-full gold-gradient text-brand-dark font-black text-lg transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            Start Your Impact
          </Link>
          <Link href="/charities" className="px-10 py-4 rounded-full border border-white/20 glass font-bold text-lg transition-all hover:bg-white/10">
            Explore Charities
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
