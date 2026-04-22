import { api } from '@/lib/api';
import type { Draw, DashboardStats } from '@/types';

/**
 * Fetch the current active draw data (used for user dashboard stats).
 */
export async function getActiveDraw(): Promise<DashboardStats> {
    return api.get<DashboardStats>('/draws/active');
}

/**
 * Fetch all historical draws (admin use).
 */
export async function getAllDraws(): Promise<Draw[]> {
    return api.get<Draw[]>('/draws');
}

/**
 * Run a draw simulation (admin only). Does NOT publish results.
 */
export async function runSimulation(draw_type: 'random' | 'algorithmic'): Promise<any> {
    return api.post('/draws/simulate', { draw_type });
}

/**
 * Publish a simulated draw result (admin only).
 */
export async function publishDraw(drawId: string): Promise<any> {
    return api.put(`/draws/${drawId}/publish`, {});
}
