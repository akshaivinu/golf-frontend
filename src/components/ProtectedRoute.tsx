"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    /** If set, the user must have this exact role (or admin) to access. */
    requiredRole?: 'subscriber' | 'admin';
    /** If true, the user must have an active subscription (checked via role). */
    requireSubscription?: boolean;
}

/**
 * ProtectedRoute — wraps pages that require auth or specific roles.
 *
 * Redirects:
 *  - No session          → /auth
 *  - Suspended user      → /auth?error=suspended
 *  - Needs subscription  → /subscribe
 *  - Needs admin role    → shows Access Denied inline
 */
export default function ProtectedRoute({
    children,
    requiredRole,
    requireSubscription = false,
}: ProtectedRouteProps) {
    const { isAuthenticated, role, isAdmin, isSubscriber, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated) {
            router.replace('/auth');
            return;
        }

        if (role === 'suspended') {
            router.replace('/auth?error=suspended');
            return;
        }

        if (requireSubscription && !isSubscriber) {
            router.replace('/subscribe');
            return;
        }
    }, [loading, isAuthenticated, role, isSubscriber, requireSubscription, router]);

    // Show nothing while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <div className="text-brand-gold font-black uppercase tracking-widest text-sm animate-pulse">
                    Verifying Access...
                </div>
            </div>
        );
    }

    // Not authenticated — will redirect
    if (!isAuthenticated || role === 'suspended') return null;

    // Subscription required but not subscribed — will redirect
    if (requireSubscription && !isSubscriber) return null;

    // Admin-only page but user isn't admin
    if (requiredRole === 'admin' && !isAdmin) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center p-8">
                <div className="glass rounded-3xl p-16 border border-red-500/20 text-center max-w-md">
                    <div className="text-6xl mb-6">🔒</div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-4 text-red-400">
                        Access Denied
                    </h1>
                    <p className="text-gray-400 text-sm">
                        You don't have the required permissions to view this page.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
