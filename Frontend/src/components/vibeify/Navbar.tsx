import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Celebrities", to: "/celebrities" },
  { label: "Events", to: "/events" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="container">
        <nav className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all ${scrolled ? "glass-strong" : ""}`}>
          <Link to="/"><Logo /></Link>
          <ul className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors relative ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-gold rounded-full" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="hidden lg:block">
            <Button variant="hero" size="sm" asChild><Link to="/booking">Book Now</Link></Button>
          </div>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-foreground" aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </nav>
        {open && (
          <div className="lg:hidden glass-strong mt-2 rounded-2xl p-6 flex flex-col gap-4 animate-fade-in">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? "text-primary font-semibold" : "text-foreground/80"}>
                {l.label}
              </NavLink>
            ))}
            <Button variant="hero" asChild><Link to="/booking">Book Now</Link></Button>
          </div>
        )}
      </div>
    </header>
  );
};
