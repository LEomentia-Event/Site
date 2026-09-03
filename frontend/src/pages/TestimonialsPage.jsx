import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/button';
import GoogleReviews from '@/components/GoogleReviews';

const TestimonialsPage = () => {
  return (
    <div data-testid="testimonials-page" className="pt-20">
      <Seo
        title="Avis clients — Léomentia Event"
        description="Les avis Google des couples accompagnés par Virginie Bocquelet dans l'organisation de leur mariage. Découvrez leurs retours vérifiés sur Léomentia Event."
        path="/temoignages"
      />
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
            Avis clients
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-coffee mb-6">
            Ce que disent les mariés
          </h1>
          <p className="font-poppins text-lg text-coffee/70 max-w-2xl mx-auto">
            Des retours authentiques, directement issus de notre fiche Google.
          </p>
        </div>
      </section>

      {/* Avis Google (source unique) */}
      <GoogleReviews />

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-coffee">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl text-white mb-6">
            Prêts à vivre votre plus belle journée ?
          </h2>
          <p className="font-poppins text-lg text-cream/80 max-w-2xl mx-auto mb-10">
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
              className="bg-peach hover:bg-peach-light text-coffee font-poppins text-sm uppercase tracking-wider px-10 py-6"
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
