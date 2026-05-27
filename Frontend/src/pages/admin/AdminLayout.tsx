import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminMe } from "@/lib/api";
import { LayoutDashboard, Star, Calendar, Image, BookOpen, MessageSquare, LogOut, Menu, X } from "lucide-react";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/celebrities", label: "Celebrities", icon: Star },
  { to: "/admin/events", label: "Events", icon: Calendar },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { to: "/admin/contacts", label: "Contacts", icon: MessageSquare },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("vibeify_token");
    if (!token) { navigate("/admin/login"); return; }
    adminMe().then(r => setAdmin(r.data as any)).catch(() => { navigate("/admin/login"); });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("vibeify_token");
    navigate("/admin/login");
  };

  const isActive = (item: typeof nav[0]) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-6 border-b border-border">
          <p className="font-bold text-lg text-gold">Vibeify</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item) ? "bg-gradient-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-card/60"}`}
            >
              <item.icon className="h-4 w-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          {admin && <p className="text-xs text-muted-foreground mb-3 truncate">{admin.email}</p>}
          <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-14 bg-card/80 backdrop-blur border-b border-border flex items-center px-4 gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-card" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="text-sm font-medium text-muted-foreground capitalize">
            {pathname === "/admin" ? "Dashboard" : pathname.split("/admin/")[1] || ""}
          </span>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
