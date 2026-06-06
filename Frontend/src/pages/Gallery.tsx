import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/vibeify/PageHeader";
import { Seo } from "@/components/vibeify/Seo";
import { getGallery, type GalleryItem } from "@/lib/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

const cats = ["All", "Concert", "Corporate", "College Fest", "Brand Launch"] as const;

const GalleryPage = () => {
  const [cat, setCat] = useState<string>("All");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: "48" };
      if (cat !== "All") params.category = cat;
      const res = await getGallery(params);
      setItems(res.data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [cat]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <>
      <Seo title="Event Gallery — Photos & Films from Vibeify Productions" description="A visual archive of Vibeify's celebrity  concerts, corporate galas and brand launches." />

      <PageHeader
        eyebrow="Gallery"
        title={<>Moments from the <span className="text-gold">spotlight</span></>}
        subtitle="A visual archive of  concerts, corporate galas and brand events produced by Vibeify."
      />

      <section className="container pb-32">
        <div className="flex justify-center mb-10">
          <div className="glass rounded-full p-1.5 inline-flex flex-wrap gap-1">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                  cat === c ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >{c}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted animate-pulse break-inside-avoid"
                style={{ aspectRatio: i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "4/3" }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No gallery images found.</div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {items.map((g, i) => (
              <button
                key={g._id}
                onClick={() => setActive(g)}
                className="group block relative w-full overflow-hidden rounded-2xl break-inside-avoid"
                style={{ aspectRatio: i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "4/3" }}
              >
                <img src={getImageUrl(g.imageUrl)} alt={g.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-wider text-gold">{g.category}</p>
                    <p className="font-semibold">{g.title}</p>
                  </div>
                  {(g.type === "video" || i % 4 === 0) && (
                    <div className="p-2 rounded-full bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-5xl bg-transparent border-0 p-0">
          {active && (
            active.type === "video" ? (
              <video src={getImageUrl(active.imageUrl)} controls autoPlay className="w-full rounded-2xl" />
            ) : (
              <img src={getImageUrl(active.imageUrl)} alt={active.title} className="w-full rounded-2xl" />
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryPage;
