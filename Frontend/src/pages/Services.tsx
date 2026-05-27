import { PageHeader } from "@/components/vibeify/PageHeader";
import { Seo } from "@/components/vibeify/Seo";
import { Mic2, PartyPopper, Megaphone, Heart, Building2, Music2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Mic2, title: "Celebrity Booking",
    desc: "Direct access to actors, singers, DJs, athletes, influencers and creators across India and globally.",
    bullets: ["A-list & emerging talent", "Transparent fee structure", "Contracts & riders handled", "Exclusivity options"],
  },
  {
    icon: PartyPopper, title: "End-to-End Event Management",
    desc: "From the first concept sketch to the post-event highlight reel — one accountable team.",
    bullets: ["Stage, sound, lights & AV", "Crew, security & logistics", "Permits & insurance", "On-ground command"],
  },
  {
    icon: Megaphone, title: "Brand Promotions",
    desc: "Endorsements, IP creation and 360° celebrity campaigns built around the right star fit.",
    bullets: ["Talent matching", "Shoot production", "Media buying", "PR amplification"],
  },
  {
    icon: Heart, title: "Wedding Celebrity Appearances",
    desc: "Make your big day legendary with intimate performances and surprise red-carpet moments.",
    bullets: ["Sangeet headliners", "Baraat & DJ acts", "Bridal entry choreography", "Discreet hospitality"],
  },
  {
    icon: Building2, title: "Corporate Event Handling",
    desc: "Annual days, conferences, product unveils and IPO galas executed with executive precision.",
    bullets: ["C-suite hosting", "Keynote speakers", "Theme & set design", "VIP guest management"],
  },
  {
    icon: Music2, title: "Concerts & Live Shows",
    desc: "Stadium-scale tours and intimate club nights — full production & ticketing capability.",
    bullets: ["Venue partnerships", "Tour management", "Ticketing platforms", "Sponsorship sales"],
  },
];

const Services = () => (
  <>
    <Seo title="Services — Vibeify Celebrity & Event Management" description="Celebrity booking, event management, brand promotions, weddings, corporate events and live concerts — handled end-to-end by Vibeify." />

    <PageHeader
      eyebrow="What we do"
      title={<>A full-spectrum <span className="text-gold">creative force</span></>}
      subtitle="Six core services. One accountable team. Zero compromises."
    />

    <section className="py-20 container">
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((s) => (
          <article key={s.title} className="group p-8 md:p-10 rounded-3xl bg-gradient-card border border-border hover:border-primary/40 transition-all">
            <div className="flex items-start gap-5 mb-6">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-gold shrink-0 group-hover:scale-110 transition-transform">
                <s.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-2 mb-6">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-foreground/85">
                  <Check className="h-4 w-4 text-primary shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" asChild><Link to="/booking">Enquire about {s.title}</Link></Button>
          </article>
        ))}
      </div>
    </section>
  </>
);

export default Services;
