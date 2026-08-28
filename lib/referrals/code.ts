import prisma from '@/lib/db/prisma';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars (0/O, 1/I/L)

function randomCode(length = 7): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

/**
 * Generate a short, unique referral code. Retries on collision (extremely unlikely
 * given the alphabet size, but checked to satisfy the @unique constraint safely).
 */
export async function generateUniqueReferralCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    const existing = await prisma.user.findUnique({ where: { referralCode: code }, select: { id: true } });
    if (!existing) return code;
  }
  // Fallback: longer code to force uniqueness.
  return randomCode(10);
}

/**
 * Ensure a user has a referralCode, generating and persisting one if missing.
 * Call this from any user-creation path (signup, OAuth callback, admin user creation, etc.)
 * so every user can refer others.
 */
export async function ensureReferralCode(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
  if (user?.referralCode) return user.referralCode;

  const code = await generateUniqueReferralCode();
  await prisma.user.update({ where: { id: userId }, data: { referralCode: code } });
  return code;
}
