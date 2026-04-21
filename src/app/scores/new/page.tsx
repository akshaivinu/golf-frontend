import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ScoreEntry() {
  const router = useRouter();
  const [score, setScore] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
        await api.post('/scores', {
            score_value: parseInt(score),
            score_date: date
        });
        router.push("/dashboard");
    } catch (err: any) {
        setError(err.message || "Failed to log score. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-8 transition-colors">
            ← Back to Dashboard
        </Link>

        <div className="glass rounded-3xl p-10 border border-white/5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-emerald/10 rounded-full blur-[80px]"></div>

            <div className="relative z-10">
                <h1 className="text-3xl font-display font-black mb-2">Log New Score</h1>
                <p className="text-gray-400 text-sm mb-8">Enter your latest Stableford score. Range: 1–45 points.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Stableford Score</label>
                        <input
                            type="number"
                            min="1"
                            max="45"
                            required
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            placeholder="e.g. 36"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold focus:outline-none focus:border-brand-gold transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Date of Play</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-gold transition-colors"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
                            isSubmitting 
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                            : "gold-gradient text-brand-dark hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                        }`}
                    >
                        {isSubmitting ? "Validating..." : "Log & Enter Draw"}
                    </button>
                    
                    <p className="text-[10px] text-gray-500 text-center uppercase tracking-tighter">
                        Adding a 6th score will automatically remove your oldest entry.
                    </p>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}
