import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCelebrities, type Celebrity } from "@/lib/api";
import { celebrities as fallback } from "@/data/celebrities";
import { Instagram, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FeaturedCelebrities = () => {
  const [featured, setFeatured] = useState<(Celebrity | typeof fallback[0])[]>(fallback.slice(0, 4));

  useEffect(() => {
    getCelebrities({ sort: "popularity", limit: "4" }).then((res) => {
      if (res.data.length) setFeatured(res.data);
    }).catch(() => {});
  }, []);

  const getImage = (c: any) => c.imageUrl || c.image;

  return (
    <section className="py-32 relative bg-card/20">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold mb-4">Featured Talent</p>
            <h2 className="text-4xl md:text-6xl font-bold max-w-2xl">
              Stars on our <span className="text-gold">roster</span>
            </h2>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link to="/celebrities">View all 100+ <ArrowRight className="ml-1" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((t: any) => (
            <Link to="/celebrities" key={t._id || t.id} className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer block">
              <img src={getImage(t)} alt={`${t.name} — ${t.category}`} loading="lazy" width={800} height={1000} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-xs uppercase tracking-widest text-gold mb-1">{t.category}</p>
                <h3 className="text-xl md:text-2xl font-bold mb-2">{t.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Instagram className="h-4 w-4" /> {t.followers}
                </div>
              </div>
              <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Available
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
