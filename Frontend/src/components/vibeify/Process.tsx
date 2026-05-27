const steps = [
  { n: "01", title: "Discovery", desc: "We dive into your vision, audience, budget and brand DNA in a 60-min strategy call." },
  { n: "02", title: "Curation", desc: "Within 48 hours you receive a tailored shortlist of celebrities and creative concepts." },
  { n: "03", title: "Negotiation", desc: "Our agents lock in dates, contracts, riders and exclusivity — fully transparent." },
  { n: "04", title: "Production", desc: "End-to-end execution: stage, sound, lights, security, hospitality, content." },
  { n: "05", title: "Showtime", desc: "On-ground command center ensures every cue, every moment, lands perfectly." },
  { n: "06", title: "Afterglow", desc: "Editorial recap, content delivery, media reports & ROI analytics within 7 days." },
];

export const Process = () => (
  <section id="process" className="py-32 relative bg-card/20">
    <div className="container">
      <div className="max-w-2xl mb-20">
        <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-4">The Vibeify method</p>
        <h2 className="text-4xl md:text-6xl font-bold">
          Six steps from <span className="text-gradient">spark to standing ovation</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div key={s.n} className="relative p-8 rounded-3xl glass hover:border-primary/40 transition-all group">
            <div className="text-7xl font-display font-black text-gradient opacity-90 mb-4 leading-none">{s.n}</div>
            <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
