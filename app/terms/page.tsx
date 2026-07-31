import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — Hustle Alliance',
  description: 'Terms of service for Hustle Alliance.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-foreground font-body">
      <div className="max-w-3xl mx-auto px-4 py-24">
        <Link href="/" className="text-sm text-accent hover:text-accent-glow transition-colors mb-8 inline-block">
          ← Back to Home
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-zinc-300 text-sm leading-relaxed">
            Last updated: {new Date().getFullYear()}
          </p>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">1. Acceptance of Terms</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              By accessing or using Hustle Alliance (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">2. Account Responsibilities</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">3. Membership &amp; Payments</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Paid memberships are billed on a recurring basis. You may cancel at any time. Refunds are available within 30 days of purchase as described in our refund policy. We reserve the right to modify pricing with advance notice.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">4. Community Guidelines</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Hustle Alliance is a community of founders. We expect all members to treat each other with respect. Harassment, spam, or sharing of others&apos; private information is strictly prohibited and may result in account termination.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">5. Limitation of Liability</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Hustle Alliance provides educational content and community resources. We do not guarantee business outcomes or investment results. The Platform is provided &ldquo;as is&rdquo; without warranties of any kind.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">6. Contact</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              For questions about these terms, contact us at legal@hustlealliance.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
