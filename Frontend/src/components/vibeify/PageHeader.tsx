interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
}

export const PageHeader = ({ eyebrow, title, subtitle }: PageHeaderProps) => (
  <section className="relative pt-40 pb-16 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-radial opacity-70 pointer-events-none" />
    <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
    <div className="container relative text-center max-w-4xl animate-fade-up">
      {eyebrow && <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">{eyebrow}</p>}
      <h1 className="text-5xl md:text-7xl font-bold leading-[1.05]">{title}</h1>
      {subtitle && <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  </section>
);
