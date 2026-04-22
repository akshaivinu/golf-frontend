"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Trophy, LogOut, Settings, LayoutDashboard, Heart, ShieldCheck, Info, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAdmin, isSubscriber, loading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  // Build nav links based on auth state + role
  const publicLinks = [
    { name: "Charities", href: "/charities", icon: Heart },
    { name: "How It Works", href: "/how-it-works", icon: Info },
  ];

  const subscriberLinks = [
    { name: "Charities", href: "/charities", icon: Heart },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const adminLinks = [
    ...subscriberLinks,
    { name: "Admin", href: "/admin", icon: ShieldCheck },
  ];

  const navLinks = loading
    ? publicLinks
    : isAdmin
    ? adminLinks
    : isAuthenticated && isSubscriber
    ? subscriberLinks
    : publicLinks;

  // Right-side CTA button
  const CtaButton = () => {
    if (loading) return null;
    if (!isAuthenticated) {
      return (
        <Link
          href="/auth"
          className="px-6 py-2.5 rounded-full gold-gradient text-brand-dark font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 flex items-center gap-2"
        >
          <LogIn size={14} />
          Sign In
        </Link>
      );
    }
    if (!isSubscriber) {
      return (
        <Link
          href="/subscribe"
          className="px-6 py-2.5 rounded-full gold-gradient text-brand-dark font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
        >
          Subscribe
        </Link>
      );
    }
    return (
      <button
        onClick={handleSignOut}
        className="px-6 py-2.5 rounded-full border border-white/10 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:border-red-500/50 hover:text-red-400 transition-all flex items-center gap-2"
      >
        <LogOut size={14} />
        Sign Out
      </button>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-4" : "py-8"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass rounded-3xl md:rounded-full px-6 py-3 flex items-center justify-between border-white/5 shadow-2xl transition-all ${isScrolled ? "bg-brand-dark/80 backdrop-blur-xl" : "bg-transparent"}`}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Trophy size={20} className="text-brand-dark" />
            </div>
            <span className="font-display font-black text-xl tracking-tighter uppercase italic text-white">Digital Heroes</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-brand-gold ${isActive(link.href) ? "text-brand-gold" : "text-gray-400"}`}
              >
                {link.name}
              </Link>
            ))}
            <CtaButton />
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-white hover:bg-white/5 rounded-xl transition-all">
             {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 px-6 pt-2"
          >
            <div className="glass rounded-3xl p-8 border-white/10 shadow-2xl space-y-6">
               <div className="space-y-3">
                  {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive(link.href) ? "bg-brand-gold text-brand-dark font-black" : "bg-white/5 text-gray-400 hover:text-white"}`}
                    >
                        <link.icon size={20} />
                        <span className="font-black uppercase tracking-widest text-xs">{link.name}</span>
                    </Link>
                  ))}
               </div>
               <div onClick={() => setIsOpen(false)}>
                 <CtaButton />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
