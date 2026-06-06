import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Instagram, Twitter, Youtube, Linkedin, MessageCircle } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border bg-card/40 pt-20 pb-10 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-radial opacity-50 pointer-events-none" />
    <div className="container relative">
      <div className="grid md:grid-cols-5 gap-10 mb-16">
        <div className="md:col-span-2">
          <Logo />
          <p className="text-muted-foreground mt-5 max-w-sm leading-relaxed">
            Vibeify is a luxury celebrity event management & talent booking agency crafting unforgettable cultural moments across India and the world.
          </p>
          <div className="flex gap-3 mt-6">
            {[Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social" className="p-2.5 rounded-full glass hover:border-primary/60 hover:bg-primary/10 transition-all">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold mb-4 text-gold">Explore</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/celebrities" className="hover:text-foreground">Celebrities</Link></li>
            <li><Link to="/events" className="hover:text-foreground">Events</Link></li>
            <li><Link to="/gallery" className="hover:text-foreground">Gallery</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold mb-4 text-gold">Services</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>Celebrity Bookings</li>
            <li>Event Management</li>
            <li>Brand Promotions</li>
            <li>Corporate Events</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold mb-4 text-gold">Contact</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>vibeify.connect@gmail.com</li>
            <li>+91 7887991028</li>
            {/* <li>Bandra West, Mumbai</li> */}
            <li className="flex items-center gap-2 mt-3">
              <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp 24/7
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Vibeify Entertainment Pvt. Ltd. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);
