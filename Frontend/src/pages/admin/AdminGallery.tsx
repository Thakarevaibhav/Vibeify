import { useEffect, useState } from "react";
import { adminGetGallery, adminUploadGallery, adminDeleteGallery, type GalleryItem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";

const CATS = ["All", "Concert", "Corporate", "College Fest", "Brand Launch"];

const AdminGallery = () => {
  const [list, setList] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("All");
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); adminGetGallery().then(r => setList(r.data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const upload = async () => {
    if (!files.length) { toast.error("Select at least one image"); return; }
    setSaving(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);
        fd.append("title", title || file.name.replace(/\.[^.]+$/, ""));
        fd.append("category", category);
        await adminUploadGallery(fd);
      }
      toast.success(`${files.length} image(s) uploaded`);
      setOpen(false); setFiles([]); setTitle(""); load();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Remove this image?")) return;
    try { await adminDeleteGallery(id); toast.success("Removed"); load(); } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <Button variant="hero" size="sm" onClick={() => setOpen(true)}><Upload className="h-4 w-4 mr-1" />Upload</Button>
      </div>

      {loading ? <div className="text-muted-foreground text-sm">Loading...</div> : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {list.map(g => (
            <div key={g._id} className="relative rounded-xl overflow-hidden group break-inside-avoid">
              <img src={`${import.meta.env.VITE_API_URL}${g.imageUrl}`} alt={g.title} className="w-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">{g.title}</p>
                  <p className="text-[10px] text-white/60">{g.category}</p>
                </div>
                <button onClick={() => del(g._id)} className="ml-2 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white shrink-0">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {list.length === 0 && <p className="text-muted-foreground text-sm">No images yet.</p>}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Upload Images</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Images <span className="text-red-400">*</span></Label>
              <label className="mt-1 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-sm text-muted-foreground">{files.length ? `${files.length} file(s) selected` : "Click or drag images"}</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={e => setFiles(Array.from(e.target.files || []))} />
              </label>
            </div>
            <div className="space-y-1">
              <Label>Title (optional, applies to all)</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Leave blank to use filename" />
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="h-10 w-full rounded-md border border-input bg-input px-3 text-sm">
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {files.length > 0 && (
              <div className="flex gap-2 flex-wrap max-h-24 overflow-y-auto">
                {files.map((f, i) => (
                  <div key={i} className="relative">
                    <img src={URL.createObjectURL(f)} className="h-16 w-16 object-cover rounded-lg" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={upload} disabled={saving}>{saving ? "Uploading..." : "Upload"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGallery;
