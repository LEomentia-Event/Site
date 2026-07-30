import { Seo } from '@/components/Seo';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const mapMongo = (data) =>
      data.map((it) => ({
        id: it.id,
        category: it.category,
        title: it.title,
        description: it.description,
        thumb: it.image_url,
        full: it.image_url,
      }));

    const fetchData = async () => {
      try {
        const driveRes = await axios.get(`${API}/drive/albums`);
        if (driveRes.data?.configured && driveRes.data.albums?.length) {
          const items = [];
          driveRes.data.albums.forEach((album) => {
            album.images.forEach((img) => {
              items.push({
                id: img.id,
                category: album.name,
                thumb: img.thumb,
                full: img.full,
              });
            });
          });
          setGallery(items);
        } else {
          const res = await axios.get(`${API}/gallery`);
          setGallery(mapMongo(res.data));
        }
      } catch (e) {
        console.error('Error fetching gallery:', e);
        try {
          const res = await axios.get(`${API}/gallery`);
          setGallery(mapMongo(res.data));
        } catch (err) {
          console.error('Fallback gallery failed:', err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    axios
      .get(`${API}/drive/videos`)
      .then((res) => {
        if (res.data?.configured) setVideos(res.data.videos || []);
      })
      .catch((e) => console.error('Error fetching videos:', e));
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

  const closeLightbox = () => setSelectedImage(null);

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
      <Seo
        title="Galerie de mariages — Léomentia Event"
        description="Découvrez une sélection de mariages et événements élégants orchestrés par Léomentia Event, wedding planner & designer en France."
        path="/galerie"
      />
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
      {categories.length > 1 && (
        <section className="py-8 bg-white border-b border-coffee/10 sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  data-testid={`filter-${category.toLowerCase().split(' ').join('-')}`}
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
      )}

      {/* Gallery Grid (masonry) */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <p className="font-poppins text-coffee/60">Chargement...</p>
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-poppins text-coffee/60">
                Aucune photo pour le moment
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between mb-10">
                <h2
                  data-testid="gallery-album-title"
                  className="font-cormorant text-3xl sm:text-4xl text-coffee"
                >
                  {activeCategory === 'Tous' ? 'Toutes les photos' : activeCategory}
                </h2>
                <span
                  data-testid="gallery-photo-count"
                  className="font-poppins text-sm text-coffee/60 whitespace-nowrap"
                >
                  {filteredGallery.length}{' '}
                  {filteredGallery.length > 1 ? 'photos' : 'photo'}
                </span>
              </div>

              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
                {filteredGallery.map((item, index) => (
                  <div
                    key={item.id}
                    data-testid={`gallery-item-${index}`}
                    className="mb-6 break-inside-avoid relative rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(item, index)}
                  >
                    <img
                      src={item.thumb}
                      alt={item.title || item.category}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coffee/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <span className="font-poppins text-sm text-peach uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl bg-coffee/95 border-none p-0">
          <DialogTitle className="sr-only">
            Photo — {selectedImage?.category}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Photo de la galerie Léomentia Event en plein écran.
          </DialogDescription>
          <div className="relative">
            <button
              onClick={closeLightbox}
              data-testid="lightbox-close"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" strokeWidth={1.5} />
            </button>

            {filteredGallery.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  data-testid="lightbox-prev"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" strokeWidth={1.5} />
                </button>
                <button
                  onClick={goToNext}
                  data-testid="lightbox-next"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" strokeWidth={1.5} />
                </button>
              </>
            )}

            {selectedImage && (
              <div className="p-4">
                <img
                  key={selectedImage.id}
                  src={selectedImage.full}
                  alt={selectedImage.title || selectedImage.category}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[80vh] object-contain rounded-lg animate-fade-in"
                />
                <div className="mt-4 text-center">
                  <span className="font-poppins text-sm text-peach uppercase tracking-wider">
                    {selectedImage.category}
                  </span>
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

      {/* Videos */}
      {videos.length > 0 && (
        <section className="py-16 lg:py-24 bg-cream" data-testid="video-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
                Vidéos
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-coffee">
                L'émotion en mouvement
              </h2>
              <div className="section-divider mt-6"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  data-testid={`video-item-${index}`}
                  onClick={() => setSelectedVideo(video)}
                  className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group bg-coffee"
                >
                  <img
                    src={video.thumb}
                    alt={video.name}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-coffee/30 group-hover:bg-coffee/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 text-coffee ml-1" fill="currentColor" strokeWidth={0} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Lightbox */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl bg-coffee/95 border-none p-0">
          <DialogTitle className="sr-only">Vidéo — {selectedVideo?.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Lecture d'une vidéo de la galerie Léomentia Event.
          </DialogDescription>
          <button
            onClick={() => setSelectedVideo(null)}
            data-testid="video-close"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" strokeWidth={1.5} />
          </button>
          {selectedVideo && (
            <div className="aspect-video w-full">
              <iframe
                data-testid="video-iframe"
                src={selectedVideo.embed}
                title={selectedVideo.name}
                className="w-full h-full rounded-lg"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ border: 'none' }}
              />
            </div>
          )}
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
