import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  eventType: z.string().trim().min(2, "Tell us the event type").max(80),
  budget: z.string().trim().min(1, "Select a budget range").max(50),
  message: z.string().trim().min(10, "A bit more detail helps").max(1000),
});

export const Booking = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", eventType: "", budget: "", message: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    toast.success("Brief received! Our team will reach out within 24 hours.");
    setForm({ name: "", email: "", phone: "", eventType: "", budget: "", message: "" });
  };

  return (
    <section id="book" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial opacity-60" />
      <div className="container relative">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2">
            <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-4">Let's create</p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Tell us about your <span className="text-gradient">vision</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Share a few details and a Vibeify producer will respond within 24 hours with curated talent options and a tailored proposal.
            </p>

            <ul className="space-y-5">
              {[
                { icon: Mail, label: "hello@vibeify.in" },
                { icon: Phone, label: "+91 98765 43210" },
                { icon: MapPin, label: "Mumbai · Delhi · Dubai" },
              ].map((c) => (
                <li key={c.label} className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-primary"><c.icon className="h-5 w-5 text-primary-foreground" /></div>
                  <span className="font-medium">{c.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={onSubmit} className="lg:col-span-3 glass rounded-3xl p-8 md:p-10 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={update("name")} placeholder="Your name" maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={update("email")} placeholder="you@brand.com" maxLength={255} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={update("phone")} placeholder="+91 ..." maxLength={20} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Input id="eventType" value={form.eventType} onChange={update("eventType")} placeholder="Wedding, brand launch, festival..." maxLength={80} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <select
                id="budget"
                value={form.budget}
                onChange={update("budget")}
                className="flex h-10 w-full rounded-md border border-input bg-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select a range</option>
                <option>Under ₹15L</option>
                <option>₹15L – ₹50L</option>
                <option>₹50L – ₹2Cr</option>
                <option>₹2Cr+</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Tell us more</Label>
              <Textarea id="message" rows={5} value={form.message} onChange={update("message")} placeholder="Date, location, audience size, talent in mind..." maxLength={1000} />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
              {loading ? "Sending..." : <>Submit Brief <Sparkles className="ml-1" /></>}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
