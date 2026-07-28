import { createClient } from '@vercel/edge-config';

/**
 * Vercel Edge Config client.
 * Reads feature flags and configuration at the edge with sub-millisecond latency.
 *
 * Usage:
 *   const featuredPosts = await getFeatureFlag('featuredPostIds');
 *   const maintenanceMode = await getFeatureFlag('maintenanceMode');
 *
 * Requires EDGE_CONFIG environment variable (auto-set by Vercel when Edge Config is linked).
 */

const edgeConfig = createClient(process.env.EDGE_CONFIG!);

/**
 * Read a feature flag or config value from Edge Config.
 * Falls back gracefully if Edge Config is not configured.
 */
export async function getFeatureFlag<T = string>(key: string): Promise<T | undefined> {
  try {
    if (!process.env.EDGE_CONFIG) return undefined;
    return await edgeConfig.get<T>(key);
  } catch {
    return undefined;
  }
}

/**
 * Read the list of featured post IDs for the community page.
 * These can be updated instantly via the Vercel Dashboard without a redeploy.
 */
export async function getFeaturedPostIds(): Promise<string[]> {
  return (await getFeatureFlag<string[]>('featuredPostIds')) ?? [];
}
