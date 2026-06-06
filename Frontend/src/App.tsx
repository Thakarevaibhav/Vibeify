import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/vibeify/Layout";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Services from "./pages/Services.tsx";
import Celebrities from "./pages/Celebrities.tsx";
import Events from "./pages/Events.tsx";
import Gallery from "./pages/Gallery.tsx";
import Booking from "./pages/Booking.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";

// Admin
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminCelebrities from "./pages/admin/AdminCelebrities.tsx";
import AdminEvents from "./pages/admin/AdminEvents.tsx";
import AdminGallery from "./pages/admin/AdminGallery.tsx";
import AdminBookings from "./pages/admin/AdminBookings.tsx";
import AdminContacts from "./pages/admin/AdminContacts.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/celebrities" element={<Celebrities />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin routes*/}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="celebrities" element={<AdminCelebrities />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
