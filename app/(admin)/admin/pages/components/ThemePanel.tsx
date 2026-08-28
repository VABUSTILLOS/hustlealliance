'use client';

import type { Theme } from '@/lib/pages/blocks';

const FONT_OPTIONS: { value: NonNullable<Theme>['headingFont']; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'bebas', label: 'Bebas Neue' },
  { value: 'mono', label: 'JetBrains Mono' },
];

/** Compact panel for editing a page's per-page theme overrides (background, accent, heading font). */
export function ThemePanel({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (theme: Theme) => void;
}) {
  const value = theme || {};

  return (
    <div className="p-4 border-t border-border/50">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Theme</h2>
      <label className="block mb-3">
        <span className="block text-xs font-medium text-muted mb-1.5">Background color</span>
        <input
          type="color"
          value={value.background || '#0b0b0f'}
          onChange={(e) => onChange({ ...value, background: e.target.value })}
          className="w-full h-9 rounded-lg bg-surface-light cursor-pointer"
        />
      </label>
      <label className="block mb-3">
        <span className="block text-xs font-medium text-muted mb-1.5">Accent color</span>
        <input
          type="color"
          value={value.accent || '#6366f1'}
          onChange={(e) => onChange({ ...value, accent: e.target.value })}
          className="w-full h-9 rounded-lg bg-surface-light cursor-pointer"
        />
      </label>
      <label className="block mb-1">
        <span className="block text-xs font-medium text-muted mb-1.5">Heading font</span>
        <select
          value={value.headingFont || 'inter'}
          onChange={(e) => onChange({ ...value, headingFont: e.target.value as NonNullable<Theme>['headingFont'] })}
          className="w-full px-3 py-2 bg-surface-light rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {FONT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
