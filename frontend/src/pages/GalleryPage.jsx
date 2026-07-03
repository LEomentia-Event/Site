import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${API}/gallery`);
        setGallery(res.data);
      } catch (e) {
        console.error('Error fetching gallery:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['Tous', ...new Set(gallery.map((item) => item.category))];

  const filteredGallery =
    activeCategory === 'Tous'
      ? gallery
      : gallery.filter((item) => item.category === activeCategory);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    const newIndex =
      selectedIndex === 0 ? filteredGallery.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setSelectedImage(filteredGallery[newIndex]);
  };

  const goToNext = () => {
    const newIndex =
      selectedIndex === filteredGallery.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    setSelectedImage(filteredGallery[newIndex]);
  };

  return (
    <div data-testid="gallery-page" className="pt-20">
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
            Portfolio
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-coffee mb-6">
            Des mariages pensés dans les moindres détails
          </h1>
          <p className="font-poppins text-lg text-coffee/70 max-w-2xl mx-auto">
            Découvrez une sélection de mariages et événements que j'ai eu le
            plaisir d'accompagner.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-coffee/10 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                data-testid={`filter-${category.toLowerCase()}`}
                onClick={() => setActiveCategory(category)}
                variant={activeCategory === category ? 'default' : 'outline'}
                className={`font-poppins text-sm ${
                  activeCategory === category
                    ? 'bg-gold hover:bg-gold-dark text-white'
                    : 'border-coffee/20 text-coffee hover:bg-coffee/5'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <p className="font-poppins text-coffee/60">Chargement...</p>
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-poppins text-coffee/60">
                Aucune image dans cette catégorie
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((item, index) => (
                <div
                  key={item.id}
                  data-testid={`gallery-item-${item.id}`}
                  className="gallery-item aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(item, index)}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coffee/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div>
                      <h3 className="font-cormorant text-xl text-white mb-1">
                        {item.title}
                      </h3>
                      <span className="font-poppins text-sm text-peach">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl bg-coffee/95 border-none p-0">
          <div className="relative">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" strokeWidth={1.5} />
            </button>

            {filteredGallery.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" strokeWidth={1.5} />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" strokeWidth={1.5} />
                </button>
              </>
            )}

            {selectedImage && (
              <div className="p-4">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="w-full max-h-[80vh] object-contain rounded-lg"
                />
                <div className="mt-4 text-center">
                  <h3 className="font-cormorant text-2xl text-white">
                    {selectedImage.title}
                  </h3>
                  {selectedImage.description && (
                    <p className="font-poppins text-cream/70 mt-2">
                      {selectedImage.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl text-coffee mb-6">
            Envie de créer votre propre histoire ?
          </h2>
          <p className="font-poppins text-lg text-coffee/70 max-w-2xl mx-auto mb-10">
            Chaque mariage est unique. Discutons ensemble de votre vision pour
            créer un événement qui vous ressemble.
          </p>
          <a
            href="https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              data-testid="cta-calendly-gallery"
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

export default GalleryPage;
