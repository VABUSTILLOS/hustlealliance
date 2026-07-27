import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickPreviewCTA from './components/sections/QuickPreviewCTA';
import Pillars from './components/Pillars';
import TakeawayCards from './components/TakeawayCards';
import MemberSpotlight from './components/sections/MemberSpotlight';
import ResourceLibrary from './components/sections/ResourceLibrary';
import GamificationSection from './components/sections/GamificationSection';
import SpacesPreview from './components/sections/SpacesPreview';
import HabitsPreview from './components/sections/HabitsPreview';
import PlannerPreview from './components/sections/PlannerPreview';
import ValueProposition from './components/sections/ValueProposition';
import Pricing from './components/sections/Pricing';
import WallOfLove from './components/sections/WallOfLove';
import FooterCTA from './components/sections/FooterCTA';
import ActivityTicker from './components/ActivityTicker';

export default function Home() {
  return (
    <div className="scroll-smooth bg-deep text-foreground font-body">
      <Navbar />
      <Hero />
      <QuickPreviewCTA />
      <Pillars />
      <TakeawayCards />
      <MemberSpotlight />
      <ResourceLibrary />
      <GamificationSection />
      <SpacesPreview />
      <HabitsPreview />
      <PlannerPreview />
      <ValueProposition />
      <Pricing />
      <WallOfLove />
      <FooterCTA />
      <ActivityTicker />
    </div>
  );
}
