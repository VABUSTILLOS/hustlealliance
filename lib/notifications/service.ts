import prisma from '@/lib/db/prisma';
import { Prisma } from '@/lib/generated/prisma/client';
import { sendEmail } from '@/lib/email/resend';
import {
  courseCompletionEmail,
  certificateEarnedEmail,
  badgeEarnedEmail,
  contentUnlockedEmail,
  quizPassedEmail,
  xpMilestoneEmail,
} from '@/lib/email/templates';
import { courseEnrollmentEmail, liveClassReminderEmail } from '@/lib/email/resend';

type NotificationType =
  | 'COURSE_ENROLLED'
  | 'LESSON_COMPLETED'
  | 'BADGE_EARNED'
  | 'CERTIFICATE_ISSUED'
  | 'COURSE_EXPIRING'
  | 'LIVE_CLASS_REMINDER'
  | 'QUIZ_PASSED'
  | 'XP_MILESTONE'
  // ── Community social types ──
  | 'FOLLOWED'
  | 'POST_LIKED'
  | 'COMMENT_LIKED'
  | 'COMMENTED'
  | 'MENTIONED'
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPTED'
  | 'GROUP_INVITE'
  | 'GROUP_JOIN_REQUEST'
  | 'GROUP_POST'
  | 'EVENT_INVITE'
  | 'EVENT_REMINDER'
  | 'NEW_MESSAGE'
  | 'JOB_APPLICATION_UPDATE';

interface CreateNotificationParams {
  userId: string;
  userEmail: string;
  type: NotificationType;
  title: string;
  body: string;
  sourceId?: string;
  metadata?: Record<string, unknown>;
  sendEmailNow?: boolean;
  emailHtml?: string;
}

/** Create a DB notification row + optionally send an email via Resend */
export async function createNotification(params: CreateNotificationParams) {
  const { userId, userEmail, type, title, body, metadata, sendEmailNow, emailHtml } = params;

  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      sourceId: params.sourceId ?? null,
      metadata: (metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue,
    },
  });

  if (sendEmailNow && emailHtml && userEmail) {
    sendEmail({
      to: userEmail,
      subject: title,
      html: emailHtml,
    }).catch((err) => console.error('[Notifications] Email send failed:', err));
  }

  return notification;
}

// ─── Domain-specific notification helpers ──────────────────────────

export async function notifyCourseEnrollment(
  userId: string,
  userEmail: string,
  courseTitle: string,
  courseSlug: string,
) {
  const { subject, html } = courseEnrollmentEmail(courseTitle, courseSlug);
  return createNotification({
    userId, userEmail,
    type: 'COURSE_ENROLLED',
    title: subject,
    body: `You've been enrolled in ${courseTitle}. Start learning now!`,
    metadata: { courseSlug, courseTitle },
    sendEmailNow: true,
    emailHtml: html,
  });
}

export async function notifyCourseComplete(
  userId: string,
  userEmail: string,
  userName: string,
  courseTitle: string,
  courseSlug: string,
) {
  const { subject, html } = courseCompletionEmail(userName, courseTitle, courseSlug);
  return createNotification({
    userId, userEmail,
    type: 'COURSE_ENROLLED',
    title: subject,
    body: `Congratulations! You've completed ${courseTitle}.`,
    metadata: { courseSlug, courseTitle },
    sendEmailNow: true,
    emailHtml: html,
  });
}

export async function notifyCertificateEarned(
  userId: string,
  userEmail: string,
  userName: string,
  courseTitle: string,
  certificateUrl: string,
) {
  const { subject, html } = certificateEarnedEmail(userName, courseTitle, certificateUrl);
  return createNotification({
    userId, userEmail,
    type: 'CERTIFICATE_ISSUED',
    title: subject,
    body: `Your certificate for ${courseTitle} has been issued. Download it now!`,
    metadata: { courseTitle, certificateUrl },
    sendEmailNow: true,
    emailHtml: html,
  });
}

export async function notifyBadgeEarned(
  userId: string,
  userEmail: string,
  badgeName: string,
  badgeIcon: string,
) {
  const { subject, html } = badgeEarnedEmail(badgeName, badgeIcon);
  return createNotification({
    userId, userEmail,
    type: 'BADGE_EARNED',
    title: subject,
    body: `You earned the "${badgeName}" badge! Keep it up.`,
    metadata: { badgeName, badgeIcon },
    sendEmailNow: true,
    emailHtml: html,
  });
}

export async function notifyContentUnlocked(
  userId: string,
  userEmail: string,
  lessonTitle: string,
  courseTitle: string,
  courseSlug: string,
) {
  const { subject, html } = contentUnlockedEmail(lessonTitle, courseTitle, courseSlug);
  return createNotification({
    userId, userEmail,
    type: 'COURSE_ENROLLED',
    title: subject,
    body: `New content "${lessonTitle}" is now available in ${courseTitle}.`,
    metadata: { lessonTitle, courseSlug },
    sendEmailNow: true,
    emailHtml: html,
  });
}

