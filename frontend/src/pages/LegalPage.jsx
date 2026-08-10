import { Seo } from '@/components/Seo';

const Row = ({ label, children }) => (
  <div className="py-4 border-b border-coffee/10">
    <p className="font-poppins text-sm uppercase tracking-wider text-gold mb-1">
      {label}
    </p>
    <p className="font-poppins text-coffee/80 leading-relaxed">{children}</p>
  </div>
);

const LegalPage = () => {
  return (
    <div data-testid="legal-page" className="pt-20">
      <Seo
        title="Mentions légales — Léomentia Event"
        description="Mentions légales du site Léomentia Event : éditeur, SIREN/SIRET, TVA intracommunautaire, adresse, hébergeur et directeur de publication."
        path="/mentions-legales"
      />
      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
            Informations légales
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl text-coffee">
            Mentions légales
          </h1>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Row label="Éditeur du site">
            Virginie Bocquelet (nom commercial : LEOMENTIA), entrepreneur
            individuel.
          </Row>
          <Row label="SIREN">999 705 932</Row>
          <Row label="SIRET">999 705 932 00013</Row>
          <Row label="N° TVA intracommunautaire">FR28999705932</Row>
          <Row label="Adresse">39 B rue Émile Zola, 59135 Bellaing</Row>
          <Row label="Directeur de la publication">Virginie Bocquelet</Row>
          <Row label="Hébergeur du site">Emergent</Row>
        </div>
      </section>
    </div>
  );
};

export default LegalPage;
