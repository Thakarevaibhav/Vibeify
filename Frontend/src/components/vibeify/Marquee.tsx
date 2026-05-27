const brands = ["VOGUE", "FORBES", "GQ", "BILLBOARD", "ROLLING STONE", "VARIETY", "HARPER'S", "ELLE"];

export const Marquee = () => (
  <section className="py-12 border-y border-border/50 bg-card/30">
    <div className="container mb-6">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Trusted by leading brands & featured in
      </p>
    </div>
    <div className="marquee">
      <div className="marquee-track">
        {[...brands, ...brands].map((b, i) => (
          <span key={i} className="font-display text-2xl md:text-3xl font-bold text-muted-foreground/60 hover:text-gold transition-colors whitespace-nowrap">
            {b}
          </span>
        ))}
      </div>
    </div>
  </section>
);
