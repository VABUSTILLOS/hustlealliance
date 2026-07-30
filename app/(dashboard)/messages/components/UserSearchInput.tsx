"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from '@/lib/i18n/useTranslation';

interface UserResult {
  id: string;
  name: string;
  username: string | null;
  avatar: string | null;
}

interface UserSearchInputProps {
  onSelect: (user: UserResult) => void;
  placeholder?: string;
  excludeIds?: string[];
}

export function UserSearchInput({
  onSelect,
  placeholder,
  excludeIds = [],
}: UserSearchInputProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchPlaceholder = placeholder ?? t.messages.searchUsersPlaceholder;

  const searchUsers = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=user&limit=5`);
        if (res.ok) {
          const data = await res.json();
          const users = (data.items || data.users || []).filter(
            (u: UserResult) => !excludeIds.includes(u.id),
          );
          setResults(users);
        }
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [excludeIds],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchUsers(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchUsers]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={searchPlaceholder}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
      />

      {isOpen && (results.length > 0 || isSearching || (query.length >= 2 && results.length === 0)) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border bg-background shadow-lg">
          {isSearching ? (
            <div className="p-3 text-center text-xs text-muted-foreground">{t.messages.searching}</div>
          ) : results.length === 0 ? (
            <div className="p-3 text-center text-xs text-muted-foreground">{t.messages.noUsersFound}</div>
          ) : (
            results.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onSelect(user);
                  setQuery("");
                  setIsOpen(false);
                  setResults([]);
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted/50"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium">{user.name}</p>
                  {user.username && (
                    <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
