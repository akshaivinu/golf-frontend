"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Trophy, Heart, LogOut, User, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, signOut, loading } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Charity Hub", href: "/charities", icon: Heart },
        { name: "History", href: "/admin", icon: Trophy, admin: true },
    ];

    const handleSignOut = async () => {
        await signOut();
        router.push("/auth");
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 flex items-center justify-between px-8 ${
            scrolled ? "glass border-b border-white/5 shadow-2xl" : "bg-transparent"
        }`}>
            <Link href="/" className="flex items-center gap-2 text-2xl font-display font-black tracking-tighter group">
                <span className="text-brand-emerald group-hover:scale-110 transition-transform">GOLF</span>
                <span className="text-brand-gold">LOTTO</span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
                {user && navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`group flex items-center gap-2 text-[10px] uppercase tracking-widest font-black transition-all hover:text-brand-gold ${
                            pathname === link.href ? "text-brand-gold" : "text-gray-500"
                        }`}
                    >
                        <link.icon size={14} className="group-hover:animate-pulse" />
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-6">
                {!loading && (
                    user ? (
                        <div className="flex items-center gap-6">
                            <div className="hidden lg:flex flex-col items-end mr-2">
                                <span className="text-[9px] uppercase font-black text-gray-500 tracking-widest">Impact Member</span>
                                <span className="text-xs font-bold text-white/80">{user.email?.split('@')[0]}</span>
                            </div>
                            <button 
                                onClick={handleSignOut}
                                className="p-3 rounded-full glass border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/auth" className="px-8 py-2 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest transition-all hover:bg-white/5">
                                Sign In
                            </Link>
                            <Link href="/auth" className="px-8 py-2 rounded-full gold-gradient text-brand-dark text-xs font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.2)]">
                                <span className="flex items-center gap-2">
                                    <Sparkles size={14} />
                                    Join Now
                                </span>
                            </Link>
                        </div>
                    )
                )}
            </div>
        </nav>
    );
};

export default Navbar;
