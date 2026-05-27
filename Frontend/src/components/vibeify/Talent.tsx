import c1 from "@/assets/celeb-1.jpg";
import c2 from "@/assets/celeb-2.jpg";
import c3 from "@/assets/celeb-3.jpg";
import c4 from "@/assets/celeb-4.jpg";
import { Instagram } from "lucide-react";

const talents = [
  { img: c1, name: "Aria Mehra", category: "Actor & Host", followers: "12.4M" },
  { img: c2, name: "DJ Kairo", category: "Electronic / Festival", followers: "3.2M" },
  { img: c3, name: "Naya Sterling", category: "Vocalist & Songwriter", followers: "8.9M" },
  { img: c4, name: "Riya Kapoor", category: "Performer & Dancer", followers: "15.1M" },
];

export const Talent = () => (
  <section id="talent" className="py-32 relative bg-card/20">
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-4">The Roster</p>
          <h2 className="text-4xl md:text-6xl font-bold max-w-2xl">
            Featured <span className="text-gradient">talent</span> on our roster
          </h2>
        </div>
        <p className="text-muted-foreground max-w-md">
          A handpicked selection. Vibeify represents and books 500+ artists across music, film, sports & digital.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {talents.map((t) => (
          <div key={t.name} className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer">
            <img
              src={t.img}
              alt={`${t.name} — ${t.category}`}
              loading="lazy"
              width={800}
              height={1000}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <p className="text-xs uppercase tracking-widest text-secondary mb-1">{t.category}</p>
              <h3 className="text-xl md:text-2xl font-bold mb-2">{t.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Instagram className="h-4 w-4" /> {t.followers}
              </div>
            </div>
            <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Available
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
