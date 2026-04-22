import { api } from '@/lib/api';
import type { Score } from '@/types';

/**
 * Fetch all scores for the authenticated user.
 */
export async function getScores(): Promise<Score[]> {
    return api.get<Score[]>('/scores');
}

/**
 * Submit a new score.
 * Business rule: max 5 scores per user — oldest is auto-removed by backend.
 */
export async function addScore(score_value: number, score_date: string): Promise<Score> {
    return api.post<Score>('/scores', { score_value, score_date });
}

/**
 * Update an existing score value.
 */
export async function updateScore(id: string, score_value: number): Promise<Score> {
    return api.put<Score>(`/scores/${id}`, { score_value });
}

/**
 * Delete a score.
 */
export async function deleteScore(id: string): Promise<void> {
    return api.delete(`/scores/${id}`);
}
