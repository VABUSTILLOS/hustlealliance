"use client";

import { useState } from "react";
import { UserSearchInput } from "./UserSearchInput";
import { useRouter } from "next/navigation";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface UserResult {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
}

export function NewMessageModal({ isOpen, onClose, userId }: NewMessageModalProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSelectUser = async (user: UserResult) => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/messages/conversations/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (res.ok) {
        const conv = await res.json();
        router.push(`/messages/${conv.id}`);
        onClose();
      }
    } catch (err) {
      console.error("Failed to create conversation", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">New Message</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            ✕
          </button>
        </div>

        <div className="mb-2">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Search for a user
          </label>
          <UserSearchInput
            onSelect={handleSelectUser}
            placeholder="Type a name..."
            excludeIds={[userId]}
          />
        </div>

        {isCreating && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Creating conversation...
          </p>
        )}
      </div>
    </div>
  );
}
