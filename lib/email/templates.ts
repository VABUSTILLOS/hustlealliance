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

// ─── Community templates ───────────────────────────────────────────

const SITE_URL = 'https://hustlealliance.vercel.app';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function mentionedEmail(mentionedByName: string, entityType: string, entityId: string) {
  const url = entityType === 'post' ? `${SITE_URL}/community/posts/${entityId}` : `${SITE_URL}/community`;
  return {
    subject: `💬 ${mentionedByName} mentioned you`,
    html: wrapHtml('You were mentioned',
      `<p><strong>${escapeHtml(mentionedByName)}</strong> mentioned you in a ${escapeHtml(entityType)}.</p>
      ${button('View it now', url)}`
    ),
  };
}

export function commentReplyEmail(commenterName: string, postId: string, commentPreview: string) {
  return {
    subject: `💬 ${commenterName} commented on your post`,
    html: wrapHtml('New comment',
      `<p><strong>${escapeHtml(commenterName)}</strong> commented on your post:</p>
      <blockquote style="border-left:3px solid #FF3B30;padding-left:12px;color:#c0c0c0;margin:12px 0">${escapeHtml(commentPreview.slice(0, 200))}</blockquote>
      ${button('Reply', `${SITE_URL}/community/posts/${postId}`)}`
    ),
  };
}

export function groupInviteEmail(inviterName: string, groupName: string, groupId: string) {
  return {
    subject: `👥 ${inviterName} invited you to "${groupName}"`,
    html: wrapHtml('Group invitation',
      `<p><strong>${escapeHtml(inviterName)}</strong> invited you to join the group <strong>"${escapeHtml(groupName)}"</strong>.</p>
      ${button('View group', `${SITE_URL}/groups/${groupId}`)}`
    ),
  };
}

export interface DigestPost {
  id: string;
  authorName: string;
  excerpt: string;
  likeCount: number;
  commentCount: number;
  space?: string;
}

export function weeklyDigestEmail(userName: string, topPosts: DigestPost[], unreadCount: number, personalizedPosts: DigestPost[] = []) {
  const items = topPosts.map((p) => `
    <div style="padding:12px 0;border-bottom:1px solid #1A1A1A">
      <p style="margin:0 0 4px;color:#fff;font-size:14px"><strong>${escapeHtml(p.authorName)}</strong></p>
      <p style="margin:0 0 6px;color:#c0c0c0;font-size:13px">${escapeHtml(p.excerpt)}</p>
      <p style="margin:0;color:#8A8A8A;font-size:12px">❤️ ${p.likeCount} · 💬 ${p.commentCount} · <a href="${SITE_URL}/community/posts/${p.id}" style="color:#FF3B30;text-decoration:none">Read →</a></p>
    </div>`).join('');

  const personalItems = personalizedPosts.map((p) => `
    <div style="padding:12px 0;border-bottom:1px solid #1A1A1A">
      <p style="margin:0 0 4px;color:#fff;font-size:14px"><strong>${escapeHtml(p.authorName)}</strong></p>
      <p style="margin:0 0 6px;color:#c0c0c0;font-size:13px">${escapeHtml(p.excerpt)}</p>
      <p style="margin:0;color:#8A8A8A;font-size:12px">❤️ ${p.likeCount} · 💬 ${p.commentCount} · <a href="${SITE_URL}/community/posts/${p.id}" style="color:#FF3B30;text-decoration:none">Read →</a></p>
    </div>`).join('');

  return {
    subject: `📬 Your week on Hustle Alliance`,
    html: wrapHtml(`Hi ${escapeHtml(userName)}, here's your week`,
      `<p>You have <strong>${unreadCount}</strong> unread notification${unreadCount === 1 ? '' : 's'}.</p>
      <h3 style="margin:16px 0 4px;font-size:15px">🔥 Top posts this week</h3>
      ${items || '<p style="color:#8A8A8A;font-size:13px">Quiet week — be the first to post!</p>'}
      ${personalItems ? `<h3 style="margin:16px 0 4px;font-size:15px">✨ Picked for you</h3>${personalItems}` : ''}
      ${button('Open community', `${SITE_URL}/community`)}
      <p style="color:#8A8A8A;font-size:12px">Don't want these emails? Update your <a href="${SITE_URL}/settings/notifications" style="color:#8A8A8A">notification settings</a>.</p>`
    ),
  };
}
