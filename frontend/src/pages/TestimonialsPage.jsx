import { Seo } from '@/components/Seo';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${API}/testimonials`);
        setTestimonials(res.data);
      } catch (e) {
        console.error('Error fetching testimonials:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div data-testid="testimonials-page" className="pt-20">
      <Seo
        title="Témoignages clients — Léomentia Event"
        description="Les retours des couples accompagnés par Virginie Bocquelet dans l'organisation de leur mariage. Découvrez leurs expériences avec Léomentia Event."
        path="/temoignages"
      />
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
            Témoignages
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-coffee mb-6">
            Ce que disent les mariés
          </h1>
          <p className="font-poppins text-lg text-coffee/70 max-w-2xl mx-auto">
            Découvrez les retours de couples que j'ai eu le bonheur d'accompagner
            dans l'organisation de leur mariage.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <p className="font-poppins text-coffee/60">Chargement...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-poppins text-coffee/60">
                Aucun témoignage pour le moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  data-testid={`testimonial-${testimonial.id}`}
                  className="bg-cream border-coffee/10 overflow-hidden group hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {testimonial.image_url && (
                        <div className="md:w-1/3 aspect-square md:aspect-auto">
                          <img
                            src={testimonial.image_url}
                            alt={testimonial.couple_names}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className={`p-8 ${testimonial.image_url ? 'md:w-2/3' : 'w-full'} relative`}>
                        <Quote
                          className="absolute top-6 right-6 w-12 h-12 text-peach/30"
                          strokeWidth={1}
                        />
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-gold fill-gold"
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                        <p className="font-poppins text-coffee/80 leading-relaxed mb-6 relative z-10">
                          "{testimonial.content}"
                        </p>
                        <div>
                          <p className="font-cormorant text-xl text-coffee">
                            {testimonial.couple_names}
                          </p>
                          <p className="font-poppins text-sm text-gold">
                            Mariage {testimonial.wedding_date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-coffee">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50+', label: 'Mariages accompagnés' },
              { number: '100%', label: 'Couples satisfaits' },
              { number: '5', label: 'Années d\'expérience' },
              { number: '5/5', label: 'Note moyenne' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-cormorant text-4xl lg:text-5xl text-peach mb-2">
                  {stat.number}
                </p>
                <p className="font-poppins text-cream/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl text-coffee mb-6">
            Prêts à vivre votre plus belle journée ?
          </h2>
          <p className="font-poppins text-lg text-coffee/70 max-w-2xl mx-auto mb-10">
            Rejoignez les couples qui ont fait confiance à Léomentia Event pour
            leur mariage.
          </p>
          <a
            href="https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              data-testid="cta-calendly-testimonials"
              className="bg-gold hover:bg-gold-dark text-white font-poppins text-sm uppercase tracking-wider px-10 py-6"
            >
              Réserver un appel découverte
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;
