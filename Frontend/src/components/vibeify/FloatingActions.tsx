import { useState } from "react";
import { MessageCircle, X, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";

const WHATSAPP = "917887991028";

export const FloatingActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="glass-strong rounded-2xl p-5 w-72 animate-scale-in shadow-[0_25px_60px_-20px_hsl(260_80%_3%/0.9)]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-display font-bold text-lg">Talk to Vibeify</p>
              <p className="text-xs text-muted-foreground">Replies in &lt; 5 min</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Vibeify! I'd like to book a celebrity.")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 hover:bg-[#25D366]/25 transition-colors"
            >
              <div className="p-2 rounded-lg bg-[#25D366]"><MessageCircle className="h-4 w-4 text-white" /></div>
              <div>
                <p className="text-sm font-semibold">WhatsApp</p>
                <p className="text-xs text-muted-foreground">Quick booking chat</p>
              </div>
            </a>
            <a
              href="tel:+917887991028"
              className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors"
            >
              <div className="p-2 rounded-lg bg-gradient-gold"><Phone className="h-4 w-4 text-primary-foreground" /></div>
              <div>
                <p className="text-sm font-semibold">Call us</p>
                <p className="text-xs text-muted-foreground">+91 78879 91028</p>
              </div>
            </a>
            <Link
              to="/booking"
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-secondary/40 hover:bg-secondary/30 transition-colors"
            >
              <div className="p-2 rounded-lg bg-gradient-purple"><Send className="h-4 w-4 text-foreground" /></div>
              <div>
                <p className="text-sm font-semibold">Submit a Brief</p>
                <p className="text-xs text-muted-foreground">Detailed request form</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
        className="relative h-14 w-14 rounded-full bg-gradient-gold flex items-center justify-center shadow-[0_15px_40px_-10px_hsl(43_88%_58%/0.7)] hover:scale-110 transition-transform animate-pulse-glow"
      >
        {open ? <X className="h-6 w-6 text-primary-foreground" /> : <MessageCircle className="h-6 w-6 text-primary-foreground" />}
      </button>
    </div>
  );
};
