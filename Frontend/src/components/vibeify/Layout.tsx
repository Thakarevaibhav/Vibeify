import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/vibeify/Navbar";
import { Footer } from "@/components/vibeify/Footer";
import { FloatingActions } from "@/components/vibeify/FloatingActions";

export const Layout = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
  <div className="min-h-screen bg-background relative overflow-x-hidden">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
    <FloatingActions />
  </div>
  );
};
