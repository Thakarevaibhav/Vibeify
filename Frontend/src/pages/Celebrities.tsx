import { useEffect, useMemo, useState, useCallback } from "react";
import { PageHeader } from "@/components/vibeify/PageHeader";
import { Seo } from "@/components/vibeify/Seo";
import { getCelebrities, type Celebrity } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Sort = "popularity" | "price-low" | "price-high";
const CATEGORIES = [
  "All",
  "Actor",
  "Singer",
  "DJ",
  "Influencer",
  "Comedian",
  "Sports",
  "Dancer",
];

const CelebritiesPage = () => {
  const [cat, setCat] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [sort, setSort] = useState<Sort>("popularity");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Celebrity | null>(null);
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { sort, limit: "100" };
      if (cat !== "All") params.category = cat;
      if (maxPrice < 200) params.maxPrice = String(maxPrice);
      if (q) params.q = q;
      const res = await getCelebrities(params);
      setCelebrities(res.data);
      setTotal(res.pagination.total);
    } catch {
      // fallback: empty
    } finally {
      setLoading(false);
    }
  }, [cat, maxPrice, sort, q]);

  useEffect(() => {
    const t = setTimeout(fetchData, q ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchData, q]);

  return (
    <>
      <Seo
        title="Celebrity Roster — Vibeify Talent Booking"
        description="Browse and book actors, singers, DJs, influencers, comedians and athletes for your next event with Vibeify."
      />

      <PageHeader
        eyebrow="The Roster"
        title={
          <>
            Browse our <span className="text-gold">talent</span>
          </>
        }
        subtitle="100+ artists across film, music, sport and digital. Filter by category, price and popularity."
      />

      <section className="container pb-32">
        <div className="glass rounded-3xl p-5 md:p-6 mb-10 sticky top-24 z-30">
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name or tag"
                className="pl-9"
              />
            </div>
            <div className="md:col-span-5">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      cat === c
                        ? "bg-gradient-gold text-primary-foreground border-transparent"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-10 w-full rounded-md border border-input bg-input px-3 text-sm"
              >
                <option value="popularity">Most popular</option>
                <option value="price-low">Price: low → high</option>
                <option value="price-high">Price: high → low</option>
              </select>
            </div>
            <div className="md:col-span-12">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">
                Max budget:{" "}
                <span className="text-gold font-semibold">₹{maxPrice}L</span>
              </label>
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full mt-2 accent-primary"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden bg-card/40 border border-border animate-pulse"
              >
                <div className="aspect-[4/5] bg-muted" />
                <div className="p-5 space-y-2">
                  <div className="h-5 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {celebrities.length} of {total} celebrities
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {celebrities.map((c) => (
                <article
                  key={c._id}
                  className="group rounded-3xl overflow-hidden bg-gradient-card border border-border hover:border-primary/40 transition-all"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={getImageUrl(c.imageUrl)}
                      alt={`${c.name} — ${c.category}`}
                      loading="lazy"
                      width={800}
                      height={1000}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 glass px-3 py-1 rounded-full text-xs font-medium">
                      {c.category}
                    </span>
                    <span className="absolute top-3 right-3 glass px-3 py-1 rounded-full text-xs font-medium text-gold">
                      ★ {c.popularity}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold">{c.name}</h3>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Instagram className="h-3.5 w-3.5" />
                          {c.followers} followers
                        </span>

                        <a
                          href={c.slug}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-400 transition-colors"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {c.bio}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-sm">
                        <span className="text-muted-foreground">From </span>
                        <span className="text-gold font-bold">
                          ₹{c.priceRange}L
                        </span>
                      </span>
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => setActive(c)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {celebrities.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  No celebrities match those filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setCat("All");
                    setMaxPrice(200);
                    setQ("");
                  }}
                >
                  Reset filters
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl glass-strong border-primary/20">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-display">
                  {active.name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <img
                  src={getImageUrl(active.imageUrl)}
                  alt={active.name}
                  className="w-full rounded-2xl object-cover aspect-[4/5]"
                />
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="glass px-3 py-1 rounded-full text-xs">
                      {active.category}
                    </span>
                    {active.tags.map((t) => (
                      <span
                        key={t}
                        className="glass px-3 py-1 rounded-full text-xs text-gold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {active.bio}
                  </p>
                  <div className="grid grid-cols-3 gap-3 py-3 border-y border-border">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">
                        Followers
                      </p>
                      <p className="font-bold">{active.followers}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">
                        Popularity
                      </p>
                      <p className="font-bold text-gold">
                        ★ {active.popularity}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">
                        From
                      </p>
                      <p className="font-bold text-gold">
                        ₹{active.priceRange}L
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" /> Recent
                      appearances
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {active.pastEvents.map((e) => (
                        <li key={e}>• {e}</li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to={`/booking?celeb=${active._id}`}>
                      Book {active.name.split(" ")[0]}
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CelebritiesPage;
