import { prisma } from '@/lib/db/prisma';

export type BrandVoice = {
  tone: string;
  audience: string;
  guidelines: string;
};

export type EmailSender = {
  fromName: string;
  fromEmail: string;
};

export type ReferralRewardConfig = {
  percentOff: number;
  maxUses: number;
};

export const SETTINGS_KEYS = [
  'brandVoice',
  'emailSender',
  'referralReward',
  'installmentsEnabled',
  'seoDefaults',
  'socialLinks',
  'analyticsSnippet',
  'maintenanceMode',
  'globalHeader',
  'globalFooter',
] as const;

export type SettingKey = (typeof SETTINGS_KEYS)[number];

export const DEFAULT_BRAND_VOICE: BrandVoice = {
  tone: '',
  audience: '',
  guidelines: '',
};

export const DEFAULT_EMAIL_SENDER: EmailSender = {
  fromName: process.env.EMAIL_FROM_NAME || 'Hustle Alliance',
  fromEmail: process.env.EMAIL_FROM || 'hustlealliance@resend.dev',
};

export const DEFAULT_REFERRAL_REWARD: ReferralRewardConfig = {
  percentOff: 20,
  maxUses: 1,
};

export async function getSetting<T>(key: SettingKey, fallback: T): Promise<T> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  return (row?.value as T) ?? fallback;
}

export async function setSetting(key: SettingKey, value: unknown): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: value as object },
    create: { key, value: value as object },
  });
}

export async function getBrandVoice(): Promise<BrandVoice> {
  return getSetting('brandVoice', DEFAULT_BRAND_VOICE);
}

export async function getEmailSender(): Promise<EmailSender> {
  return getSetting('emailSender', DEFAULT_EMAIL_SENDER);
}

export async function getReferralReward(): Promise<ReferralRewardConfig> {
  return getSetting('referralReward', DEFAULT_REFERRAL_REWARD);
}
