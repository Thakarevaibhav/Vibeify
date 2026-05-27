import { PageHeader } from "@/components/vibeify/PageHeader";
import { Seo } from "@/components/vibeify/Seo";
import { Award, Globe, Shield, Heart, Sparkles, Users } from "lucide-react";

const values = [
  { icon: Shield, title: "Trust & Transparency", desc: "Every contract, fee and rider — open book. No surprises, ever." },
  { icon: Globe, title: "Global Network", desc: "Direct relationships with 500+ artists across India, GCC, UK & US." },
  { icon: Award, title: "Award-Winning Production", desc: "Three-time Event of the Year winner at the Indian Event Awards." },
  { icon: Heart, title: "Obsessive Care", desc: "Dedicated producer for every booking. We sweat the details so you don't." },
];

const About = () => (
  <>
    <Seo title="About Vibeify — Our Story, Mission & Vision" description="Vibeify is a luxury celebrity event management agency on a mission to deliver unforgettable star-led experiences across India and the world." />

    <PageHeader
      eyebrow="Our Story"
      title={<>The agency where <span className="text-gold">stars choose to work</span></>}
      subtitle="Founded in 2018 in Mumbai, Vibeify has grown from a 3-person boutique into India's most trusted celebrity event company — booking 1,200+ events across 40+ cities."
    />

    <section className="py-20 container">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="glass rounded-3xl p-10 space-y-6">
          <div className="flex items-center gap-3 text-gold">
            <Sparkles className="h-6 w-6" />
            <p className="uppercase tracking-[0.3em] text-sm font-semibold">Our Mission</p>
          </div>
          <p className="text-2xl font-display leading-snug">
            To deliver unforgettable celebrity experiences — the kind that move audiences, build brands and live in memory long after the lights go down.
          </p>
        </div>
        <div className="glass rounded-3xl p-10 space-y-6">
          <div className="flex items-center gap-3 text-gold">
            <Users className="h-6 w-6" />
            <p className="uppercase tracking-[0.3em] text-sm font-semibold">Our Vision</p>
          </div>
          <p className="text-2xl font-display leading-snug">
            To become Asia's most loved celebrity event agency — the bridge between iconic talent and people who deserve iconic moments.
          </p>
        </div>
      </div>
    </section>

    <section className="py-20 container">
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">Why Vibeify</p>
        <h2 className="text-4xl md:text-5xl font-bold">Built on four uncompromising principles</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v) => (
          <div key={v.title} className="p-8 rounded-3xl bg-gradient-card border border-border hover:border-primary/40 transition-all">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-gold mb-5"><v.icon className="h-6 w-6 text-primary-foreground" /></div>
            <h3 className="text-xl font-bold mb-2">{v.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </>
);

export default About;
