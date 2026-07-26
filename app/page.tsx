import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickPreviewCTA from './components/sections/QuickPreviewCTA';
import Pillars from './components/Pillars';
import MemberSpotlight from './components/sections/MemberSpotlight';
import ResourceLibrary from './components/sections/ResourceLibrary';
import Pricing from './components/sections/Pricing';
import FooterCTA from './components/sections/FooterCTA';

export default function Home() {
  return (
    <div className="    scroll-smooth bg-deep text-foreground font-body">
      <Navbar />
      <Hero />
      <QuickPreviewCTA />
      <Pillars />
      <MemberSpotlight />
      <ResourceLibrary />
      <Pricing />
      <FooterCTA />
    </div>
  );
}
