import { Calendar, MapPin } from "lucide-react";

const events = [
  { tag: "Music Festival", title: "Echoverse 2025", location: "Mumbai", date: "Dec 14, 2025", color: "from-primary/40 to-accent/40" },
  { tag: "Brand Launch", title: "Aurum Watches Gala", location: "Dubai", date: "Nov 02, 2025", color: "from-secondary/40 to-primary/30" },
  { tag: "Award Show", title: "Vibe Choice Awards", location: "Delhi", date: "Mar 22, 2026", color: "from-primary/40 to-secondary/30" },
];

export const Events = () => (
  <section id="events" className="py-32 relative">
    <div className="container">
      <div className="max-w-2xl mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-4">Signature Events</p>
        <h2 className="text-4xl md:text-6xl font-bold">
          Productions that <span className="text-gradient">define culture</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {events.map((e) => (
          <article
            key={e.title}
            className={`group relative overflow-hidden rounded-3xl p-8 md:p-10 min-h-[320px] flex flex-col justify-between bg-gradient-to-br ${e.color} border border-border hover:border-primary/50 transition-all`}
          >
            <div className="absolute inset-0 bg-card/60 backdrop-blur-sm" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary/30 rounded-full blur-3xl group-hover:bg-primary/50 transition-all duration-700" />

            <div className="relative">
              <span className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold">{e.tag}</span>
              <h3 className="text-3xl md:text-4xl font-bold mt-4 mb-6 leading-tight">{e.title}</h3>
            </div>

            <div className="relative flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{e.location}</span>
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{e.date}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
