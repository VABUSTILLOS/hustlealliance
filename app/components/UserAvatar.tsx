'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getInitialsAvatarUrl, normalizeAvatarUrl } from '@/lib/utils/avatar';

/** Default fallback generates initials SVG for "User". */
const DEFAULT_AVATAR = getInitialsAvatarUrl('User');

/**
 * Renders a user avatar with:
 * 1. URL normalization — maps old DiceBear/Unsplash URLs to local images
 * 2. Graceful error fallback — broken images fall back to initials SVG
 */
export function UserAvatar({
  src,
  name,
  size = 36,
  className = '',
}: {
  src: string | null | undefined;
  name: string;
  size?: number;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = hasError || !src
    ? getInitialsAvatarUrl(name)
    : normalizeAvatarUrl(src) ?? getInitialsAvatarUrl(name);

  return (
    <Image
      src={resolvedSrc}
      alt={name}
      width={size}
      height={size}
      className={`rounded-full border border-white/10 object-cover shrink-0 ${className}`}
      onError={() => setHasError(true)}
    />
  );
}
