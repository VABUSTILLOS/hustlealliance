import Link from "next/link";
import type { TrendingTopic } from "@/lib/db/community";

interface CommunitySidebarProps {
  trending: TrendingTopic[];
}

export function CommunitySidebar({ trending }: CommunitySidebarProps) {
  const links = [
    { label: "Groups", href: "/community/groups", icon: "👥" },
    { label: "Events", href: "/community/events", icon: "📅" },
    { label: "Messages", href: "/community/messages", icon: "💬" },
    { label: "Members", href: "/community/members", icon: "🙋" },
  ];

  return (
    <aside className="space-y-6">
      {/* Quick links */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5">
        <h3 className="font-heading font-bold text-[var(--color-foreground)] text-sm mb-4 uppercase tracking-wider">
          Quick Links
        </h3>
        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-light)] transition-colors"
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5">
          <h3 className="font-heading font-bold text-[var(--color-foreground)] text-sm mb-4 uppercase tracking-wider">
            🔥 Trending Spaces
          </h3>
          <div className="space-y-2">
            {trending.map((t) => (
              <Link
                key={t.space}
                href={`/spaces/${t.space}`}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[var(--color-surface-light)] transition-colors"
              >
                <span className="text-sm text-[var(--color-foreground-muted)] font-mono">
                  {t.space}
                </span>
                <span className="text-xs text-[var(--color-muted)] font-mono">
                  {t.postCount} posts
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Community stats card */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-5">
        <h3 className="font-heading font-bold text-[var(--color-foreground)] text-sm mb-4 uppercase tracking-wider">
          Community Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--color-surface-light)] rounded-xl p-3 text-center">
            <p className="font-display text-xl text-[var(--color-accent)]">2.4k</p>
            <p className="text-[10px] text-[var(--color-muted)] font-mono uppercase mt-1">
              Members
            </p>
          </div>
          <div className="bg-[var(--color-surface-light)] rounded-xl p-3 text-center">
            <p className="font-display text-xl text-[var(--color-accent)]">180+</p>
            <p className="text-[10px] text-[var(--color-muted)] font-mono uppercase mt-1">
              Guides
            </p>
          </div>
          <div className="bg-[var(--color-surface-light)] rounded-xl p-3 text-center">
            <p className="font-display text-xl text-[var(--color-accent)]">12</p>
            <p className="text-[10px] text-[var(--color-muted)] font-mono uppercase mt-1">
              Spaces
            </p>
          </div>
          <div className="bg-[var(--color-surface-light)] rounded-xl p-3 text-center">
            <p className="font-display text-xl text-[var(--color-accent)]">24/7</p>
            <p className="text-[10px] text-[var(--color-muted)] font-mono uppercase mt-1">
              Support
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
