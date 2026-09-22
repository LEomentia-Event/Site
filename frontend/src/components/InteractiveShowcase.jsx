import { useState } from 'react';
import { Plus, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Une photo "en situation" avec des points chauds cliquables reliés aux prestations.
// Les coordonnées sont en % (x depuis la gauche, y depuis le haut) — faciles à ajuster.
const DEFAULT_IMAGE =
  'https://drive.google.com/thumbnail?id=16lEJw1TdJvb6sUBhsX0qM-OZLlRKkjZH&sz=w2000';

const DEFAULT_HOTSPOTS = [
  { x: 52, y: 22, title: 'Recherche & négociation du lieu', desc: 'Un écrin de caractère qui vous ressemble.', link: '/blog/mariage-sur-mesure-lieu-scenographie' },
  { x: 30, y: 72, title: 'Scénographie florale sur-mesure', desc: 'Pampa, roses poudrées et compositions signature.' },
  { x: 50, y: 55, title: 'Art de la table & décoration', desc: 'Vaisselle, bougies et détails raffinés.' },
  { x: 78, y: 48, title: 'Coordination des prestataires', desc: 'Le jour J orchestré, sans le moindre stress.' },
];

const InteractiveShowcase = ({
  image = DEFAULT_IMAGE,
  hotspots = DEFAULT_HOTSPOTS,
  eyebrow = 'Exploration',
  title = 'Cliquez pour révéler mon savoir-faire',
  subtitle = "Chaque détail de cette réalisation cache une prestation. Touchez les points pour la découvrir là où elle prend vie.",
}) => {
  const [active, setActive] = useState(null);

  return (
    <section
      data-testid="interactive-showcase"
      className="py-16 lg:py-24 bg-coffee grain"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="font-poppins text-peach text-sm uppercase tracking-[0.2em] mb-4 block">
            {eyebrow}
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-cream mb-4">
            {title}
          </h2>
          <p className="font-poppins text-cream/70 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={image}
            alt="Réalisation Léomentia Event"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover select-none"
          />
          <div className="absolute inset-0 bg-coffee/10" />

          {hotspots.map((h, i) => {
            const isOpen = active === i;
            const openLeft = h.x > 60; // ouvre la carte vers la gauche si proche du bord droit
            return (
              <div
                key={i}
                className="absolute"
                style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <button
                  type="button"
                  data-testid={`hotspot-${i}`}
                  aria-label={h.title}
                  onClick={() => setActive(isOpen ? null : i)}
                  className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${
                    isOpen ? 'bg-gold scale-110' : 'bg-white/90 hover:bg-white'
                  }`}
                >
                  {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-white/70 animate-ping" />
                  )}
                  {isOpen ? (
                    <X className="w-4 h-4 text-white relative z-10" strokeWidth={2} />
                  ) : (
                    <Plus className="w-4 h-4 text-coffee relative z-10" strokeWidth={2} />
                  )}
                </button>

                {isOpen && (
                  <div
                    data-testid={`hotspot-card-${i}`}
                    className={`absolute z-20 w-60 bg-cream rounded-lg shadow-xl p-4 top-1/2 -translate-y-1/2 ${
                      openLeft ? 'right-12' : 'left-12'
                    }`}
                  >
                    <p className="font-cormorant text-lg text-coffee leading-snug">
                      {h.title}
                    </p>
                    <p className="font-poppins text-sm text-coffee/70 mt-1">{h.desc}</p>
                    {h.link && (
                      <Link
                        to={h.link}
                        data-testid={`hotspot-link-${i}`}
                        className="inline-flex items-center mt-3 font-poppins text-sm text-gold hover:text-gold-dark transition-colors"
                      >
                        Lire l'article
                        <ArrowRight className="w-4 h-4 ml-1" strokeWidth={1.5} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InteractiveShowcase;
