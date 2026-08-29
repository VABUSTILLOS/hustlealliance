import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/guard';
import {
  SETTINGS_KEYS,
  SettingKey,
  getSetting,
  setSetting,
  DEFAULT_BRAND_VOICE,
  DEFAULT_EMAIL_SENDER,
  DEFAULT_REFERRAL_REWARD,
} from '@/lib/settings';

export async function GET() {
  try {
    await requireAdmin();
    const settings: Record<SettingKey, unknown> = {
      brandVoice: await getSetting('brandVoice', DEFAULT_BRAND_VOICE),
      emailSender: await getSetting('emailSender', DEFAULT_EMAIL_SENDER),
      referralReward: await getSetting('referralReward', DEFAULT_REFERRAL_REWARD),
      installmentsEnabled: await getSetting('installmentsEnabled', false),
      seoDefaults: await getSetting('seoDefaults', { titleSuffix: '', description: '', ogImage: '' }),
      socialLinks: await getSetting('socialLinks', { twitter: '', instagram: '', youtube: '', tiktok: '', linkedin: '' }),
      analyticsSnippet: await getSetting('analyticsSnippet', { snippet: '' }),
      maintenanceMode: await getSetting('maintenanceMode', { enabled: false, message: '' }),
      globalHeader: await getSetting('globalHeader', []),
      globalFooter: await getSetting('globalFooter', []),
      aiDemoMode: await getSetting('aiDemoMode', false),
    };
    return NextResponse.json({ settings });
  } catch (err) {
    return authErrorResponse(err);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const key = body.key as SettingKey;
    if (!SETTINGS_KEYS.includes(key)) {
      return NextResponse.json({ error: `Unknown setting key: ${key}` }, { status: 400 });
    }
    await setSetting(key, body.value ?? null);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return authErrorResponse(err);
  }
}
