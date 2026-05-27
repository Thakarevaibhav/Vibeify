import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const CtaBanner = () => (
  <section className="py-32 relative">
    <div className="container">
      <div className="relative overflow-hidden rounded-[2rem] p-10 md:p-20 text-center bg-gradient-luxe">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/40 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="relative">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Ready to make it <em className="text-gold not-italic">legendary?</em>
          </h2>
          <p className="text-lg text-foreground/80 max-w-xl mx-auto mb-10">
            Tell us your vision. A Vibeify producer will respond within 24 hours with curated talent and a tailored plan.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/booking">Start Your Booking <ArrowRight className="ml-1" /></Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);
