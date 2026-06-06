import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Which celebrities can Vibeify book?", a: "We work with 100+ artists across Bollywood, regional cinema, music, sports, comedy and digital. Share your brief and we'll match talent to your goals and budget." },
  { q: "What is the typical lead time?", a: "Ideally 6–10 weeks for major bookings. We've executed marquee events in as little as 14 days when calendars align." },
  { q: "Do you handle full event production?", a: "Yes — from stage design and audio-visual to security, hospitality, ticketing and post-event content. One contract, one accountable team." },
  { q: "How are fees structured?", a: "Talent fees are passed through transparently. Vibeify charges a curated agency fee plus production at cost. No surprises, ever." },
  { q: "Do you operate outside India?", a: "Absolutely. We've produced events in Dubai, London, Singapore, Bali and across the GCC with local execution partners." },
  { q: "Is there a minimum budget?", a: "Custom celebrity engagements typically start at ₹15L. Full productions vary widely — let's discuss your scope." },
];

export const FAQ = () => (
  <section id="faq" className="py-32 relative bg-card/20">
    <div className="container max-w-4xl">
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-4">Questions</p>
        <h2 className="text-4xl md:text-6xl font-bold">Everything you need to know</h2>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-2xl px-6 bg-card/40">
            <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-6">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-6">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
