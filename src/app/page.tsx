import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import MiraculousJinalay from '@/components/home/MiraculousJinalay';
import FlowingBackground from '@/components/ui/FlowingBackground';
import SacredHistory from '@/components/home/SacredHistory';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Kuvala — discover 400+ years of heritage, temples, ancestors, and living traditions.',
};

export const revalidate = 3600;

export default async function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background relative">
      <HeroSection />
      
      {/* 
        The webgl background is fixed behind. The SacredHistory section 
        scrolls naturally but is transparent to reveal the flowing liquid behind it 
      */}
      <div className="relative w-full z-10">
        <FlowingBackground />
        <SacredHistory />
      </div>

      <MiraculousJinalay />
    </div>
  );
}
