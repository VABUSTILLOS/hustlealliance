// ─── Template helpers ──────────────────────────────────────────────

function wrapHtml(title: string, content: string): string {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0A0A0A;color:#fff;border-radius:12px">
    <div style="text-align:center;margin-bottom:24px">
      <h1 style="color:#FF3B30;margin:0;font-size:20px;letter-spacing:2px">HUSTLE ALLIANCE</h1>
    </div>
    <h2 style="margin:0 0 12px;font-size:18px">${title}</h2>
    ${content}
    <hr style="border-color:#1A1A1A;margin:24px 0 12px" />
    <p style="color:#8A8A8A;font-size:12px;text-align:center">Hustle Alliance · LMS</p>
  </div>`;
}

function button(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;padding:12px 24px;background:#FF3B30;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0;font-size:14px">${text}</a>`;
}

// ─── Templates ─────────────────────────────────────────────────────

export function courseCompletionEmail(userName: string, courseTitle: string, courseSlug: string) {
  return {
    subject: `🎉 You completed ${courseTitle}!`,
    html: wrapHtml('Course Completed!',
      `<p>Way to go, <strong>${userName}</strong>!</p>
      <p>You just finished <strong>${courseTitle}</strong>. That's a huge achievement.</p>
      ${button('View Certificate', `https://hustlealliance.vercel.app/learning/${courseSlug}`)}
      <p style="color:#8A8A8A;font-size:13px">Keep the momentum going — check out your next course on the dashboard.</p>`
    ),
  };
}

export function certificateEarnedEmail(userName: string, courseTitle: string, certificateUrl: string) {
  return {
    subject: `📜 Your certificate for ${courseTitle} is ready`,
    html: wrapHtml('Certificate Earned!',
      `<p>Congratulations, <strong>${userName}</strong>!</p>
      <p>Your certificate for <strong>${courseTitle}</strong> has been issued.</p>
      ${button('Download Certificate', certificateUrl)}
      <p style="color:#8A8A8A;font-size:13px">Share it on LinkedIn to showcase your new skills.</p>`
    ),
  };
}

export function badgeEarnedEmail(badgeName: string, badgeIcon: string) {
  return {
    subject: `🏅 New badge earned: ${badgeName}`,
    html: wrapHtml('Badge Unlocked!',
      `<div style="text-align:center;font-size:48px;margin:16px 0">${badgeIcon}</div>
      <p>You just earned the <strong>${badgeName}</strong> badge!</p>
      <p>Keep learning to unlock more.</p>
      ${button('View Badges', 'https://hustlealliance.vercel.app/dashboard/badges')}`
    ),
  };
}

export function contentUnlockedEmail(lessonTitle: string, courseTitle: string, courseSlug: string) {
  return {
    subject: `🔓 New content unlocked: ${lessonTitle}`,
    html: wrapHtml('New Content Available',
      `<p>A new lesson <strong>"${lessonTitle}"</strong> is now unlocked in <strong>${courseTitle}</strong>.</p>
      <p>Jump back in and continue your journey.</p>
      ${button('Start Lesson', `https://hustlealliance.vercel.app/learning/${courseSlug}`)}`
    ),
  };
}

export function quizPassedEmail(lessonTitle: string, score: number, courseSlug: string) {
  return {
    subject: `✅ Quiz passed: ${lessonTitle} (${score}%)`,
    html: wrapHtml('Quiz Passed!',
      `<p>Great job! You scored <strong>${score}%</strong> on the quiz for <strong>"${lessonTitle}"</strong>.</p>
      <p>You're making excellent progress.</p>
      ${button('Continue Learning', `https://hustlealliance.vercel.app/learning/${courseSlug}`)}`
    ),
  };
}

export function xpMilestoneEmail(milestoneName: string, totalXP: number) {
  return {
    subject: `⚡ XP Milestone: ${totalXP} XP reached!`,
    html: wrapHtml('XP Milestone!',
      `<p>You've reached <strong>${totalXP} XP</strong> — that's the <strong>"${milestoneName}"</strong> milestone!</p>
      <p>Your dedication is showing. Keep it up.</p>
      ${button('View Dashboard', 'https://hustlealliance.vercel.app/dashboard')}`
    ),
  };
}
