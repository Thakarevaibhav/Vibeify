import { useEffect, useState } from "react";
import { adminGetCelebrities, adminCreateCelebrity, adminUpdateCelebrity, adminDeleteCelebrity, type Celebrity } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

const CATS = ["Actor", "Actress", "Singer", "DJ", "Influencer", "Comedian", "Sports", "Dancer"];
const EMPTY = { slug: "", name: "", category: "Actor", bio: "", followers: "", popularity: "80", priceRange: "20", pastEvents: "", tags: "", isActive: "true" };

const AdminCelebrities = () => {
  const [list, setList] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Celebrity | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");

  const load = () => { setLoading(true); adminGetCelebrities().then(r => setList(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setImage(null); setPreview(""); setOpen(true); };
  const openEdit = (c: Celebrity) => {
    setEditing(c);
    setForm({ slug: c.slug, name: c.name, category: c.category, bio: c.bio, followers: c.followers, popularity: String(c.popularity), priceRange: String(c.priceRange), pastEvents: c.pastEvents.join(", "), tags: c.tags.join(", "), isActive: String((c as any).isActive ?? true) });
    setImage(null); setPreview(c.imageUrl); setOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.slug) { toast.error("Name and slug are required"); return; }
    if (!editing && !image) { toast.error("Image is required"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "pastEvents") fd.append(k, JSON.stringify(v.split(",").map(s => s.trim()).filter(Boolean)));
        else if (k === "tags") fd.append(k, JSON.stringify(v.split(",").map(s => s.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (image) fd.append("image", image);
      if (editing) await adminUpdateCelebrity(editing._id, fd);
      else await adminCreateCelebrity(fd);
      toast.success(editing ? "Celebrity updated" : "Celebrity created");
      setOpen(false); load();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Remove this celebrity?")) return;
    try { await adminDeleteCelebrity(id); toast.success("Removed"); load(); } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Celebrities</h1>
        <Button variant="hero" size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add</Button>
      </div>

      {loading ? <div className="text-muted-foreground text-sm">Loading...</div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map(c => (
            <div key={c._id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="relative aspect-[4/5]">
                <img src={getImageUrl(c.imageUrl)} alt={c.name} className="w-full h-full object-cover" />
                {!(c as any).isActive && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Inactive</span>}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.category} · ₹{c.priceRange}L</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1 h-8" onClick={() => openEdit(c)}><Pencil className="h-3 w-3" /></Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-red-400 hover:text-red-300" onClick={() => del(c._id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Celebrity" : "Add Celebrity"}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            {/* Image upload */}
            <div className="md:col-span-2">
              <Label>Image {!editing && <span className="text-red-400">*</span>}</Label>
              <div className="mt-1 flex items-center gap-4">
                {preview && <img src={preview} className="h-20 w-16 object-cover rounded-xl" />}
                <label className="cursor-pointer px-4 py-2 rounded-xl border border-dashed border-border hover:border-primary/50 text-sm text-muted-foreground">
                  Choose image
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setImage(f); setPreview(URL.createObjectURL(f)); } }} />
                </label>
                {image && <button onClick={() => { setImage(null); if (!editing) setPreview(""); }}><X className="h-4 w-4 text-muted-foreground" /></button>}
              </div>
            </div>
            {[["name","Name",true],["slug","Slug (URL-friendly)",true],["followers","Followers (e.g. 12.4M)",false],["popularity","Popularity (0-100)",false],["priceRange","Price (₹ Lakhs)",false]].map(([k, lbl, req]) => (
              <div key={k as string} className="space-y-1">
                <Label>{lbl as string} {req && <span className="text-red-400">*</span>}</Label>
                <Input value={(form as any)[k as string]} onChange={e => setForm(f => ({ ...f, [k as string]: e.target.value }))} />
              </div>
            ))}
            <div className="space-y-1">
              <Label>Category</Label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="h-10 w-full rounded-md border border-input bg-input px-3 text-sm">
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Active</Label>
              <select value={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.value }))} className="h-10 w-full rounded-md border border-input bg-input px-3 text-sm">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Bio</Label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="w-full rounded-md border border-input bg-input px-3 py-2 text-sm resize-none" />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Past Events (comma-separated)</Label>
              <Input value={form.pastEvents} onChange={e => setForm(f => ({ ...f, pastEvents: e.target.value }))} placeholder="IIFA 2024, Cannes, ..." />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Tags (comma-separated)</Label>
              <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Bollywood, Brand Face, ..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCelebrities;