export async function notifyQuizPassed(
  userId: string,
  userEmail: string,
  lessonTitle: string,
  score: number,
  courseSlug: string,
) {
  const { subject, html } = quizPassedEmail(lessonTitle, score, courseSlug);
  return createNotification({
    userId, userEmail,
    type: 'QUIZ_PASSED',
    title: subject,
    body: `You scored ${score}% on the quiz for "${lessonTitle}".`,
    metadata: { lessonTitle, score, courseSlug },
    sendEmailNow: true,
    emailHtml: html,
  });
}

export async function notifyXPMilestone(
  userId: string,
  userEmail: string,
  milestoneName: string,
  totalXP: number,
) {
  const { subject, html } = xpMilestoneEmail(milestoneName, totalXP);
  return createNotification({
    userId, userEmail,
    type: 'XP_MILESTONE',
    title: subject,
    body: `You've reached ${totalXP} XP and earned the "${milestoneName}" milestone!`,
    metadata: { milestoneName, totalXP },
    sendEmailNow: true,
    emailHtml: html,
  });
}

export async function notifyLiveClassReminder(
  userId: string,
  userEmail: string,
  classTitle: string,
  startsAt: Date,
  meetingUrl: string,
) {
  const { subject, html } = liveClassReminderEmail(classTitle, startsAt, meetingUrl);
  return createNotification({
    userId, userEmail,
    type: 'LIVE_CLASS_REMINDER',
    title: subject,
    body: `Your live class "${classTitle}" starts soon.`,
    metadata: { classTitle, meetingUrl },
    sendEmailNow: true,
    emailHtml: html,
  });
}

// ─── Community social notification helpers ──────────────────────────

export async function notifyFollowed(
  userId: string, userEmail: string,
  followerName: string, followerUsername: string,
) {
  return createNotification({
    userId, userEmail,
    type: 'FOLLOWED',
    title: 'New follower',
    body: `${followerName} started following you.`,
    sourceId: followerUsername,
    metadata: { followerName, followerUsername },
  });
}

export async function notifyPostLiked(
  userId: string, userEmail: string,
  likerName: string, postId: string, preview: string,
) {
  return createNotification({
    userId, userEmail,
    type: 'POST_LIKED',
    title: 'Post liked',
    body: `${likerName} liked your post.`,
    sourceId: postId,
    metadata: { likerName, postId, preview: preview.slice(0, 100) },
  });
}

export async function notifyCommentAdded(
  userId: string, userEmail: string,
  commenterName: string, postId: string, commentPreview: string,
) {
  return createNotification({
    userId, userEmail,
    type: 'COMMENTED',
    title: 'New comment',
    body: `${commenterName} commented on your post.`,
    sourceId: postId,
    metadata: { commenterName, postId, preview: commentPreview.slice(0, 100) },
  });
}

export async function notifyMentioned(
  userId: string, userEmail: string,
  mentionedByName: string, entityId: string, entityType: string,
) {
  return createNotification({
    userId, userEmail,
    type: 'MENTIONED',
    title: 'You were mentioned',
    body: `${mentionedByName} mentioned you in a ${entityType}.`,
    sourceId: entityId,
    metadata: { mentionedByName, entityId, entityType },
  });
}

export async function notifyFriendRequest(
  userId: string, userEmail: string,
  requesterName: string, friendshipId: string,
) {
  return createNotification({
    userId, userEmail,
    type: 'FRIEND_REQUEST',
    title: 'Friend request',
    body: `${requesterName} sent you a friend request.`,
    sourceId: friendshipId,
    metadata: { requesterName, friendshipId },
  });
}

export async function notifyFriendAccepted(
  userId: string, userEmail: string,
  friendName: string,
) {
  return createNotification({
    userId, userEmail,
    type: 'FRIEND_ACCEPTED',
    title: 'Friend request accepted',
    body: `${friendName} accepted your friend request.`,
    metadata: { friendName },
  });
}

export async function notifyGroupInvite(
  userId: string, userEmail: string,
  inviterName: string, groupName: string, groupId: string,
) {
  return createNotification({
    userId, userEmail,
    type: 'GROUP_INVITE',
    title: 'Group invitation',
    body: `${inviterName} invited you to join "${groupName}".`,
    sourceId: groupId,
    metadata: { inviterName, groupName, groupId },
  });
}

export async function notifyNewMessage(
  userId: string, userEmail: string,
  senderName: string, conversationId: string, preview: string,
) {
  return createNotification({
    userId, userEmail,
    type: 'NEW_MESSAGE',
    title: senderName,
    body: preview.slice(0, 150),
    sourceId: conversationId,
    metadata: { senderName, conversationId },
  });
}

export async function notifyEventReminder(
  userId: string, userEmail: string,
  eventTitle: string, eventId: string, startDate: Date,
) {
  return createNotification({
    userId, userEmail,
    type: 'EVENT_REMINDER',
    title: 'Event coming up',
    body: `"${eventTitle}" starts soon.`,
    sourceId: eventId,
    metadata: { eventTitle, eventId, startDate },
    sendEmailNow: true,
    emailHtml: `<p>Your event <strong>${eventTitle}</strong> is coming up!</p>`,
  });
}
