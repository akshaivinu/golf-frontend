import { api } from '@/lib/api';
import type { Subscription } from '@/types';

export interface SubscriptionStatusResponse {
    status: 'active' | 'canceling' | 'past_due' | 'canceled' | 'none';
    subscription: Subscription | null;
}

/**
 * Get the current user's subscription status.
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
    return api.get<SubscriptionStatusResponse>('/subscriptions/status');
}

/**
 * Start a Stripe checkout session for a new subscription.
 * Returns a redirect URL to Stripe Checkout.
 */
export async function createCheckout(plan: 'monthly' | 'yearly'): Promise<{ url: string }> {
    return api.post<{ url: string }>('/subscriptions/create-checkout', { plan });
}

/**
 * Cancel the current user's subscription at period end.
 */
export async function cancelSubscription(): Promise<{ message: string; period_end: string }> {
    return api.post('/subscriptions/cancel', {});
}
