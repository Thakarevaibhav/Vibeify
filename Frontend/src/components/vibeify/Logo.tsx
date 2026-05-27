import { Sparkles } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => (
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
