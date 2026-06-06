import { Mic2, Music2, Film, PartyPopper, Camera, Crown } from "lucide-react";

const services = [
  { icon: Mic2, title: "Celebrity Bookings", desc: "Bollywood stars, international artists, athletes & influencers — secured end-to-end." },
  { icon: Music2, title: "Concert Production", desc: "Full-scale concert design from stage engineering to sound, lights & crowd flow." },
  { icon: Film, title: "Brand Activations", desc: "Launches, IP creation & celebrity-led campaigns that move audiences." },
  { icon: Camera, title: "Content & PR", desc: "Editorial-grade content capture, press strategy & social-first storytelling." },
  { icon: Crown, title: "VIP Hospitality", desc: "White-glove logistics, security, travel & accommodation for talent and guests." },
];

export const Services = () => (
  <section id="services" className="py-32 relative">
    <div className="container">
      <div className="max-w-2xl mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-4">What we do</p>
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          A full-spectrum <span className="text-gradient">creative force</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          From the first idea to the final encore, Vibeify handles every detail so your moment lives forever.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <div
            key={s.title}
            className="group relative p-8 rounded-3xl bg-gradient-card border border-border hover:border-primary/40 transition-all duration-500 overflow-hidden"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
            <div className="relative">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-primary mb-6 group-hover:scale-110 transition-transform">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="mt-6 h-px w-12 bg-gradient-primary group-hover:w-full transition-all duration-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
