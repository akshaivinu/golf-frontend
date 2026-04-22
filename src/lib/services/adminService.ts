import { api } from '@/lib/api';
import type { AdminDashboardStats, User, WinnerVerification } from '@/types';

export interface RevenueMetrics {
    subscriptions: {
        monthly: number;
        yearly: number;
        pastDue: number;
        canceled: number;
    };
    totalDraws: number;
    totalPaid: number;
}

/**
 * Fetch the top-level admin analytics stats.
 */
export async function getAdminStats(): Promise<AdminDashboardStats> {
    return api.get<AdminDashboardStats>('/admin/stats');
}

/**
 * Fetch revenue and subscription breakdown metrics.
 */
export async function getRevenueMetrics(): Promise<RevenueMetrics> {
    return api.get<RevenueMetrics>('/admin/analytics/revenue');
}

/**
 * Fetch all users with their subscriptions and scores.
 */
export async function getAllUsers(): Promise<User[]> {
    return api.get<User[]>('/admin/users');
}

/**
 * Assign a role to a user.
 */
export async function assignUserRole(userId: string, role: 'subscriber' | 'admin' | 'suspended'): Promise<User> {
    return api.put<User>(`/admin/users/${userId}/role`, { role });
}

/**
 * Suspend a user (sets role to 'suspended').
 */
export async function suspendUser(userId: string): Promise<User> {
    return api.put<User>(`/admin/users/${userId}/suspend`, {});
}

/**
 * Override a user's score value.
 */
export async function overrideScore(scoreId: string, score_value: number): Promise<any> {
    return api.put(`/admin/scores/${scoreId}`, { score_value });
}

/**
 * Fetch all pending winner verification claims.
 */
export async function getPendingClaims(): Promise<WinnerVerification[]> {
    return api.get<WinnerVerification[]>('/verifications/pending');
}

/**
 * Approve or reject a winner verification claim.
 */
export async function reviewClaim(id: string, status: 'approved' | 'rejected'): Promise<any> {
    return api.put(`/verifications/review/${id}`, { status });
}
