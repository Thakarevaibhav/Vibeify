import { useEffect, useState } from "react";
import { adminGetCelebrities, adminGetEvents, adminGetBookings, adminGetContacts } from "@/lib/api";
import { Star, Calendar, BookOpen, MessageSquare } from "lucide-react";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ celebrities: 0, events: 0, bookings: 0, contacts: 0 });

  useEffect(() => {
    Promise.allSettled([
      adminGetCelebrities(),
      adminGetEvents(),
      adminGetBookings({ limit: "1" }),
      adminGetContacts({ limit: "1" }),
    ]).then(([c, e, b, m]) => {
      setCounts({
        celebrities: c.status === "fulfilled" ? (c.value as any).data.length : 0,
        events: e.status === "fulfilled" ? (e.value as any).data.length : 0,
        bookings: b.status === "fulfilled" ? (b.value as any).pagination.total : 0,
        contacts: m.status === "fulfilled" ? (m.value as any).pagination.total : 0,
      });
    });
  }, []);

  const cards = [
    { label: "Celebrities", value: counts.celebrities, icon: Star, href: "/admin/celebrities", color: "from-yellow-500/20 to-orange-500/20" },
    { label: "Events", value: counts.events, icon: Calendar, href: "/admin/events", color: "from-blue-500/20 to-purple-500/20" },
    { label: "Bookings", value: counts.bookings, icon: BookOpen, href: "/admin/bookings", color: "from-green-500/20 to-teal-500/20" },
    { label: "Messages", value: counts.contacts, icon: MessageSquare, href: "/admin/contacts", color: "from-pink-500/20 to-red-500/20" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <a key={c.label} href={c.href} className={`rounded-2xl p-6 border border-border bg-gradient-to-br ${c.color} hover:border-primary/40 transition-all block`}>
            <c.icon className="h-6 w-6 text-gold mb-3" />
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{c.label}</p>
          </a>
        ))}
      </div>
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold mb-2">Quick Links</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="/admin/celebrities" className="px-4 py-2 bg-gradient-gold text-primary-foreground rounded-xl font-medium">+ Add Celebrity</a>
          <a href="/admin/events" className="px-4 py-2 bg-card border border-border rounded-xl hover:border-primary/40 transition-all">+ Add Event</a>
          <a href="/admin/gallery" className="px-4 py-2 bg-card border border-border rounded-xl hover:border-primary/40 transition-all">+ Upload Gallery</a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
