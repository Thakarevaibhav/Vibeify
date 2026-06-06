import { Hero } from "@/components/vibeify/Hero";
import { Marquee } from "@/components/vibeify/Marquee";
import { EventTypes } from "@/components/vibeify/EventTypes";
import { FeaturedCelebrities } from "@/components/vibeify/FeaturedCelebrities";
import { Testimonials } from "@/components/vibeify/Testimonials";
import { CtaBanner } from "@/components/vibeify/CtaBanner";
import { Seo } from "@/components/vibeify/Seo";

const Index = () => (
  <>
    <Seo
      title="Vibeify — Celebrity Event Management & Booking Agency"
      description="India's premier luxury celebrity event management company. Book Bollywood stars, singers, DJs & influencers for concerts, corporate events & brand launches."
      canonical={typeof window !== "undefined" ? window.location.origin + "/" : undefined}
    />
    <Hero />
    {/* <Marquee /> */}
    <EventTypes />
    <FeaturedCelebrities />
    <Testimonials />
    <CtaBanner />
  </>
);

export default Index;
