import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { PageHeader } from "@/components/vibeify/PageHeader";
import { Seo } from "@/components/vibeify/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getCelebrities, submitBooking, type Celebrity } from "@/lib/api";
import { Heart, Building2, GraduationCap, PartyPopper, Music2, Megaphone, Check, ArrowLeft, ArrowRight, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

const eventTypes = [
  { id: "corporate", label: "Corporate", icon: Building2 },
  { id: "concert", label: "Concert / Live Show", icon: Music2 },
  { id: "private", label: "Private Party", icon: PartyPopper },
  { id: "brand", label: "Brand Promotion", icon: Megaphone },
  { id: "college", label: "College Fest", icon: GraduationCap },
];

const budgets = ["Under ₹15L", "₹15L – ₹50L", "₹50L – ₹2Cr", "₹2Cr – ₹10Cr", "₹10Cr+"];
const steps = ["Event Type", "Celebrity", "Budget", "Date & Place", "Your Details"] as const;

const schema = z.object({
  eventType: z.string().min(1, "Pick an event type"),
  celebId: z.string().optional(),
  budget: z.string().min(1, "Select a budget range"),
  date: z.string().min(1, "Pick a date"),
  location: z.string().trim().min(2, "Add a location").max(120),
  name: z.string().trim().min(2, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(7, "Valid phone required").max(20),
  notes: z.string().trim().max(1000).optional(),
});

const BookingPage = () => {
  const [params] = useSearchParams();
  const initialCeleb = params.get("celeb") || "";
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    eventType: "", celebId: initialCeleb, budget: "", date: "", location: "",
    name: "", email: "", phone: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [selectedCeleb, setSelectedCeleb] = useState<Celebrity | null>(null);

  useEffect(() => {
    getCelebrities({ limit: "100" }).then((res) => {
      setCelebrities(res.data);
      if (initialCeleb) {
        const found = res.data.find((c) => c._id === initialCeleb);
        if (found) setSelectedCeleb(found);
      }
    }).catch(() => {});
  }, [initialCeleb]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step, submitted]);

  const set = (k: keyof typeof data, v: string) => setData((d) => ({ ...d, [k]: v }));

  const canProceed = useMemo(() => {
    if (step === 0) return !!data.eventType;
    if (step === 1) return true;
    if (step === 2) return !!data.budget;
    if (step === 3) return !!data.date && data.location.trim().length >= 2;
    return true;
  }, [step, data]);

  const next = () => {
    if (!canProceed) { toast.error("Please complete this step"); return; }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = useCallback(async () => {
    const r = schema.safeParse(data);
    if (!r.success) { toast.error(r.error.issues[0].message); return; }
    setSubmitting(true);
    try {
      await submitBooking({
        eventType: data.eventType,
        celebId: data.celebId || undefined,
        budget: data.budget,
        date: data.date,
        location: data.location,
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: data.notes || undefined,
      });
      setSubmitted(true);
      toast.success("Inquiry submitted! Our team will reach out within 24 hours.");
    } catch (e: any) {
      toast.error(e.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [data]);

  const progress = ((step + 1) / steps.length) * 100;

  if (submitted) {
    return (
      <>
        <Seo title="Inquiry Received — Vibeify" description="Your booking inquiry has been received. A Vibeify producer will be in touch shortly." />
        <PageHeader eyebrow="Confirmed" title={<>Inquiry <span className="text-gold">received</span></>} />
        <section className="container pb-32">
          <div className="max-w-2xl mx-auto glass rounded-3xl p-10 text-center space-y-6">
            <div className="inline-flex p-5 rounded-full bg-gradient-gold animate-pulse-glow"><Check className="h-10 w-10 text-primary-foreground" /></div>
            <h2 className="text-3xl font-bold">Thank you, {data.name.split(" ")[0]}!</h2>
            <p className="text-muted-foreground">A Vibeify producer will contact you within 24 hours at <span className="text-foreground">{data.email}</span> with a curated proposal.</p>
            <div className="text-left bg-card/40 rounded-2xl p-6 text-sm space-y-2">
              <p><span className="text-muted-foreground">Event:</span> {data.eventType}</p>
              {selectedCeleb && <p><span className="text-muted-foreground">Celebrity:</span> {selectedCeleb.name}</p>}
              <p><span className="text-muted-foreground">Budget:</span> {data.budget}</p>
              <p><span className="text-muted-foreground">When:</span> {data.date} · {data.location}</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo title="Book a Celebrity — Vibeify" description="Submit your celebrity booking inquiry. Multi-step form to help Vibeify match talent to your event." />

      <PageHeader
        eyebrow="Booking"
        title={<>Tell us about your <span className="text-gold">vision</span></>}
        subtitle="Five quick steps. A producer will respond in under 24 hours."
      />

      <section className="container pb-32">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((s, i) => (
                <span key={s} className={`text-xs uppercase tracking-wider transition-colors ${i <= step ? "text-gold" : "text-muted-foreground"}`}>
                  <span className="hidden sm:inline">{i + 1}. </span>{s}
                </span>
              ))}
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-gold transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="glass rounded-3xl p-6 md:p-10 min-h-[400px]">
            {step === 0 && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">What kind of event?</h3>
                  <p className="text-muted-foreground text-sm">Pick the closest match.</p>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {eventTypes.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => set("eventType", e.label)}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        data.eventType === e.label ? "border-primary bg-primary/10 glow-gold" : "border-border hover:border-primary/40 bg-card/40"
                      }`}
                    >
                      <e.icon className="h-6 w-6 text-gold mb-3" />
                      <p className="font-semibold">{e.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Any celebrity in mind?</h3>
                  <p className="text-muted-foreground text-sm">Optional — we can suggest the perfect match too.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
                  <button
                    onClick={() => { set("celebId", ""); setSelectedCeleb(null); }}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 aspect-[4/5] transition-all ${
                      data.celebId === "" ? "border-primary bg-primary/10 glow-gold" : "border-border hover:border-primary/40 bg-card/40"
                    }`}
                  >
                    <Sparkles className="h-7 w-7 text-gold" />
                    <p className="text-sm font-semibold text-center">Surprise me</p>
                    <p className="text-xs text-muted-foreground text-center">Vibeify will curate</p>
                  </button>
                  {celebrities.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => { set("celebId", c._id); setSelectedCeleb(c); }}
                      className={`relative rounded-2xl overflow-hidden aspect-[4/5] border transition-all ${
                        data.celebId === c._id ? "border-primary glow-gold" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <img src={getImageUrl(c.imageUrl)} alt={c.name} loading="lazy" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                      <div className="absolute bottom-2 inset-x-2 text-left">
                        <p className="text-xs font-semibold leading-tight">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.category}</p>
                      </div>
                      {data.celebId === c._id && (
                        <div className="absolute top-2 right-2 p-1 rounded-full bg-gradient-gold"><Check className="h-3 w-3 text-primary-foreground" /></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">What's your budget range?</h3>
                  <p className="text-muted-foreground text-sm">All-inclusive: talent + production.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      onClick={() => set("budget", b)}
                      className={`p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        data.budget === b ? "border-primary bg-primary/10 glow-gold" : "border-border hover:border-primary/40 bg-card/40"
                      }`}
                    >
                      <span className="font-semibold">{b}</span>
                      <Star className="h-4 w-4 text-gold" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">When & where?</h3>
                  <p className="text-muted-foreground text-sm">Approximate is fine.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Event date</Label>
                    <Input id="date" type="date" value={data.date} onChange={(e) => set("date", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location / City</Label>
                    <Input id="location" value={data.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Mumbai, Udaipur, Dubai" maxLength={120} />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">How can we reach you?</h3>
                  <p className="text-muted-foreground text-sm">A producer will follow up personally.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={data.name} onChange={(e) => set("name", e.target.value)} maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} maxLength={255} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={data.phone} onChange={(e) => set("phone", e.target.value)} maxLength={20} placeholder="+91 ..." />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Anything else? (optional)</Label>
                    <Textarea id="notes" rows={4} value={data.notes} onChange={(e) => set("notes", e.target.value)} maxLength={1000} placeholder="Theme, audience size, references..." />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button variant="ghost" onClick={back} disabled={step === 0}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button variant="hero" size="lg" onClick={next}>Continue <ArrowRight className="ml-1 h-4 w-4" /></Button>
            ) : (
              <Button variant="hero" size="lg" onClick={submit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Inquiry"} <Sparkles className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default BookingPage;
