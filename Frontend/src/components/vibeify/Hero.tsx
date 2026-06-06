import heroImg from "@/assets/hero-event.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Cinematic concert stage with dramatic lights and crowd"
          className="w-full h-full object-cover opacity-50"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mt-3 mb-8">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-medium ">
              India's #1 Celebrity Booking & Event Agency
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.95] mb-6">
            Turn Moments Into
            <br />
            <span className="text-gradient">Star-Studded</span> Experiences
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Vibeify specializes in celebrity event management, curating
            extraordinary experiences across concerts, corporate gatherings,
            college festivals, private events, government functions, and social
            impact initiatives. From concept to execution, we transform ideas
            into spectacular moments powered by top talent and exceptional
            production.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/booking">
                Book a Celebrity <ArrowRight className="ml-1" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link to="/events">
                <Play className="mr-1" /> Explore Events
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto">
            {[
              { value: "100+", label: "Stars Booked" },
              { value: "500+", label: "Events Produced" },
              { value: "20+", label: "Cities Covered" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-5xl font-display font-bold text-gradient">
                  {s.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
