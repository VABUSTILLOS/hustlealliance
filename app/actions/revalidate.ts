'use server';

import { revalidatePath } from 'next/cache';

/**
 * On-demand revalidation for the homepage.
 * Call from webhooks, admin panels, or CMS integrations
 * to bust the ISR cache without waiting for the hourly cycle.
 */
export async function revalidateHomepage() {
  revalidatePath('/');
}
