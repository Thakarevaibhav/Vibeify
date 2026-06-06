import { useEffect, useState } from "react";
import { PageHeader } from "@/components/vibeify/PageHeader";
import { Seo } from "@/components/vibeify/Seo";
import { getEvents, type VEvent } from "@/lib/api";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [events, setEvents] = useState<VEvent[]>([]);
  const [counts, setCounts] = useState({ upcoming: 0, past: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      getEvents({ status: tab, limit: "50" }),
      getEvents({ status: tab === "upcoming" ? "past" : "upcoming", limit: "1" }),
    ]).then(([main, other]) => {
      if (cancelled) return;
      setEvents(main.data);
      setCounts(tab === "upcoming"
        ? { upcoming: main.pagination.total, past: other.pagination.total }
        : { upcoming: other.pagination.total, past: main.pagination.total }
      );
    }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [tab]);

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <Seo title="Events — Upcoming & Past Productions by Vibeify" description="Explore Vibeify's upcoming concerts, brand launches and past celebrity events across India and the world." />

      <PageHeader
        eyebrow="Productions"
        title={<>Events that <span className="text-gold">define culture</span></>}
        subtitle="From stadium concerts to college fest  — every Vibeify event is built to be remembered."
      />

      <section className="container pb-32">
        <div className="flex justify-center mb-12">
          <div className="glass rounded-full p-1.5 inline-flex">
            {(["upcoming", "past"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold capitalize transition-all ${
                  tab === t ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t} ({counts[t]})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-card/40 border border-border animate-pulse">
                <div className="aspect-[16/10] bg-muted" />
                <div className="p-7 space-y-3">
                  <div className="h-7 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((e) => (
              <article key={e._id} className="group relative overflow-hidden rounded-3xl bg-gradient-card border border-border hover:border-primary/40 transition-all">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={`${import.meta.env.VITE_API_URL}${e.imageUrl}`} alt={e.title} loading="lazy" width={1280} height={1024} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="glass px-3 py-1 rounded-full text-xs font-medium">{e.category}</span>
                    {e.status === "upcoming" && <span className="bg-gradient-gold text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">Upcoming</span>}
                  </div>
                </div>
                <div className="p-7 space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight">{e.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{e.description}</p>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{fmt(e.date)}</span>
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{e.location}</span>
                    {e.attendance && <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{e.attendance}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {e.headliners.map((h) => <span key={h} className="text-xs glass px-3 py-1 rounded-full text-gold">★ {h}</span>)}
                  </div>
                  {e.status === "upcoming" && (
                    <Button variant="outline" size="sm" asChild className="mt-2">
                      <Link to="/booking">Enquire <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </Button>
                  )}
                </div>
              </article>
            ))}
            {events.length === 0 && (
              <div className="col-span-2 text-center py-20 text-muted-foreground">No {tab} events found.</div>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default EventsPage;
