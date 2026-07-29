"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import EventCreator from "../components/EventCreator";

export default function CreateEventPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
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

      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
        {t.events?.createEvent ?? "Create Event"}
      </h1>
      <p className="text-sm text-muted mb-8">
        {t.events?.createSubtitle ?? "Host a new event for the community"}
      </p>

      <EventCreator />
    </div>
  );
}
