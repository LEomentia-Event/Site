import { Seo } from '@/components/Seo';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    wedding_date: '',
    wedding_location: '',
    guest_count: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/contact`, formData);
      setIsSubmitted(true);
      toast.success('Message envoyé avec succès !');
      setFormData({
        name: '',
        email: '',
        wedding_date: '',
        wedding_location: '',
        guest_count: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page" className="pt-20">
      <Seo
        title="Contact — Léomentia Event | Réservez votre appel découverte"
        description="Parlons de votre mariage. Contactez Virginie Bocquelet, wedding planner & designer, ou réservez directement un appel découverte gratuit de 30 minutes."
        path="/contact"
      />
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
            Contact
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-coffee mb-6">
            Parlons de votre mariage
          </h1>
          <p className="font-poppins text-lg text-coffee/70 max-w-2xl mx-auto">
            Vous avez un projet ? Une question ? N'hésitez pas à me contacter,
            je vous répondrai dans les plus brefs délais.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="font-cormorant text-3xl text-coffee mb-8">
                Mes coordonnées
              </h2>

              <div className="space-y-6 mb-12">
                <a
                  href="tel:0661865155"
                  className="flex items-start p-4 rounded-lg hover:bg-cream transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-peach/20 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <Phone className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-poppins font-medium text-coffee mb-1">
                      Téléphone
                    </p>
                    <p className="font-poppins text-coffee/70">06 61 86 51 55</p>
                  </div>
                </a>

                <a
                  href="mailto:contact@léomentia-event.fr"
                  className="flex items-start p-4 rounded-lg hover:bg-cream transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-peach/20 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <Mail className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-poppins font-medium text-coffee mb-1">
                      Email
                    </p>
                    <p className="font-poppins text-coffee/70">
                      contact@léomentia-event.fr
                    </p>
                  </div>
                </a>

                <div className="flex items-start p-4">
                  <div className="w-12 h-12 rounded-full bg-peach/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-poppins font-medium text-coffee mb-1">
                      Zone d'intervention
                    </p>
                    <p className="font-poppins text-coffee/70">
                      France entière
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-4">
                  <div className="w-12 h-12 rounded-full bg-peach/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-poppins font-medium text-coffee mb-1">
                      Disponibilité
                    </p>
                    <p className="font-poppins text-coffee/70">
                      Du lundi au samedi, 9h - 19h
                    </p>
                  </div>
                </div>
              </div>

              {/* Calendly CTA */}
              <Card className="bg-coffee border-none">
                <CardContent className="p-8 text-center">
                  <h3 className="font-cormorant text-2xl text-peach mb-4">
                    Préférez un appel ?
                  </h3>
                  <p className="font-poppins text-cream/80 mb-6">
                    Réservez directement un créneau pour un appel découverte
                    gratuit de 30 minutes.
                  </p>
                  <a
                    href="https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      data-testid="cta-calendly-contact"
                      className="bg-peach hover:bg-peach-light text-coffee font-poppins text-sm uppercase tracking-wider px-8 py-3 w-full"
                    >
                      Réserver un appel découverte
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-cormorant text-3xl text-coffee mb-8">
                Envoyez-moi un message
              </h2>

              {isSubmitted ? (
                <Card className="bg-cream border-gold/20">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle
                        className="w-10 h-10 text-gold"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="font-cormorant text-2xl text-coffee mb-4">
                      Message envoyé !
                    </h3>
                    <p className="font-poppins text-coffee/70 mb-6">
                      Merci pour votre message. Je vous répondrai dans les plus
                      brefs délais.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="border-coffee text-coffee hover:bg-coffee hover:text-white"
                    >
                      Envoyer un autre message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="font-poppins text-coffee"
                      >
                        Nom complet *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        data-testid="input-name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-elegant border-coffee/20 focus:border-gold bg-white"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="font-poppins text-coffee"
                      >
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        data-testid="input-email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-elegant border-coffee/20 focus:border-gold bg-white"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="wedding_date"
                        className="font-poppins text-coffee"
                      >
                        Date du mariage
                      </Label>
                      <Input
                        id="wedding_date"
                        name="wedding_date"
                        data-testid="input-wedding-date"
                        value={formData.wedding_date}
                        onChange={handleChange}
                        className="input-elegant border-coffee/20 focus:border-gold bg-white"
                        placeholder="Ex: Juin 2026"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="wedding_location"
                        className="font-poppins text-coffee"
                      >
                        Lieu du mariage
                      </Label>
                      <Input
                        id="wedding_location"
                        name="wedding_location"
                        data-testid="input-wedding-location"
                        value={formData.wedding_location}
                        onChange={handleChange}
                        className="input-elegant border-coffee/20 focus:border-gold bg-white"
                        placeholder="Ville ou région"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="guest_count"
                      className="font-poppins text-coffee"
                    >
                      Nombre d'invités estimé
                    </Label>
                    <Input
                      id="guest_count"
                      name="guest_count"
                      data-testid="input-guest-count"
                      value={formData.guest_count}
                      onChange={handleChange}
                      className="input-elegant border-coffee/20 focus:border-gold bg-white"
                      placeholder="Ex: 80-100 personnes"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="font-poppins text-coffee"
                    >
                      Votre message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      data-testid="input-message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input-elegant border-coffee/20 focus:border-gold bg-white resize-none"
                      placeholder="Parlez-moi de votre projet..."
                    />
                  </div>

                  <Button
                    type="submit"
                    data-testid="submit-contact-form"
                    disabled={isSubmitting}
                    className="bg-gold hover:bg-gold-dark text-white font-poppins text-sm uppercase tracking-wider px-8 py-3 w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      'Envoi en cours...'
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="w-4 h-4 ml-2" strokeWidth={1.5} />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Calendly Embed Section */}
      <section data-testid="calendly-embed-section" className="py-16 lg:py-24 bg-coffee grain relative">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="font-poppins text-peach text-sm uppercase tracking-[0.2em] mb-4 block">
              Prise de rendez-vous
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl text-white mb-4">
              Réservez votre appel découverte
            </h2>
            <p className="font-poppins text-cream/80 max-w-2xl mx-auto">
              Choisissez directement le créneau qui vous convient pour un
              échange gratuit de 30 minutes, sans engagement.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden bg-cream shadow-xl">
            <iframe
              data-testid="calendly-iframe"
              src="https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia?hide_gdpr_banner=1&background_color=fffcf8&primary_color=99824d&text_color=3d211a"
              title="Réserver un appel découverte avec Virginie - Léomentia Event"
              className="w-full"
              style={{ height: '720px', border: 'none' }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Map/Links Section */}
      <section className="py-16 lg:py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cormorant text-3xl text-coffee mb-6">
            Retrouvez-moi aussi sur
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://taplink.cc/virginie.leomentia"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-taplink"
              className="inline-flex items-center font-poppins text-coffee bg-white border border-coffee/20 px-6 py-3 rounded-lg hover:border-gold hover:text-gold transition-colors"
            >
              Mon Taplink
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-instagram"
              className="inline-flex items-center font-poppins text-coffee bg-white border border-coffee/20 px-6 py-3 rounded-lg hover:border-gold hover:text-gold transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-facebook"
              className="inline-flex items-center font-poppins text-coffee bg-white border border-coffee/20 px-6 py-3 rounded-lg hover:border-gold hover:text-gold transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
