import { Seo } from '@/components/Seo';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      id: 'complete',
      title: 'Organisation complète',
      price: '4 500€',
      subtitle: 'La tranquillité absolue',
      description:
        'Pour les couples qui souhaitent confier l\'intégralité de l\'organisation à une professionnelle. De la première idée au dernier invité parti, je gère tout.',
      features: [
        'Premier rendez-vous pour comprendre votre vision',
        'Recherche et sélection des prestataires',
        'Négociation des contrats',
        'Gestion complète du budget',
        'Création du rétroplanning détaillé',
        'Conception de la décoration et scénographie',
        'Suivi régulier et disponibilité illimitée',
        'Installation et coordination le jour J',
        'Présence de 8h du matin au dernier invité',
      ],
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
      popular: true,
    },
    {
      id: 'partial',
      title: 'Organisation partielle & design',
      price: '2 900€',
      subtitle: 'L\'accompagnement sur mesure',
      description:
        'Idéal si vous avez déjà commencé l\'organisation mais souhaitez un accompagnement professionnel pour finaliser le projet et créer une scénographie cohérente.',
      features: [
        'Audit complet de votre organisation actuelle',
        'Conseils sur les prestataires restants',
        'Création de la scénographie complète',
        'Coordination avec vos prestataires',
        'Planning détaillé du jour J',
        'Suivi jusqu\'au mariage',
        'Coordination le jour J',
      ],
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
      popular: false,
    },
    {
      id: 'coordination',
      title: 'Coordination jour J',
      price: '1 200€',
      subtitle: 'Le jour parfait',
      description:
        'Je prends les rênes quelques mois avant le mariage pour sécuriser chaque détail et coordonner tous les prestataires. Vous profitez pleinement de votre journée.',
      features: [
        'Prise en main 2 mois avant le mariage',
        'Rencontre avec tous vos prestataires',
        'Création du planning minute par minute',
        'Répétition générale si souhaitée',
        'Coordination complète le jour J',
        'Point de contact unique pour les prestataires',
        'Gestion des imprévus',
      ],
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
      popular: false,
    },
    {
      id: 'custom',
      title: 'Accompagnement sur mesure',
      price: 'Sur devis',
      subtitle: 'Vos besoins, votre budget',
      description:
        'Des prestations à la carte selon vos besoins spécifiques. Parce que chaque projet est unique.',
      features: [
        'Coaching organisation',
        'Création de papeterie',
        'Scénographie et décoration',
        'Conseil stratégique',
        'Désinstallation décoration',
        'Accompagnement prestataires',
      ],
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80',
      popular: false,
    },
  ];

  const options = [
    {
      title: 'Désinstallation décoration',
      price: '300€',
      description: 'Je gère le démontage et la récupération de toute la décoration après votre mariage.',
    },
    {
      title: 'Papeterie sur mesure',
      price: 'Sur devis',
      description: 'Faire-part, menus, marque-places... Une papeterie cohérente avec votre thème.',
    },
    {
      title: 'Scénographie clé en main',
      price: 'Sur devis',
      description: 'Conception complète de l\'univers visuel de votre mariage.',
    },
  ];

  return (
    <div data-testid="services-page" className="pt-20">
      <Seo
        title="Services & Formules — Léomentia Event | Wedding Planner"
        description="Organisation complète, organisation partielle & design, coordination jour J et accompagnement sur mesure. Des formules à partir de 1 200€ pour orchestrer votre mariage."
        path="/services"
      />
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
            Services
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-coffee mb-6">
            Mes accompagnements
          </h1>
          <p className="font-poppins text-lg text-coffee/70 max-w-2xl mx-auto">
            Des formules pensées pour s'adapter à chaque projet, chaque budget,
            chaque histoire. Trouvez celle qui vous correspond.
          </p>
          <p data-testid="services-price-mention" className="font-poppins text-gold text-lg tracking-wide mt-8">
            À partir de 1 200€
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={service.id}
                data-testid={`service-${service.id}`}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden img-zoom">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    {service.popular && (
                      <div className="absolute top-4 right-4 bg-gold text-white px-4 py-1 rounded-full font-poppins text-sm flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-white" strokeWidth={1.5} />
                        Populaire
                      </div>
                    )}
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="font-poppins text-gold text-sm uppercase tracking-wide">
                    {service.subtitle}
                  </span>
                  <div className="mt-2 mb-4">
                    <h2 className="font-cormorant text-3xl lg:text-4xl text-coffee">
                      {service.title}
                    </h2>
                  </div>
                  <p className="font-poppins text-coffee/70 mb-8 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start font-poppins text-coffee/80"
                      >
                        <CheckCircle
                          className="w-5 h-5 text-gold mr-3 flex-shrink-0 mt-0.5"
                          strokeWidth={1.5}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      data-testid={`cta-service-${service.id}`}
                      className="bg-gold hover:bg-gold-dark text-white font-poppins text-sm uppercase tracking-wider px-8 py-3"
                    >
                      Réserver un appel
                      <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="py-16 lg:py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
              Options
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl text-coffee mb-4">
              Prestations complémentaires
            </h2>
            <div className="section-divider mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {options.map((option, index) => (
              <Card
                key={index}
                className="bg-white border-coffee/10 hover:border-gold/30 transition-all duration-300"
              >
                <CardContent className="p-8 text-center">
                  <h3 className="font-cormorant text-xl text-coffee mb-2">
                    {option.title}
                  </h3>
                  <p className="font-poppins text-coffee/70">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-coffee">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl text-white mb-6">
            Vous ne savez pas quelle formule choisir ?
          </h2>
          <p className="font-poppins text-lg text-cream/80 max-w-2xl mx-auto mb-10">
            Pas de panique ! Réservez un appel découverte gratuit et je vous
            conseillerai la formule la plus adaptée à votre projet.
          </p>
          <a
            href="https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              data-testid="cta-calendly-services"
              className="bg-peach hover:bg-peach-light text-coffee font-poppins text-sm uppercase tracking-wider px-10 py-6 btn-shine"
            >
              Réserver mon appel découverte
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
