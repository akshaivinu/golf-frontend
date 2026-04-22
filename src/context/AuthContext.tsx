"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'subscriber' | 'admin' | 'suspended' | null;

interface UserProfile {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    charity_id: string | null;
    charity_percentage: number;
    total_impact: number;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    role: UserRole;
    isAdmin: boolean;
    isSubscriber: boolean;
    isAuthenticated: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('users')
        .select('id, email, name, role, charity_id, charity_percentage, total_impact')
        .eq('id', userId)
        .single();

    if (error) {
        console.warn('Could not fetch user profile:', error.message);
        return null;
    }
    return data as UserProfile;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = useCallback(async (currentUser: User | null) => {
        if (!currentUser) {
            setProfile(null);
            return;
        }
        const p = await fetchUserProfile(currentUser.id);
        setProfile(p);
    }, []);

    const refreshProfile = useCallback(async () => {
        if (user) await loadProfile(user);
    }, [user, loadProfile]);

    useEffect(() => {
        // Check active sessions on load
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            await loadProfile(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            await loadProfile(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [loadProfile]);

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
    };

    const role: UserRole = profile?.role ?? null;
    const isAdmin = role === 'admin';
    const isSubscriber = role === 'subscriber' || isAdmin; // admins are always "subscribers" for access purposes
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{
            user,
            session,
            profile,
            role,
            isAdmin,
            isSubscriber,
            isAuthenticated,
            loading,
            signOut,
            refreshProfile,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
