import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import GalleryPage from "@/pages/GalleryPage";
import TestimonialsPage from "@/pages/TestimonialsPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPage from "@/pages/PrivacyPage";
import LegalPage from "@/pages/LegalPage";

function App() {
  return (
    <HelmetProvider>
      <div className="App min-h-screen bg-cream">
        <BrowserRouter>
          <ScrollToTop />
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/galerie" element={<GalleryPage />} />
              <Route path="/temoignages" element={<TestimonialsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/politique-de-confidentialite" element={<PrivacyPage />} />
              <Route path="/mentions-legales" element={<LegalPage />} />
            </Routes>
          </main>
          <Footer />
          <CookieConsent />
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;
