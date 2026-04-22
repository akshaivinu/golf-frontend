import { api } from '@/lib/api';
import type { Charity } from '@/types';

export interface CharityPayload {
    name: string;
    description: string;
    tagline?: string;
    imageUrl?: string;
    is_featured?: boolean;
}

/**
 * Fetch all charities (public).
 */
export async function getCharities(): Promise<Charity[]> {
    return api.get<Charity[]>('/charities');
}

/**
 * Get a single charity by ID.
 */
export async function getCharity(id: string): Promise<Charity> {
    return api.get<Charity>(`/charities/${id}`);
}

/**
 * Create a new charity (admin only).
 */
export async function createCharity(payload: CharityPayload): Promise<Charity> {
    return api.post<Charity>('/charities', payload);
}

/**
 * Update an existing charity (admin only).
 */
export async function updateCharity(id: string, payload: Partial<CharityPayload>): Promise<Charity> {
    return api.put<Charity>(`/charities/${id}`, payload);
}

/**
 * Delete a charity (admin only).
 */
export async function deleteCharity(id: string): Promise<void> {
    return api.delete(`/charities/${id}`);
}

/**
 * Update the current user's charity selection and contribution percentage.
 */
export async function updateCharityPreference(charity_id: string, charity_percentage: number): Promise<any> {
    return api.put('/charities/me/preference', { charity_id, charity_percentage });
}
