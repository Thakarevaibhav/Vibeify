import { useEffect, useState } from "react";
import {
  adminGetEvents,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
  type VEvent,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const CATS = [
  "Wedding",
  "Concert",
  "Corporate",
  "College Fest",
  "Brand Launch",
  "Private",
];
const EMPTY = {
  slug: "",
  title: "",
  category: "Concert",
  date: "",
  location: "",
  description: "",
  headliners: "",
  status: "upcoming",
  attendance: "",
  isActive: "true",
};

const AdminEvents = () => {
  const [list, setList] = useState<VEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VEvent | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminGetEvents()
      .then((r) => setList(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setImage(null);
    setPreview("");
    setOpen(true);
  };
  const openEdit = (e: VEvent) => {
    setEditing(e);
    setForm({
      slug: e.slug,
      title: e.title,
      category: e.category,
      date: e.date,
      location: e.location,
      description: e.description,
      headliners: e.headliners.join(", "),
      status: e.status,
      attendance: e.attendance || "",
      isActive: String((e as any).isActive ?? true),
    });
    setImage(null);
    setPreview(e.imageUrl);
    setOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.slug || !form.date || !form.location) {
      toast.error("Title, slug, date and location are required");
      return;
    }
    if (!editing && !image) {
      toast.error("Image is required");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "headliners")
          fd.append(
            k,
            JSON.stringify(
              v
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            ),
          );
        else fd.append(k, v);
      });
      if (image) fd.append("image", image);
      if (editing) await adminUpdateEvent(editing._id, fd);
      else await adminCreateEvent(fd);
      toast.success(editing ? "Event updated" : "Event created");
      setOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Remove this event?")) return;
    try {
      await adminDeleteEvent(id);
      toast.success("Removed");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button variant="hero" size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm">Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((e) => (
            <div
              key={e._id}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div className="relative aspect-[16/9]">
                <img
                  src={`${import.meta.env.VITE_API_URL}${e.imageUrl}`}
                  alt={e.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${e.status === "upcoming" ? "bg-gradient-gold text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {e.status}
                </span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm truncate">{e.title}</p>
                <p className="text-xs text-muted-foreground">
                  {e.category} · {fmt(e.date)} · {e.location}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8"
                    onClick={() => openEdit(e)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-red-400 hover:text-red-300"
                    onClick={() => del(e._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <div className="md:col-span-2">
              <Label>
                Image {!editing && <span className="text-red-400">*</span>}
              </Label>
              <div className="mt-1 flex items-center gap-4">
                {preview && (
                  <img
                    src={preview}
                    className="h-16 w-24 object-cover rounded-xl"
                  />
                )}
                <label className="cursor-pointer px-4 py-2 rounded-xl border border-dashed border-border hover:border-primary/50 text-sm text-muted-foreground">
                  Choose image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setImage(f);
                        setPreview(URL.createObjectURL(f));
                      }
                    }}
                  />
                </label>
                {image && (
                  <button
                    onClick={() => {
                      setImage(null);
                      if (!editing) setPreview("");
                    }}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
            {[
              ["title", "Title", true],
              ["slug", "Slug", true],
              ["location", "Location", true],
              ["attendance", "Attendance (e.g. 5,000)", false],
            ].map(([k, lbl, req]) => (
              <div key={k as string} className="space-y-1">
                <Label>
                  {lbl as string}{" "}
                  {req && <span className="text-red-400">*</span>}
                </Label>
                <Input
                  value={(form as any)[k as string]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [k as string]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="space-y-1">
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="h-10 w-full rounded-md border border-input bg-input px-3 text-sm"
              >
                {CATS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
                className="h-10 w-full rounded-md border border-input bg-input px-3 text-sm"
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>
                Date <span className="text-red-400">*</span>
              </Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Active</Label>
              <select
                value={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.value }))
                }
                className="h-10 w-full rounded-md border border-input bg-input px-3 text-sm"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Description</Label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="w-full rounded-md border border-input bg-input px-3 py-2 text-sm resize-none"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label>Headliners (comma-separated)</Label>
              <Input
                value={form.headliners}
                onChange={(e) =>
                  setForm((f) => ({ ...f, headliners: e.target.value }))
                }
                placeholder="Naya Sterling, DJ Kairo, ..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;
