import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Digital Heroes",
  description: "Learn how the Digital Heroes golf lottery works — scoring, monthly draws, prize tiers, and charity impact.",
};

const steps = [
  {
    number: "01",
    title: "Subscribe",
    description: "Join with a monthly or yearly plan. Your subscription funds the prize pool and directly powers charitable giving.",
    color: "text-brand-gold",
    bg: "bg-brand-gold/10 border-brand-gold/20",
  },
  {
    number: "02",
    title: "Log Your Scores",
    description: "After each round, enter your Stableford score (1–45). You store up to 5 scores — your latest 5 always count. Each score date must be unique.",
    color: "text-brand-emerald",
    bg: "bg-brand-emerald/10 border-brand-emerald/20",
  },
  {
    number: "03",
    title: "Enter the Monthly Draw",
    description: "Each month, 5 winning numbers are drawn. Your scores are matched against them. The more matches, the higher your prize tier.",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    number: "04",
    title: "Win & Impact",
    description: "Winners verify their identity by uploading proof. Your chosen charity receives a percentage of your winnings — minimum 10%.",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
  },
];

const tiers = [
  { matches: 5, label: "Jackpot", pct: "40%", desc: "Rolls over if no winner", highlight: true },
  { matches: 4, label: "Major Prize", pct: "35%", desc: "Split equally among winners", highlight: false },
  { matches: 3, label: "Entry Prize", pct: "25%", desc: "Split equally among winners", highlight: false },
];

const faqs = [
  {
    q: "What is a Stableford score?",
    a: "Stableford is a golf scoring system based on points per hole. Scores typically range from 1 to 45 for 18 holes. Higher is better.",
  },
  {
    q: "How are winning numbers chosen?",
    a: "Each month, admins run a draw using either a standard random selection or a hybrid algorithmic draw weighted by score frequency. Results are simulated first, then published.",
  },
  {
    q: "What happens if no one gets 5 matches?",
    a: "The 40% jackpot tier rolls over to the next month, growing until a 5-match winner claims it.",
  },
  {
    q: "How does charity giving work?",
    a: "At signup you choose a charity and set a contribution percentage (minimum 10%). This percentage of your prize winnings is donated automatically to your chosen charity.",
  },
  {
    q: "Can I change my charity?",
    a: "Yes — you can switch your Impact Partner and update your contribution percentage at any time from your Settings page.",
  },
  {
    q: "What if my subscription lapses?",
    a: "An active subscription is required to log scores and participate in draws. If your subscription lapses you will be redirected to resubscribe.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-brand-dark text-white">

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.08),transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-black mb-6">The System</p>
          <h1 className="text-6xl md:text-7xl font-display font-black tracking-tighter leading-none mb-6">
            How It <span className="italic text-brand-gold">Works</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A monthly golf lottery that turns your game into charitable impact. Transparent, fair, and rewarding.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.number} className={`glass rounded-[2rem] p-8 border ${step.bg} relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
                <div className="absolute -right-4 -top-4 text-8xl font-black opacity-5 select-none">{step.number}</div>
                <p className={`text-5xl font-black mb-6 ${step.color}`}>{step.number}</p>
                <h3 className="text-xl font-black mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Tiers */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-black mb-4">Prize Structure</p>
            <h2 className="text-4xl font-display font-black tracking-tighter">The Winning Tiers</h2>
          </div>
          <div className="space-y-4">
            {tiers.map((tier) => (
              <div key={tier.matches} className={`glass rounded-2xl p-8 border flex items-center justify-between ${tier.highlight ? "border-brand-gold/30 bg-brand-gold/5" : "border-white/5"}`}>
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${tier.highlight ? "bg-brand-gold text-brand-dark" : "bg-white/10 text-white"}`}>
                    {tier.matches}
                  </div>
                  <div>
                    <p className={`text-xl font-black ${tier.highlight ? "text-brand-gold" : "text-white"}`}>{tier.label}</p>
                    <p className="text-sm text-gray-500">{tier.matches} score matches · {tier.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-4xl font-black ${tier.highlight ? "text-brand-gold" : "text-white"}`}>{tier.pct}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">of prize pool</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Winners are split equally within each tier. The 5-match jackpot rolls over monthly if unclaimed.
          </p>
        </div>
      </section>

      {/* Score System */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-[2.5rem] p-12 border border-white/5">
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-emerald font-black mb-4">Score Rules</p>
              <h2 className="text-4xl font-display font-black tracking-tighter">The Score System</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { stat: "1–45", label: "Valid Score Range", desc: "Stableford points per 18-hole round" },
                { stat: "5 max", label: "Scores Stored", desc: "Oldest is auto-removed when you add a 6th" },
                { stat: "1 per day", label: "Unique Date Rule", desc: "One score entry per calendar date per user" },
              ].map((item) => (
                <div key={item.stat} className="text-center p-6 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-4xl font-black text-brand-emerald mb-2">{item.stat}</p>
                  <p className="font-black text-sm uppercase tracking-widest mb-2">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-black mb-4">FAQ</p>
            <h2 className="text-4xl font-display font-black tracking-tighter">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="glass rounded-2xl border border-white/5 group">
                <summary className="p-6 cursor-pointer font-black text-base list-none flex justify-between items-center hover:text-brand-gold transition-colors">
                  {faq.q}
                  <span className="text-gray-500 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-display font-black tracking-tighter mb-4">Ready to Play?</h2>
          <p className="text-gray-400 mb-10">Join Digital Heroes — where every round counts for something bigger.</p>
          <Link href="/subscribe" className="inline-block px-12 py-5 rounded-full gold-gradient text-brand-dark font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_60px_rgba(212,175,55,0.2)]">
            Start Your Subscription
          </Link>
        </div>
      </section>

    </main>
  );
}
