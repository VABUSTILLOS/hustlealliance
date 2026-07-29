"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useEvent, useEventDiscussions, useAddEventDiscussion, useCancelEvent } from "../components/hooks/useEvents";
import EventHeader from "../components/EventHeader";
import EventTabs from "../components/EventTabs";
import RSVPButtons from "../components/RSVPButton";
import AttendeeList from "../components/AttendeeList";

type Tab = "details" | "discussion" | "attendees";

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useTranslation();
  const router = useRouter();
  const user = useCurrentUser();

  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [commentText, setCommentText] = useState("");

  const { data: event, isLoading, error } = useEvent(slug);
  const { data: discussions, isLoading: discussionsLoading } = useEventDiscussions(event?.id ?? "", 50);
  const addDiscussion = useAddEventDiscussion(event?.id ?? "");
  const cancelEventMutation = useCancelEvent();

  const isPastOrCancelled =
    event?.status === "ENDED" || event?.status === "CANCELLED";

  const isHost = user?.id === event?.creator?.id;
  const isAdmin = user?.role === "ADMIN";

  const handleCancel = async () => {
    if (!event || !confirm(t.events?.confirmCancel ?? "Are you sure you want to cancel this event?")) return;
    try {
      await cancelEventMutation.mutateAsync(event.id);
      router.refresh();
    } catch { /* error shown by mutation */ }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: event?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert(t.events?.linkCopied ?? "Link copied to clipboard!");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addDiscussion.mutateAsync(commentText.trim());
      setCommentText("");
    } catch { /* error shown by mutation */ }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-64 bg-[var(--color-surface)] rounded-2xl" />
        <div className="mt-6 space-y-4">
          <div className="h-8 bg-[var(--color-surface)] rounded w-1/2" />
          <div className="h-4 bg-[var(--color-surface)] rounded w-3/4" />
          <div className="h-4 bg-[var(--color-surface)] rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          {t.events?.notFound ?? "Event not found"}
        </h2>
        <p className="text-muted text-sm mb-4">
          {t.events?.notFoundDesc ?? "This event may have been removed or doesn't exist."}
        </p>
        <button
          onClick={() => router.push("/events")}
          className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold"
        >
          {t.events?.backToEvents ?? "Back to events"}
        </button>
      </div>
    );
  }

  const rsvpCount = event._count.rsvps;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Back link */}
      <button
        onClick={() => router.push("/events")}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        {t.events?.backToEvents ?? "Back to events"}
      </button>

      {/* Hero */}
      <EventHeader event={event} />

      {/* Actions row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 mb-6">
        <div className="flex items-center gap-3">
          <RSVPButtons
            eventId={event.id}
            userRSVP={null}
            isPastOrCancelled={isPastOrCancelled}
          />
          {isPastOrCancelled && (
            <span className="text-xs text-orange-500 font-medium">
              {event.status === "CANCELLED"
                ? (t.events?.cancelledBadge ?? "This event has been cancelled")
                : (t.events?.endedBadge ?? "This event has ended")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--color-border-subtle)] text-sm text-muted hover:text-foreground hover:border-accent/30 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {t.events?.share ?? "Share"}
          </button>
          {(isHost || isAdmin) && event.status !== "CANCELLED" && event.status !== "ENDED" && (
            <button
              onClick={handleCancel}
              disabled={cancelEventMutation.isPending}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-800 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              {cancelEventMutation.isPending
                ? (t.events?.cancelling ?? "Cancelling...")
                : (t.events?.cancelEvent ?? "Cancel Event")}
            </button>
          )}
        </div>
      </div>

      {/* Attending count */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
        <span>
          <strong>{rsvpCount}</strong> {t.events?.attending ?? "attending"}
        </span>
      </div>

      {/* Tabs */}
      <EventTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-3">{t.events?.about ?? "About this event"}</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted whitespace-pre-wrap">
                {event.description ?? t.events?.noDescription ?? "No description provided."}
              </div>
            </div>

            {/* Event info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-4">
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  {t.events?.dateAndTime ?? "Date & Time"}
                </h4>
                <p className="text-sm text-foreground">
                  {new Date(event.startDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted">
                  {new Date(event.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  {event.endDate && ` – ${new Date(event.endDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
                </p>
              </div>
              <div className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-4">
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  {t.events?.location ?? "Location"}
                </h4>
                <p className="text-sm text-foreground">
                  {event.location ?? (event.type === "ONLINE" ? "Online" : "TBA")}
                </p>
                {event.location && event.type === "ONLINE" && (
                  <a href={event.location} target="_blank" rel="noopener" className="text-sm text-accent hover:underline mt-1 block">
                    {t.events?.joinLink ?? "Join link"}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "discussion" && (
          <div className="space-y-4">
            {/* Comment form */}
            <form onSubmit={handleSubmitComment} className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                placeholder={t.events?.discussionPlaceholder ?? "Add a comment..."}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-sm text-foreground placeholder:text-muted resize-y focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!commentText.trim() || addDiscussion.isPending}
                  className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {addDiscussion.isPending
                    ? (t.events?.posting ?? "Posting...")
                    : (t.events?.postComment ?? "Post comment")}
                </button>
              </div>
            </form>

            {/* Discussions list */}
            {discussionsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-4 animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-border-subtle)]" />
                      <div className="h-3 bg-[var(--color-border-subtle)] rounded w-24" />
                    </div>
                    <div className="h-3 bg-[var(--color-border-subtle)] rounded w-full mb-2" />
                    <div className="h-3 bg-[var(--color-border-subtle)] rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : discussions && discussions.discussions.length > 0 ? (
              <div className="space-y-3">
                {discussions.discussions.map((d) => (
                  <div key={d.id} className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src={d.user.avatar ?? "https://api.dicebear.com/9.x/initials/svg?seed=User"}
                        alt={d.user.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{d.user.name}</p>
                        <p className="text-xs text-muted">
                          {new Date(d.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{d.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted">
                <p className="text-sm">{t.events?.noDiscussion ?? "No discussions yet. Start the conversation!"}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "attendees" && (
          <div>
            <div className="flex gap-2 mb-4">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/10 text-accent">
                {t.events?.all ?? "All"}
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-[var(--color-border-subtle)] transition-colors">
                {t.events?.rsvp?.going ?? "Going"}
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-[var(--color-border-subtle)] transition-colors">
                {t.events?.rsvp?.maybe ?? "Maybe"}
              </button>
            </div>
            <AttendeeList eventId={event.id} />
          </div>
        )}
      </div>
    </div>
  );
}
