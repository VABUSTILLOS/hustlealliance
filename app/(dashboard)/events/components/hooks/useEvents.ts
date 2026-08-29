"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { EventType, EventStatus, RSVPStatus } from "@/lib/generated/prisma/client";
import { getErrorMsg } from "@/lib/i18n/getErrorMsg";

// ── Types ──────────────────────────────────────────────────────────────

export type EventCard = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: EventType;
  status: EventStatus;
  location: string | null;
  startDate: string;
  endDate: string | null;
  coverImage: string | null;
  isFeatured: boolean;
  maxAttendees?: number | null;
  creator: { id: string; name: string; avatar: string | null; username?: string };
  _count: { rsvps: number };
};

export type EventDetail = EventCard & {
  group: { id: string; name: string; slug: string; avatar: string | null } | null;
  _count: { rsvps: number; discussions: number };
};

export type Attendee = {
  id: string;
  status: RSVPStatus;
  user: {
    id: string;
    name: string;
    username: string | null;
    avatar: string | null;
    headline: string | null;
  };
};

export type Discussion = {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; username: string | null; avatar: string | null };
};

export type EventListResponse = { events: EventCard[]; total: number };
export type DiscussionListResponse = { discussions: Discussion[]; total: number };

// ── Query Hooks ────────────────────────────────────────────────────────

export function useEvents(params?: {
  status?: EventStatus;
  type?: EventType;
  groupId?: string;
  search?: string;
  startDateFrom?: string;
  startDateTo?: string;
  limit?: number;
  cursor?: string;
}) {
  const queryString = new URLSearchParams();
  if (params?.status) queryString.set("status", params.status);
  if (params?.type) queryString.set("type", params.type);
  if (params?.groupId) queryString.set("groupId", params.groupId);
  if (params?.search) queryString.set("search", params.search);
  if (params?.startDateFrom) queryString.set("startDateFrom", params.startDateFrom);
  if (params?.startDateTo) queryString.set("startDateTo", params.startDateTo);
  if (params?.limit) queryString.set("limit", String(params.limit));
  if (params?.cursor) queryString.set("cursor", params.cursor);

  return useQuery<EventListResponse>({
    queryKey: ["events", params],
    queryFn: async () => {
      const res = await fetch(`/api/events?${queryString.toString()}`);
      if (!res.ok) throw new Error(getErrorMsg("fetchEvents"));
      return res.json();
    },
  });
}

export function useUpcomingEvents(limit = 3) {
  return useQuery<EventCard[]>({
    queryKey: ["events", "upcoming", limit],
    queryFn: async () => {
      const res = await fetch(`/api/events/upcoming?limit=${limit}`);
      if (!res.ok) throw new Error(getErrorMsg("fetchUpcomingEvents"));
      return res.json();
    },
  });
}

export function useEvent(slugOrId: string) {
  return useQuery<EventDetail>({
    queryKey: ["event", slugOrId],
    queryFn: async () => {
      const res = await fetch(`/api/events/${slugOrId}`);
      if (!res.ok) throw new Error(getErrorMsg("eventNotFound"));
      return res.json();
    },
    enabled: !!slugOrId,
  });
}

export function useUserEvents(userId: string, status?: RSVPStatus) {
  const queryString = new URLSearchParams();
  if (status) queryString.set("status", status);

  return useQuery<EventCard[]>({
    queryKey: ["userEvents", userId, status],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/events?${queryString.toString()}`);
      if (!res.ok) throw new Error(getErrorMsg("fetchUserEvents"));
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useEventAttendees(eventId: string, status?: RSVPStatus) {
  const queryString = new URLSearchParams();
  if (status) queryString.set("status", status);

  return useQuery<Attendee[]>({
    queryKey: ["eventAttendees", eventId, status],
    queryFn: async () => {
      const res = await fetch(`/api/events/${eventId}/rsvp?${queryString.toString()}`);
      if (!res.ok) throw new Error(getErrorMsg("fetchAttendees"));
      return res.json();
    },
    enabled: !!eventId,
  });
}

export function useEventDiscussions(eventId: string, limit = 20) {
  return useQuery<DiscussionListResponse>({
    queryKey: ["eventDiscussions", eventId, limit],
    queryFn: async () => {
      const res = await fetch(`/api/events/${eventId}/discussions?limit=${limit}`);
      if (!res.ok) throw new Error(getErrorMsg("fetchDiscussions"));
      return res.json();
    },
    enabled: !!eventId,
  });
}

// ── Mutation Hooks ─────────────────────────────────────────────────────

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? getErrorMsg("createEvent"));
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useRSVP(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (status: RSVPStatus) => {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? getErrorMsg("rsvp"));
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["event", eventId] });
      qc.invalidateQueries({ queryKey: ["eventAttendees", eventId] });
    },
  });
}

export function useCancelEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? getErrorMsg("cancelEvent"));
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useAddEventDiscussion(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/events/${eventId}/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? getErrorMsg("addComment"));
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["eventDiscussions", eventId] });
      qc.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
}
