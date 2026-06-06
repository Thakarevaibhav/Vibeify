import { Sparkles } from "lucide-react";

export const Logo = ({ className = "", variant = "default", scrolled = false }: { className?: string; variant?: "default" | "image"; scrolled?: boolean }) => {
  if (variant === "image") {
    return (
      <img 
        src="/vibeifylogo.PNG" 
        alt="Vibeify Logo" 
        className={`${scrolled ? "h-24" : "h-44"} w-auto object-contain transition-all duration-500 ${className}`}
      />
    );
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-gold blur-md opacity-70" />
        <div className="relative bg-gradient-gold p-2 rounded-lg">
          <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
      </div>
      <span className="font-display font-black text-2xl tracking-tight">
        Vibe<span className="text-gold">ify</span>
      </span>
    </div>
  );
};
