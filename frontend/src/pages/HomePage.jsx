import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  Users,
  Clock,
  Heart,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Headphones,
  Sparkles,
} from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HomePage = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${API}/testimonials`);
        setTestimonials(res.data.slice(0, 3));
      } catch (e) {
        console.error('Error fetching testimonials:', e);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div data-testid="home-page" className="overflow-hidden">
      {/* Hero Section */}
      <section
        data-testid="hero-section"
        className="relative min-h-screen flex items-center justify-center grain"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-coffee/60 via-coffee/40 to-coffee/70"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
          <span className="inline-block font-poppins text-peach text-xs sm:text-sm uppercase tracking-[0.4em] mb-8 opacity-0 animate-fade-in animate-delay-100">
            Wedding Planner & Designer
          </span>
          <h1 className="font-cormorant font-light text-5xl sm:text-6xl lg:text-8xl text-white leading-[1.05] mb-8 opacity-0 animate-fade-in-up animate-delay-200">
            Organisez votre mariage
            <br />
            <span className="italic text-peach">sans stress</span>
          </h1>
          <p className="font-poppins text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in-up animate-delay-300">
            Je suis Virginie, Wedding Planner & Designer chez Léomentia Event.
            J'accompagne les futurs mariés qui souhaitent se libérer de la
            charge mentale et vivre un mariage fluide, élégant et parfaitement
            orchestré.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up animate-delay-400">
            <Link to="/services">
              <Button
                data-testid="cta-services"
                className="bg-peach hover:bg-peach-light text-coffee font-poppins text-sm uppercase tracking-wider px-8 py-6 btn-shine"
              >
                Découvrir mes services
              </Button>
            </Link>
            <a
              href="https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                data-testid="cta-calendly-hero"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-poppins text-sm uppercase tracking-wider px-8 py-6"
              >
                Réserver un appel découverte
              </Button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section data-testid="problems-section" className="py-24 lg:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-coffee mb-4">
              L'organisation d'un mariage peut vite devenir un casse-tête
            </h2>
            <div className="section-divider mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                text: "Vous manquez de temps pour gérer tous les prestataires",
              },
              {
                icon: Sparkles,
                text: "Vous avez trop d'idées et ne savez pas par où commencer",
              },
              {
                icon: Users,
                text: "La gestion du budget devient stressante",
              },
              {
                icon: Calendar,
                text: "Vous avez peur que le jour J devienne une course logistique",
              },
              {
                icon: Heart,
                text: "Vous voulez profiter de votre mariage, pas l'organiser",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white border-coffee/10 hover:border-gold/30 transition-all duration-300 group"
              >
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-peach/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <item.icon
                      className="w-5 h-5 text-gold"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="font-poppins text-coffee/80 leading-relaxed">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center font-poppins text-xl text-gold mt-12">
            C'est exactement pour cela que j'existe.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section
        data-testid="about-section"
        className="py-24 lg:py-32 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden img-zoom">
                <img
                  src="https://customer-assets.emergentagent.com/job_elegant-marriage/artifacts/cqg9s9l3_Virginie%20%26%20Alex-490.jpg"
                  alt="Virginie Bocquelet - Wedding Planner"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-peach/30 rounded-lg -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-gold/30 rounded-lg -z-10"></div>
            </div>

            <div>
              <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
                À propos
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-coffee mb-8">
                Une wedding planner à vos côtés pour sécuriser chaque détail
              </h2>
              <div className="space-y-6 font-poppins text-coffee/80 leading-relaxed">
                <p>
                  Je suis <strong className="text-coffee">Virginie</strong>,
                  fondatrice de Léomentia Event.
                </p>
                <p>
                  Ancienne opticienne, j'ai gardé la rigueur et la précision de
                  mon ancien métier, mais je les mets aujourd'hui au service des
                  moments de vie les plus précieux.
                </p>
                <p>
                  Entre 2019 et 2021, j'ai accompagné une Wedding Planner &
                  Designer sur de nombreux mariages. Cette expérience m'a appris
                  à anticiper les imprévus, coordonner les prestataires et
                  orchestrer chaque détail avec précision.
                </p>
                <p>
                  Mon rôle est simple : structurer votre projet, sécuriser votre
                  organisation et transformer votre vision en une expérience
                  inoubliable.
                </p>
                <p className="text-gold italic">
                  Ici, le "presque" n'existe pas.
                </p>
              </div>
              <Link to="/contact" className="inline-block mt-8">
                <Button
                  data-testid="cta-contact-about"
                  className="bg-gold hover:bg-gold-dark text-white font-poppins text-sm uppercase tracking-wider px-8 py-3"
                >
                  Me contacter
                  <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section data-testid="values-section" className="py-24 lg:py-32 bg-coffee">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-poppins text-peach text-sm uppercase tracking-[0.2em] mb-4 block">
              Mes valeurs
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
              Ce qui guide chaque projet
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Fiabilité',
                description:
                  'Ce qui est prévu est fait, dans les temps et avec soin.',
              },
              {
                icon: Headphones,
                title: 'Écoute',
                description:
                  'Je prends le temps de comprendre votre vision pour créer un mariage qui vous ressemble.',
              },
              {
                icon: Heart,
                title: 'Dévouement',
                description:
                  "Je coordonne l'invisible et sublime le visible pour créer une expérience mémorable.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="value-card bg-coffee-light/30 border border-peach/10 rounded-lg p-8 text-center hover:border-peach/30 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-peach/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon
                    className="w-8 h-8 text-peach"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-cormorant text-2xl text-peach mb-4">
                  {value.title}
                </h3>
                <p className="font-poppins text-cream/80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        data-testid="services-section"
        className="py-24 lg:py-32 bg-cream"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
              Services
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-coffee mb-4">
              Mes accompagnements
            </h2>
            <div className="section-divider mt-6"></div>
            <p data-testid="services-price-mention-home" className="font-poppins text-gold text-lg tracking-wide mt-6">
              À partir de 1 200€
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Organisation complète',
                price: '4 500€',
                description:
                  'Pour les couples qui souhaitent une tranquillité totale.',
                features: [
                  'Recherche et sélection des prestataires',
                  'Gestion du budget',
                  'Rétroplanning complet',
                  'Conception de la décoration',
                  'Installation et coordination du jour J',
                ],
                image:
                  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80',
              },
              {
                title: 'Organisation partielle & design',
                price: '2 900€',
                description:
                  "Idéal si vous avez déjà commencé l'organisation mais souhaitez un accompagnement professionnel pour finaliser.",
                features: [
                  'Audit de votre organisation',
                  'Création de la scénographie',
                  'Coordination des prestataires',
                  'Suivi personnalisé',
                ],
                image:
                  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
              },
              {
                title: 'Coordination jour J',
                price: '1 200€',
                description:
                  'Je prends les rênes quelques mois avant pour sécuriser chaque détail.',
                features: [
                  'Prise en main 2 mois avant',
                  'Coordination des prestataires',
                  'Gestion du timing jour J',
                  'Vous profitez pleinement',
                ],
                image:
                  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
              },
              {
                title: 'Accompagnement sur mesure',
                price: 'Sur devis',
                description:
                  'Des prestations à la carte selon vos besoins spécifiques.',
                features: [
                  'Coaching organisation',
                  'Création de papeterie',
                  'Scénographie et décoration',
                  'Conseil stratégique',
                ],
                image:
                  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80',
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="service-card bg-white border-coffee/10 overflow-hidden group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-8">
                  <div className="mb-4">
                    <h3 className="font-cormorant text-2xl text-coffee">
                      {service.title}
                    </h3>
                  </div>
                  <p className="font-poppins text-coffee/70 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
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
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button
                data-testid="cta-all-services"
                variant="outline"
                className="border-coffee text-coffee hover:bg-coffee hover:text-white font-poppins text-sm uppercase tracking-wider px-8 py-3"
              >
                Voir tous les services
                <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        data-testid="process-section"
        className="py-24 lg:py-32 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
              Processus
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-coffee mb-4">
              Comment je vous accompagne
            </h2>
            <div className="section-divider mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Appel découverte',
                description:
                  'Nous échangeons sur votre projet et vos besoins.',
              },
              {
                step: '02',
                title: 'Structuration',
                description: 'Budget, prestataires, rétroplanning.',
              },
              {
                step: '03',
                title: 'Préparation',
                description:
                  'Coordination et suivi de tous les prestataires.',
              },
              {
                step: '04',
                title: 'Jour J',
                description:
                  "Je gère toute l'organisation pour que vous profitiez pleinement.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-peach flex items-center justify-center mx-auto mb-6">
                  <span className="font-cormorant text-2xl text-coffee">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-cormorant text-xl text-coffee mb-3">
                  {step.title}
                </h3>
                <p className="font-poppins text-coffee/70">{step.description}</p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gold/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      {testimonials.length > 0 && (
        <section
          data-testid="testimonials-preview"
          className="py-24 lg:py-32 bg-cream"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
                Témoignages
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-coffee mb-4">
                Ce que disent les mariés
              </h2>
              <div className="section-divider mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="testimonial-card bg-white border-coffee/10"
                >
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-gold fill-gold"
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <p className="font-poppins text-coffee/80 leading-relaxed mb-6">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img
                          src={testimonial.image_url}
                          alt={testimonial.couple_names}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-cormorant text-lg text-coffee">
                          {testimonial.couple_names}
                        </p>
                        <p className="font-poppins text-sm text-gold">
                          {testimonial.wedding_date}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/temoignages">
                <Button
                  data-testid="cta-all-testimonials"
                  variant="outline"
                  className="border-coffee text-coffee hover:bg-coffee hover:text-white font-poppins text-sm uppercase tracking-wider px-8 py-3"
                >
                  Voir tous les témoignages
                  <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        data-testid="cta-section"
        className="py-24 lg:py-32 bg-coffee relative overflow-hidden grain"
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80')`,
            }}
          ></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Et si on parlait de votre mariage ?
          </h2>
          <p className="font-poppins text-lg text-cream/80 max-w-2xl mx-auto mb-10">
            Je vous propose un appel découverte gratuit pour faire le point sur
            votre organisation et voir comment je peux vous accompagner.
          </p>
          <a
            href="https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              data-testid="cta-calendly-final"
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

export default HomePage;
