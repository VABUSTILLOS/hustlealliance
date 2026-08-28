"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminChallenge = {
  id: string;
  title: string;
  slug: string;
  status: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  _count: { tasks: number; enrollments: number };
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-surface-light text-muted",
  UPCOMING: "bg-blue-500/20 text-blue-400",
  ACTIVE: "bg-green-500/20 text-green-400",
  ENDED: "bg-gray-500/20 text-gray-400",
  CANCELLED: "bg-orange-500/20 text-orange-400",
};

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/challenges")
      .then((r) => r.json())
      .then((data) => setChallenges(data.challenges || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Challenges</h1>
          <p className="text-muted text-sm">Create and manage time-boxed community challenges.</p>
        </div>
        <Link
          href="/admin/challenges/new"
          className="px-4 py-2 bg-accent rounded-xl text-sm text-white font-medium hover:opacity-90 transition"
        >
          + New challenge
        </Link>
      </div>

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : challenges.length === 0 ? (
        <p className="text-muted text-sm">No challenges yet. Create your first one.</p>
      ) : (
        <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-light text-left text-muted">
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Price</th>
                <th className="p-4">Tasks</th>
                <th className="p-4">Participants</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((c) => (
                <tr key={c.id} className="border-b border-surface-light last:border-0">
                  <td className="p-4">
                    <Link href={`/admin/challenges/${c.id}`} className="text-foreground hover:text-accent font-medium">
                      {c.title}
                    </Link>
                    <p className="text-muted text-xs mt-1">/{c.slug}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[c.status] ?? statusColors.DRAFT}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted text-xs">
                    {new Date(c.startDate).toLocaleDateString()} – {new Date(c.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-foreground">
                    {c.price > 0 ? `$${c.price.toFixed(0)} ${c.currency}` : "Free"}
                  </td>
                  <td className="p-4 text-foreground">{c._count.tasks}</td>
                  <td className="p-4 text-foreground">{c._count.enrollments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
