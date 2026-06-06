import { PageHeader } from "@/components/vibeify/PageHeader";
import { Seo } from "@/components/vibeify/Seo";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitContact } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) return toast.error(r.error.issues[0].message);
    setLoading(true);
    try {
      const res = await submitContact(form);
      toast.success(res.message || "Message received — we'll be in touch within 24h.");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Contact Vibeify — Mumbai · Delhi · Dubai" description="Get in touch with Vibeify for celebrity bookings and event management. Available across Mumbai, Delhi and Dubai." />

      <PageHeader
        eyebrow="Get in touch"
        title={<>Let's create something <span className="text-gold">unforgettable</span></>}
        subtitle="Reach out and a producer will respond within 24 hours."
      />

      <section className="container pb-32">
        <div className="grid lg:grid-cols-2 gap-10">
          <form onSubmit={submit} className="glass rounded-3xl p-8 md:p-10 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} placeholder="you@brand.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1000} placeholder="What can we help you create?" />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>

          <div className="space-y-6">
            <div className="glass rounded-3xl p-8 space-y-5">
              {[
                { icon: Mail, label: "Email", value: "vibeify.connect@gmail.com" },
                { icon: Phone, label: "Phone", value: "+91 7887991028" },
                { icon: MessageCircle, label: "WhatsApp", value: "+91 7887991028" },
                // { icon: MapPin, label: "Studio", value: "Vibeify HQ, Bandra West, Mumbai 400050" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-gold shrink-0"><c.icon className="h-5 w-5 text-primary-foreground" /></div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                    <p className="font-semibold">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl overflow-hidden border border-border h-[320px] glass">
              <iframe
                title="Vibeify Nagpur Office"
                src="https://www.google.com/maps?q=chitnis Nagar garden,+Nagpur&output=embed"
                className="w-full h-full grayscale contrast-125 opacity-90"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
