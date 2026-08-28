"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ChallengeForm from "../components/ChallengeForm";

type AdminChallengeDetail = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  status: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  maxParticipants: number | null;
  tasks: { id: string; dayNumber: number; title: string; description: string | null; sortOrder: number }[];
};

type RosterEntry = {
  id: string;
  user: { id: string; name: string; username: string | null; avatar: string | null; email: string };
  joinedAt: string;
  completedAt: string | null;
  tasksCompleted: number;
};

type Stats = { enrollmentCount: number; completedCount: number; completionRate: number; revenue: number };

export default function AdminChallengeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [challenge, setChallenge] = useState<AdminChallengeDetail | null>(null);
  const [roster, setRoster] = useState<{ totalTasks: number; roster: RosterEntry[] } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/challenges/${id}`).then((r) => r.json()),
      fetch(`/api/admin/challenges/${id}/roster`).then((r) => r.json()),
      fetch(`/api/admin/challenges/${id}/stats`).then((r) => r.json()),
    ])
      .then(([c, r, s]) => {
        setChallenge(c.challenge);
        setRoster(r);
        setStats(s);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <p className="text-muted text-sm">Loading…</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-4 md:p-8">
        <p className="text-red-500 text-sm">Challenge not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/challenges" className="text-muted hover:text-foreground text-xs">
          ← Back to challenges
        </Link>
        <h1 className="text-2xl font-heading font-bold text-foreground mt-2">{challenge.title}</h1>
        <p className="text-muted text-sm">/{challenge.slug}</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Enrollments" value={String(stats.enrollmentCount)} />
          <StatCard label="Completed" value={String(stats.completedCount)} />
          <StatCard label="Completion rate" value={`${stats.completionRate}%`} />
          <StatCard label="Revenue" value={`$${stats.revenue.toFixed(2)}`} />
        </div>
      )}

      <ChallengeForm
        challengeId={challenge.id}
        initialValues={{
          title: challenge.title,
          slug: challenge.slug,
          description: challenge.description ?? "",
          coverImage: challenge.coverImage ?? "",
          startDate: challenge.startDate,
          endDate: challenge.endDate,
          price: challenge.price,
          currency: challenge.currency,
          maxParticipants: challenge.maxParticipants != null ? String(challenge.maxParticipants) : "",
          status: challenge.status,
        }}
        initialTasks={challenge.tasks.map((t) => ({
          id: t.id,
          dayNumber: t.dayNumber,
          title: t.title,
          description: t.description ?? "",
          sortOrder: t.sortOrder,
        }))}
      />

      {roster && (
        <div className="mt-8 bg-surface border border-surface-light rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-surface-light">
            <h2 className="text-sm font-semibold text-foreground">Roster</h2>
          </div>
          {roster.roster.length === 0 ? (
            <p className="p-4 text-muted text-sm">No participants yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-light text-left text-muted">
                  <th className="p-4">Member</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Tasks completed</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {roster.roster.map((r) => (
                  <tr key={r.id} className="border-b border-surface-light last:border-0">
                    <td className="p-4 text-foreground">{r.user.name}</td>
                    <td className="p-4 text-muted text-xs">{new Date(r.joinedAt).toLocaleDateString()}</td>
                    <td className="p-4 text-foreground">
                      {r.tasksCompleted}/{roster.totalTasks}
                    </td>
                    <td className="p-4">
                      {r.completedAt ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-400">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-surface-light text-muted">
                          In progress
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-surface-light rounded-2xl p-4">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}
