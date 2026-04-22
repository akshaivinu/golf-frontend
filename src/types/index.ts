/**
 * Digital Heroes - Global Type Definitions
 */

export type UserRole = 'subscriber' | 'admin' | 'suspended';

export interface Score {
    id: string;
    user_id: string;
    score_value: number;
    score_date: string;
    created_at: string;
}

export interface Subscription {
    id: string;
    user_id: string;
    status: 'active' | 'canceling' | 'past_due' | 'canceled' | 'inactive';
    plan: 'monthly' | 'yearly';
    period_end: string;
    stripe_sub_id?: string;
}

export interface Charity {
    id: string;
    name: string;
    description: string;
    tagline?: string;
    impactCategory?: string;
    images: string[];
    is_featured: boolean;
    total_raised?: number;
    total_contributions?: number;
    impact_stats?: Record<string, any>;
    events?: Array<{ title: string; date: string }>;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    charity_id?: string;
    charity_percentage: number;
    total_impact: number;
    subscriptions?: Subscription[];
    scores?: Score[];
    charities?: { name: string };
}

export interface Draw {
    id: string;
    draw_date: string;
    drawn_numbers: number[];
    draw_type: 'random' | 'algorithmic';
    status: 'pending' | 'published';
}

export interface DrawResult {
    id: string;
    draw_id: string;
    user_id: string;
    match_count: number;
    prize_amount: number;
    payment_status: 'pending' | 'paid';
    winner_verifications?: WinnerVerification[];
    draws?: Draw;
}

export interface WinnerVerification {
    id: string;
    draw_result_id: string;
    proof_file_url: string;
    admin_status: 'pending' | 'approved' | 'rejected';
    reviewed_at?: string;
    draw_results?: DrawResult;
}

/**
 * Flat structure returned by /draws/active — used on the user dashboard.
 * All fields are top-level (no nested participation object).
 */
export interface DashboardStats {
    matches: number;
    jackpot: number;
    charityDonated: number;
    activeCharity: string;
    charityPercentage: number;
    subscriptionStatus: string;
    renewalDate: string;
    activeNumbers: number[];
    drawsEntered: number;
    totalWon: number;
    pendingWinnings: number;
    nextDrawDate: string;
}

export interface AdminDashboardStats {
    totalUsers: number;
    totalPrizePool: number;
    totalCharityImpact: number;
    activeSubscribers: number;
}
