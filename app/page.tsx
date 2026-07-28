import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { HomepageLazySection } from './components/HomepageLazySection';

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="scroll-smooth bg-deep text-foreground font-body">
      <Navbar />
      <Hero />
      <HomepageLazySection name="QuickPreviewCTA" />
      <HomepageLazySection name="Pillars" />
      <HomepageLazySection name="TakeawayCards" />
      <HomepageLazySection name="MemberSpotlight" />
      <HomepageLazySection name="ResourceLibrary" />
      <HomepageLazySection name="GamificationSection" />
      <HomepageLazySection name="SpacesPreview" />
      <HomepageLazySection name="HabitsPreview" />
      <HomepageLazySection name="PlannerPreview" />
      <HomepageLazySection name="ValueProposition" />
      <HomepageLazySection name="Pricing" />
      <HomepageLazySection name="WallOfLove" />
      <HomepageLazySection name="FooterCTA" />
      <HomepageLazySection name="ActivityTicker" />
    </div>
  );
}
