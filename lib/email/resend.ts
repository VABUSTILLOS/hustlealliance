import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'hustlealliance@resend.dev';

export async function sendEmail(params: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.log(`[Email] DEMO → ${params.to}: "${params.subject}"`);
    return { id: `demo_${Date.now()}`, demo: true };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL, to: [params.to], subject: params.subject, html: params.html,
    });
    if (error) { console.error('[Email] Resend error:', error); return null; }
    return data;
  } catch (err) { console.error('[Email] Send failed:', err); return null; }
}

export function courseEnrollmentEmail(courseTitle: string, courseSlug: string) {
  return {
    subject: `Welcome to ${courseTitle}! 🚀`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0A0A0A;color:#fff;border-radius:12px">
      <h1 style="color:#FF3B30;margin-top:0">Hustle Alliance</h1>
      <h2>You're enrolled in <strong>${courseTitle}</strong>!</h2>
      <p>Get ready to level up. Your course is waiting.</p>
      <a href="https://hustlealliance.vercel.app/learning/${courseSlug}" style="display:inline-block;padding:12px 24px;background:#FF3B30;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0">Start Learning →</a>
      <p style="color:#8A8A8A;font-size:13px;margin-top:32px">Hustle Alliance</p></div>`,
  };
}

export function liveClassReminderEmail(title: string, startsAt: Date, meetingUrl: string) {
  const dateStr = startsAt.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
  return {
    subject: `🔴 "${title}" starts soon`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0A0A0A;color:#fff;border-radius:12px">
      <h1 style="color:#FF3B30;margin-top:0">Hustle Alliance</h1>
      <h2>Live class reminder</h2>
      <p><strong>${title}</strong> starts at ${dateStr}.</p>
      <a href="${meetingUrl}" style="display:inline-block;padding:12px 24px;background:#FF3B30;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0">Join Class →</a></div>`,
  };
}
