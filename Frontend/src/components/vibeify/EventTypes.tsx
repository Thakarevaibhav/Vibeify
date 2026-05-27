import { Heart, Building2, GraduationCap, PartyPopper, Music2, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

const types = [
  { icon: Heart, title: "Weddings", desc: "Royal weddings & sangeets with celebrity performances and red-carpet glamour.", to: "/services" },
  { icon: Music2, title: "Concerts & Live Shows", desc: "Stadium-scale concerts with full production, ticketing and tour management.", to: "/services" },
  { icon: Building2, title: "Corporate Events", desc: "Annual days, conferences, product unveils — handled with executive precision.", to: "/services" },
  { icon: PartyPopper, title: "Private Parties", desc: "Birthdays, anniversaries & milestones with intimate celebrity appearances.", to: "/services" },
  { icon: Megaphone, title: "Brand Promotions", desc: "Endorsements, launches and campaigns built around the right star fit.", to: "/services" },
  { icon: GraduationCap, title: "College Fests", desc: "India's biggest campus shows — DJs, comedians, headliners.", to: "/services" },
];

export const EventTypes = () => (
  <section id="services" className="py-32 relative">
    <div className="container">
      <div className="max-w-2xl mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">What we craft</p>
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Every kind of <span className="text-gold">unforgettable</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Whatever the occasion, Vibeify produces it like a feature film — every detail intentional.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {types.map((s) => (
          <Link
            key={s.title}
            to={s.to}
            className="group relative p-8 rounded-3xl bg-gradient-card border border-border hover:border-primary/40 transition-all duration-500 overflow-hidden block"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
            <div className="relative">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-gold mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="mt-6 h-px w-12 bg-gradient-gold group-hover:w-full transition-all duration-500" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
