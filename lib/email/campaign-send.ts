import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.EMAIL_FROM || 'hustlealliance@resend.dev';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hustlealliance.vercel.app';

export const isEmailDemoMode = !resend;

/** Rewrite <a href="..."> links to go through the click-tracking redirect, and append an open-tracking pixel. */
export function instrumentHtml(html: string, recipientId: string): string {
  const trackedHtml = html.replace(
    /href="(https?:\/\/[^"]+)"/g,
    (_match, url: string) => `href="${APP_URL}/api/email/track/click/${recipientId}?url=${encodeURIComponent(url)}"`,
  );
  const pixel = `<img src="${APP_URL}/api/email/track/open/${recipientId}" width="1" height="1" alt="" style="display:none" />`;
  return `${trackedHtml}${pixel}`;
}

export async function sendCampaignEmail(params: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.log(`[Email/Campaign] DEMO → ${params.to}: "${params.subject}"`);
    return { id: `demo_${Date.now()}`, demo: true };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.to],
      subject: params.subject,
      html: params.html,
    });
    if (error) {
      console.error('[Email/Campaign] Resend error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('[Email/Campaign] Send failed:', err);
    return null;
  }
}

/** Simple sequential batch sender with a small delay to respect rate limits. */
export async function sendBatch<T>(
  items: T[],
  sender: (item: T) => Promise<void>,
  delayMs = 120,
): Promise<void> {
  for (const item of items) {
    await sender(item);
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
  }
}
