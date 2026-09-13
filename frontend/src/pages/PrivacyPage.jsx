import { Seo } from '@/components/Seo';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-cormorant text-2xl sm:text-3xl text-coffee mb-4">
      {title}
    </h2>
    <div className="font-poppins text-coffee/75 leading-relaxed space-y-3">
      {children}
    </div>
  </div>
);

const PrivacyPage = () => {
  return (
    <div data-testid="privacy-page" className="pt-20">
      <Seo
        title="Politique de confidentialité — Léomentia Event"
        description="Politique de confidentialité de Léomentia Event : données collectées, finalités, durée de conservation, destinataires, vos droits et information sur les cookies."
        path="/politique-de-confidentialite"
      />
      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
            Confidentialité
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl text-coffee">
            Politique de confidentialité
          </h1>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-poppins text-coffee/75 leading-relaxed mb-12">
            La présente politique de confidentialité décrit la manière dont vos
            données personnelles sont collectées et traitées lorsque vous
            utilisez le site Léomentia Event, conformément au Règlement Général
            sur la Protection des Données (RGPD).
          </p>

          <Section title="Responsable du traitement">
            <p>
              Virginie Bocquelet (LEOMENTIA), entrepreneur individuel.
              <br />
              39 B rue Émile Zola, 59135 Bellaing.
            </p>
          </Section>

          <Section title="Finalité de la collecte">
            <p>
              Les données que vous transmettez via le formulaire de contact sont
              collectées dans le seul but de répondre à vos demandes de contact
              et de devis.
            </p>
          </Section>

          <Section title="Données collectées">
            <p>
              Dans le cadre de votre demande, les données suivantes peuvent être
              collectées : nom, adresse email, numéro de téléphone et le contenu
              de votre message.
            </p>
          </Section>

          <Section title="Durée de conservation">
            <p>
              Vos données sont conservées pendant une durée de 3 ans à compter
              de notre dernier contact, puis supprimées.
            </p>
          </Section>

          <Section title="Destinataires des données">
            <p>
              Vos données sont exclusivement destinées à Virginie Bocquelet
              (LEOMENTIA) et ne sont ni cédées ni vendues à des tiers.
            </p>
          </Section>

          <Section title="Vos droits">
            <p>
              Conformément à la réglementation, vous disposez d'un droit
              d'accès, de rectification, de suppression et d'opposition
              concernant vos données personnelles.
            </p>
            <p>
              Pour exercer ces droits, vous pouvez nous contacter à l'adresse
              suivante :{' '}
              <a
                href="mailto:contact@leomentia-event.fr"
                className="text-gold hover:underline"
              >
                contact@leomentia-event.fr
              </a>
              .
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Le site utilise des cookies afin d'assurer son bon fonctionnement
              et, sous réserve de votre consentement, de mesurer son audience
              (statistiques de fréquentation).
            </p>
            <p>
              Les cookies de mesure d'audience ne sont déposés qu'après avoir
              recueilli votre consentement via le bandeau prévu à cet effet.
              Leur durée de conservation n'excède pas 13 mois.
            </p>
            <p>
              Vous pouvez retirer votre consentement à tout moment. Pour cela,
              supprimez les cookies de votre navigateur : le bandeau de
              consentement s'affichera de nouveau lors de votre prochaine visite.
            </p>
          </Section>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
