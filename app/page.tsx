import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pillars from './components/Pillars';
import MemberSpotlight from './components/sections/MemberSpotlight';
import ResourceLibrary from './components/sections/ResourceLibrary';
import Pricing from './components/sections/Pricing';
import FooterCTA from './components/sections/FooterCTA';

export default function Home() {
  return (
    <div className="scroll-smooth bg-deep text-white font-body">
      <Navbar />
      <Hero />
      <Pillars />
      <MemberSpotlight />
      <ResourceLibrary />
      <Pricing />
      <FooterCTA />
    </div>
  );
}
