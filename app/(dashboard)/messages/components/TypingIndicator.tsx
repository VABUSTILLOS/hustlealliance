"use client";

import { useTranslation } from '@/lib/i18n/useTranslation';

interface TypingIndicatorProps {
  names: string[];
}

export function TypingIndicator({ names }: TypingIndicatorProps) {
  const { t } = useTranslation();
  if (names.length === 0) return null;

  const text =
    names.length === 1
      ? `${names[0]} ${t.messages.isTyping}`
      : names.length === 2
        ? `${names[0]}, ${names[1]} ${t.messages.areTyping}`
        : t.messages.severalPeopleTyping;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
      <div className="flex gap-1">
        <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
        <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
        <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
      </div>
      <span>{text}</span>
    </div>
  );
}
