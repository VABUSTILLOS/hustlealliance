"use client";

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSendFriendRequest, useRespondToFriendRequest } from "../hooks/useSocial";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import clsx from "clsx";

interface FriendButtonProps {
  userId: string;
  className?: string;
}

/**
 * Friend request button with proper state handling.
 * States: Add Friend → Request Sent → Accept Request / Friends
 */
export function FriendButton({ userId, className }: FriendButtonProps) {
  const currentUser = useCurrentUser();
  const sendRequest = useSendFriendRequest();
  const respondRequest = useRespondToFriendRequest();

  // Check friend request status between current user and this user
  const { data: friendStatus } = useQuery({
    queryKey: ["friend-status", currentUser?.id, userId],
    queryFn: async () => {
      const res = await fetch(
        `/api/friends/request?direction=incoming&limit=100`,
      );
      if (!res.ok) return { status: null, requestId: null };
      const incoming = await res.json();

      const outRes = await fetch(
        `/api/friends/request?direction=outgoing&limit=100`,
      );
      if (!outRes.ok) return { status: null, requestId: null };
      const outgoing = await outRes.json();

      // Check incoming: someone sent to current user
      const incomingReq = incoming.find(
        (r: { user: { id: string } }) => r.user?.id === userId,
      );
      if (incomingReq) {
        return {
          status: incomingReq.status,
          requestId: incomingReq.id,
          direction: "incoming" as const,
        };
      }

      // Check outgoing: current user sent to this user
      const outgoingReq = outgoing.find(
        (r: { user: { id: string } }) => r.user?.id === userId,
      );
      if (outgoingReq) {
        return {
          status: outgoingReq.status,
          requestId: outgoingReq.id,
          direction: "outgoing" as const,
        };
      }

      return { status: null, requestId: null };
    },
    enabled: !!currentUser?.id && currentUser.id !== userId,
    staleTime: 30_000,
  });

  const status = friendStatus?.status ?? null;
  const requestId = friendStatus?.requestId ?? null;
  const direction = friendStatus?.direction ?? null;

  const isLoading = sendRequest.isPending || respondRequest.isPending;

  const handleClick = useCallback(() => {
    if (isLoading) return;

    if (!status) {
      // No relationship — send request
      sendRequest.mutate(userId);
    } else if (status === "PENDING" && direction === "incoming" && requestId) {
      // They sent us a request — accept it
      respondRequest.mutate({ requestId, action: "accept" });
    } else if (status === "PENDING" && direction === "outgoing") {
      // We already sent a request — do nothing (or could cancel)
      return;
    }
  }, [isLoading, status, direction, requestId, userId, sendRequest, respondRequest]);

  if (!currentUser?.id || currentUser.id === userId) return null;

  let label: string;
  let buttonStyle: string;

  if (!status) {
    label = "Add Friend";
    buttonStyle = "bg-accent text-white hover:bg-accent/90";
  } else if (status === "PENDING" && direction === "outgoing") {
    label = "Request Sent";
    buttonStyle = "bg-surface-light text-muted border border-surface-light cursor-default";
  } else if (status === "PENDING" && direction === "incoming") {
    label = "Accept Request";
    buttonStyle = "bg-emerald-500 text-white hover:bg-emerald-600";
  } else if (status === "ACCEPTED") {
    label = "Friends ✓";
    buttonStyle = "bg-accent/10 text-accent border border-accent/30 cursor-default";
  } else {
    label = "Add Friend";
    buttonStyle = "bg-accent text-white hover:bg-accent/90";
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || (status === "PENDING" && direction === "outgoing") || status === "ACCEPTED"}
      className={clsx(
        "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 font-heading",
        buttonStyle,
        isLoading && "opacity-60 cursor-not-allowed",
        className,
      )}
    >
      {isLoading ? "..." : label}
    </button>
  );
}
