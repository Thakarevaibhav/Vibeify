import { Quote } from "lucide-react";

const stories = [
  { quote: "Vibeify pulled off our brand launch with a level of sophistication we'd only seen abroad. Flawless from contract to encore.", name: "Ananya Iyer", role: "CMO, Aurum Watches" },
  { quote: "They turned our wedding into a concert we'll relive forever. Three A-list performers, zero stress on us.", name: "Rohan & Meera", role: "Private Clients" },
  { quote: "From contract to encore, the Vibeify team operated like a Swiss watch. The most professional agency we've worked with.", name: "DJ Kairo", role: "Headlining Artist" },
];

export const Testimonials = () => (
  <section className="py-32 relative">
    <div className="container">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">Voices</p>
        <h2 className="text-4xl md:text-6xl font-bold">Loved by <span className="text-gold">artists & clients alike</span></h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stories.map((s) => (
          <figure key={s.name} className="p-8 rounded-3xl bg-gradient-card border border-border relative hover:border-primary/40 transition-all">
            <Quote className="h-10 w-10 text-primary/40 mb-4" />
            <blockquote className="text-foreground/90 leading-relaxed mb-6">"{s.quote}"</blockquote>
            <figcaption>
              <div className="font-bold">{s.name}</div>
              <div className="text-sm text-muted-foreground">{s.role}</div>
              <div className="flex gap-1 mt-2">{[...Array(5)].map((_, i) => <span key={i} className="text-primary">★</span>)}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
