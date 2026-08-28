"use client";

import Link from "next/link";
import ChallengeForm from "../components/ChallengeForm";

export default function NewChallengePage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/challenges" className="text-muted hover:text-foreground text-xs">
          ← Back to challenges
        </Link>
        <h1 className="text-2xl font-heading font-bold text-foreground mt-2">New challenge</h1>
        <p className="text-muted text-sm">Set up dates, pricing, and daily tasks.</p>
      </div>
      <ChallengeForm />
    </div>
  );
}
