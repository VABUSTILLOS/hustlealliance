import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — Hustle Alliance',
  description: 'Privacy policy for Hustle Alliance.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-foreground font-body">
      <div className="max-w-3xl mx-auto px-4 py-24">
        <Link href="/" className="text-sm text-accent hover:text-accent-glow transition-colors mb-8 inline-block">
          ← Back to Home
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground uppercase mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-zinc-300 text-sm leading-relaxed">
            Last updated: {new Date().getFullYear()}
          </p>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">1. Information We Collect</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              When you create an account with Hustle Alliance, we collect your name, email address, and any profile information you choose to provide. We also collect usage data to improve our platform and your experience.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">2. How We Use Your Information</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              We use your information to provide and improve our services, communicate with you about your account, and send you relevant content and updates. We never sell your personal data to third parties.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">3. Data Security</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              We implement industry-standard security measures to protect your data. Your information is stored securely and accessed only by authorized personnel.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-3">4. Contact</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              If you have any questions about this privacy policy, contact us at privacy@hustlealliance.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
