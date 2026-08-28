import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import HomepageSEO from './components/HomepageSEO';
import { HomepageLazySection } from './components/HomepageLazySection';
import ActivityTicker from './components/ActivityTicker';
import ExitIntentPopup from './components/ExitIntentPopup';

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="scroll-smooth bg-deep text-foreground font-body">
      <HomepageSEO />
      <Navbar />
      <Hero />
      {/* Value proposition — problem vs solution (moved before features) */}
      <HomepageLazySection name="ValueProposition" />
      {/* Features — "Everything you need to build" */}
      <HomepageLazySection name="Pillars" />
      {/* Stack equity timeline — Month 1 / Month 6 / Year 1 compounding */}
      <HomepageLazySection name="StackEvolutionTimeline" />
      {/* Free lessons — "Taste the knowledge before you commit" */}
      <HomepageLazySection name="QuickPreviewCTA" />
      {/* Social proof — testimonials */}
      <HomepageLazySection name="WallOfLove" />
      {/* Hero journey — gamification, XP, tiers */}
      <HomepageLazySection name="GamificationSection" />
      {/* Playbooks — resource library */}
      <HomepageLazySection name="ResourceLibrary" />
      {/* Accountability — journey, habits, planner, spaces */}
      <HomepageLazySection name="AccountabilitySection" />
      {/* FAQ — objection handling */}
      <HomepageLazySection name="FAQ" />
      {/* Pricing */}
      <HomepageLazySection name="Pricing" />
      {/* Activity toast ticker (renders nothing, manages toasts) */}
      <ActivityTicker />
      {/* Exit intent popup — catches abandoning visitors */}
      <ExitIntentPopup />
      {/* Footer */}
      <Footer />
    </div>
  );
}
