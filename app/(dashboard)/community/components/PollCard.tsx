'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { PollData } from '@/lib/db/community';

interface PollCardProps {
  poll: PollData;
}

/**
 * Mighty Networks-style poll: vote buttons until the user votes (or the poll
 * expires), then animated result bars with percentages.
 */
export function PollCard({ poll }: PollCardProps) {
  const [options, setOptions] = useState(poll.options);
  const [totalVotes, setTotalVotes] = useState(poll.totalVotes);
  const [myVote, setMyVote] = useState<string | null>(poll.myVoteOptionId);
  const [voting, setVoting] = useState(false);

  const expired = poll.expiresAt ? new Date(poll.expiresAt) < new Date() : false;
  const showResults = myVote !== null || expired;

  const vote = async (optionId: string) => {
    if (voting || expired) return;
    const prevOptions = options;
    const prevTotal = totalVotes;
    const prevVote = myVote;

    // Optimistic update
    setOptions((opts) =>
      opts.map((o) => {
        if (o.id === optionId) return { ...o, votes: o.votes + 1 };
        if (o.id === prevVote) return { ...o, votes: Math.max(0, o.votes - 1) };
        return o;
      }),
    );
    if (!prevVote) setTotalVotes((t) => t + 1);
    setMyVote(optionId);
    setVoting(true);

    try {
      const res = await fetch('/api/community/polls/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId: poll.id, optionId }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOptions(data.options);
      setTotalVotes(data.totalVotes);
      setMyVote(data.myVoteOptionId);
    } catch {
      setOptions(prevOptions);
      setTotalVotes(prevTotal);
      setMyVote(prevVote);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="mb-3 rounded-xl border border-surface-light bg-surface-light/40 p-3">
      <p className="mb-2 text-sm font-heading font-bold text-foreground">{poll.question}</p>
      <div className="space-y-1.5">
        {options.map((option) => {
          const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isMine = option.id === myVote;

          if (!showResults) {
            return (
              <button
                key={option.id}
                onClick={() => vote(option.id)}
                disabled={voting}
                className="w-full rounded-lg border border-surface-light px-3 py-2 text-left text-xs text-foreground transition-colors hover:border-accent hover:bg-accent/5 disabled:opacity-50"
              >
                {option.text}
              </button>
            );
          }

          return (
            <div
              key={option.id}
              className={clsx(
                'relative overflow-hidden rounded-lg border px-3 py-2',
                isMine ? 'border-accent/60' : 'border-surface-light',
              )}
            >
              <div
                className={clsx(
                  'absolute inset-y-0 left-0 transition-all',
                  isMine ? 'bg-accent/20' : 'bg-surface-light/70',
                )}
                style={{ width: `${pct}%` }}
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-between text-xs">
                <span className={clsx('text-foreground', isMine && 'font-bold')}>
                  {option.text}
                  {isMine && <span className="ml-1 text-accent">✓</span>}
                </span>
                <span className="font-mono text-muted">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] font-mono text-muted">
        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        {expired && ' · Poll ended'}
        {!expired && poll.expiresAt && ` · Ends ${new Date(poll.expiresAt).toLocaleDateString()}`}
      </p>
    </div>
  );
}
