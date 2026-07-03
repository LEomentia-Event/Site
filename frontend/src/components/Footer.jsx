import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer data-testid="footer" className="bg-coffee text-cream">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h3 className="font-cormorant text-4xl text-peach tracking-wider">
                Léomentia
              </h3>
              <span className="font-poppins text-sm text-peach/70 uppercase tracking-widest">
                Event
              </span>
            </Link>
            <p className="font-poppins text-cream/80 leading-relaxed max-w-md mb-8">
              Wedding Planner & Designer. J'accompagne les futurs mariés dans
              l'organisation de leur mariage pour leur permettre de vivre
              pleinement chaque instant.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="social-instagram"
                className="w-10 h-10 rounded-full border border-peach/30 flex items-center justify-center hover:bg-peach/10 transition-colors"
              >
                <Instagram className="w-5 h-5 text-peach" strokeWidth={1.5} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="social-facebook"
                className="w-10 h-10 rounded-full border border-peach/30 flex items-center justify-center hover:bg-peach/10 transition-colors"
              >
                <Facebook className="w-5 h-5 text-peach" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cormorant text-xl text-peach mb-6 tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { path: '/', label: 'Accueil' },
                { path: '/services', label: 'Services' },
                { path: '/galerie', label: 'Galerie' },
                { path: '/temoignages', label: 'Témoignages' },
                { path: '/blog', label: 'Blog' },
                { path: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-poppins text-cream/70 hover:text-peach transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-cormorant text-xl text-peach mb-6 tracking-wide">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:0661865155"
                  className="flex items-start font-poppins text-cream/70 hover:text-peach transition-colors"
                >
                  <Phone
                    className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  06 61 86 51 55
                </a>
              </li>
              <li>
                <a
                  href="mailto:virginie.bocquelet.pro@gmail.com"
                  className="flex items-start font-poppins text-cream/70 hover:text-peach transition-colors"
                >
                  <Mail
                    className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  virginie.bocquelet.pro@gmail.com
                </a>
              </li>
              <li className="flex items-start font-poppins text-cream/70">
                <MapPin
                  className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"
                  strokeWidth={1.5}
                />
                France
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="font-poppins text-sm text-cream/60 flex items-center">
              © {currentYear} Léomentia Event. Tous droits réservés.
            </p>
            <p className="font-poppins text-sm text-cream/60 flex items-center">
              Fait avec{' '}
              <Heart className="w-4 h-4 mx-1 text-peach" strokeWidth={1.5} />{' '}
              pour les futurs mariés
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
