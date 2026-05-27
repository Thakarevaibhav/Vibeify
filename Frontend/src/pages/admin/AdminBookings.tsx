import { useEffect, useState } from "react";
import { adminGetBookings, adminUpdateBookingStatus, adminDeleteBooking, type Booking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const STATUSES = ["new", "contacted", "quoted", "booked", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-300", contacted: "bg-yellow-500/20 text-yellow-300",
  quoted: "bg-purple-500/20 text-purple-300", booked: "bg-green-500/20 text-green-300",
  cancelled: "bg-red-500/20 text-red-300",
};

const AdminBookings = () => {
  const [list, setList] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  const load = () => {
    setLoading(true);
    const p: Record<string,string> = { limit: "50" };
    if (filterStatus) p.status = filterStatus;
    adminGetBookings(p).then(r => { setList(r.data); setTotal(r.pagination.total); }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filterStatus]);

  const updateStatus = async (id: string, status: string) => {
    try { await adminUpdateBookingStatus(id, status); toast.success("Status updated"); load(); } catch (e: any) { toast.error(e.message); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    try { await adminDeleteBooking(id); toast.success("Deleted"); load(); } catch (e: any) { toast.error(e.message); }
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Bookings <span className="text-muted-foreground text-base font-normal">({total})</span></h1>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterStatus("")} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${!filterStatus ? "bg-gradient-gold text-primary-foreground border-transparent" : "border-border text-muted-foreground"}`}>All</button>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium border capitalize transition-all ${filterStatus === s ? "bg-gradient-gold text-primary-foreground border-transparent" : "border-border text-muted-foreground"}`}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="text-muted-foreground text-sm">Loading...</div> : (
        <div className="space-y-3">
          {list.map(b => (
            <div key={b._id} className="rounded-2xl border border-border bg-card p-4 md:p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{b.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[b.status] || "bg-muted text-muted-foreground"}`}>{b.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{b.email} · {b.phone}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                    <span><span className="text-muted-foreground">Event:</span> {b.eventType}</span>
                    <span><span className="text-muted-foreground">Budget:</span> {b.budget}</span>
                    <span><span className="text-muted-foreground">Date:</span> {b.date}</span>
                    <span><span className="text-muted-foreground">Location:</span> {b.location}</span>
                  </div>
                  {b.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{b.notes}"</p>}
                  <p className="text-xs text-muted-foreground mt-2">Received: {fmt(b.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={b.status}
                    onChange={e => updateStatus(b._id, e.target.value)}
                    className="h-8 rounded-lg border border-input bg-input px-2 text-xs"
                  >
                    {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                  <button onClick={() => del(b._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {list.length === 0 && <p className="text-muted-foreground text-sm">No bookings found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
