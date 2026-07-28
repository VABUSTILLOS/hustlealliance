import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { HomepageLazySection } from './components/HomepageLazySection';

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="scroll-smooth bg-deep text-foreground font-body">
      <Navbar />
      <Hero />
      <HomepageLazySection importFn={() => import('./components/sections/QuickPreviewCTA')} />
      <HomepageLazySection importFn={() => import('./components/Pillars')} />
      <HomepageLazySection importFn={() => import('./components/TakeawayCards')} />
      <HomepageLazySection importFn={() => import('./components/sections/MemberSpotlight')} />
      <HomepageLazySection importFn={() => import('./components/sections/ResourceLibrary')} />
      <HomepageLazySection importFn={() => import('./components/sections/GamificationSection')} />
      <HomepageLazySection importFn={() => import('./components/sections/SpacesPreview')} />
      <HomepageLazySection importFn={() => import('./components/sections/HabitsPreview')} />
      <HomepageLazySection importFn={() => import('./components/sections/PlannerPreview')} />
      <HomepageLazySection importFn={() => import('./components/sections/ValueProposition')} />
      <HomepageLazySection importFn={() => import('./components/sections/Pricing')} />
      <HomepageLazySection importFn={() => import('./components/sections/WallOfLove')} />
      <HomepageLazySection importFn={() => import('./components/sections/FooterCTA')} />
      <HomepageLazySection importFn={() => import('./components/ActivityTicker')} />
    </div>
  );
}
