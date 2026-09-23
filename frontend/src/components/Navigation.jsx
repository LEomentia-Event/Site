import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoLight from '@/assets/logo-light.svg';
import logoDark from '@/assets/logo-dark.svg';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/services', label: 'Services' },
    { path: '/galerie', label: 'Galerie' },
    { path: '/temoignages', label: 'Témoignages' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // On the homepage, before scrolling, the nav sits over a dark hero image,
  // so text must be light to stay visible. Elsewhere (or once scrolled) use coffee.
  const lightMode = location.pathname === '/' && !isScrolled;
  const baseText = lightMode ? 'text-cream' : 'text-coffee';

  return (
    <>
    <nav
      data-testid="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'nav-glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            data-testid="logo-link"
            className="flex items-center"
          >
            <img
              src={lightMode ? logoLight : logoDark}
              alt="Léomentia Event"
              width="375"
              height="185"
              className="h-12 sm:h-14 w-auto transition-opacity duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className={`font-poppins text-sm tracking-wide transition-colors duration-300 elegant-link ${
                  isActive(link.path)
                    ? 'text-gold'
                    : `${baseText} hover:text-gold`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:0661865155"
              className={`flex items-center hover:text-gold transition-colors ${baseText}`}
            >
              <Phone className="w-4 h-4 mr-2" strokeWidth={1.5} />
              <span className="font-poppins text-sm">06 61 86 51 55</span>
            </a>
            <a
              href="https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="cta-calendly-nav"
            >
              <Button className="bg-gold hover:bg-gold-dark text-white font-poppins text-sm tracking-wide px-6 py-2 btn-shine">
                Réserver un appel
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-button"
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 hover:text-gold transition-colors ${baseText}`}
          >
            {isOpen ? (
              <X className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
    </nav>

      {/* Mobile Menu (full-screen, solid) */}
      <div
        data-testid="mobile-menu"
        style={{ backgroundColor: '#FFFCF8' }}
        className={`lg:hidden fixed inset-0 z-[70] transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Menu header with logo + close */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
          <img src={logoDark} alt="Léomentia Event" width="375" height="185" className="h-12 w-auto" />
          <button
            data-testid="mobile-menu-close"
            onClick={() => setIsOpen(false)}
            className="p-2 text-coffee hover:text-gold transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 p-8 pt-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
              className={`font-cormorant text-2xl tracking-wide transition-colors duration-300 ${
                isActive(link.path)
                  ? 'text-gold'
                  : 'text-coffee hover:text-gold'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-8 flex flex-col items-center space-y-4">
            <a
              href="tel:0661865155"
              className="flex items-center text-coffee hover:text-gold transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" strokeWidth={1.5} />
              <span className="font-poppins">06 61 86 51 55</span>
            </a>
            <a
              href="https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gold hover:bg-gold-dark text-white font-poppins tracking-wide px-8 py-3">
                Réserver un appel
              </Button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
