"use client";

import Link from "next/link";
import Image from "next/image";
import { resolveAvatarUrl } from "@/lib/utils/avatar";
import type { ChallengeCard as ChallengeCardType } from "./hooks/useChallenges";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  UPCOMING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  ENDED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  CANCELLED: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function ChallengeCard({ challenge }: { challenge: ChallengeCardType }) {
  const start = new Date(challenge.startDate);
  const end = new Date(challenge.endDate);
  const month = start.toLocaleString("en-US", { month: "short" });
  const day = start.getDate();
  const enrolled = (challenge.enrollments?.length ?? 0) > 0;

  return (
    <Link
      href={`/challenges/${challenge.slug}`}
      className="group block bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-200 hover:shadow-lg"
    >
      <div className="relative h-40 bg-gradient-to-br from-accent/20 to-accent/5 overflow-hidden">
        {challenge.coverImage ? (
          <Image
            src={challenge.coverImage}
            alt={challenge.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🏆</div>
        )}
        <div className="absolute top-3 left-3 bg-white dark:bg-gray-900 rounded-lg px-2 py-1 text-center shadow-md">
          <div className="text-xs font-bold text-accent uppercase">{month}</div>
          <div className="text-lg font-bold text-foreground leading-tight">{day}</div>
        </div>
        <div className="absolute top-3 right-3 flex gap-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm">
            {challenge.price > 0 ? `$${challenge.price.toFixed(0)}` : "Free"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm group-hover:text-accent transition-colors truncate">
              {challenge.title}
            </h3>
            <p className="text-xs text-muted mt-1 line-clamp-2">
              {challenge.description ?? "No description"}
            </p>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusColors[challenge.status] ?? statusColors.UPCOMING}`}>
            {challenge.status}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted mt-3">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {start.toLocaleDateString()} – {end.toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2">
            <Image
              src={resolveAvatarUrl(challenge.creator.avatar, challenge.creator.name)}
              alt={challenge.creator.name}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="text-xs text-muted truncate">{challenge.creator.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            {enrolled && (
              <span className="text-accent font-medium">Joined</span>
            )}
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              {challenge._count.enrollments}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
