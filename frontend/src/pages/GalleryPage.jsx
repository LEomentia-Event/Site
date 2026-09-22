import { Seo } from '@/components/Seo';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, Play, ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import InteractiveShowcase from '@/components/InteractiveShowcase';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Petites accroches par univers (par nom d'album Drive, insensible à la casse/accents)
const UNIVERSE_TAGLINES = {
  'champetre': 'Pampa, bois brut et douceur bohème',
  'boheme': 'Liberté, fleurs séchées et lumière dorée',
  'elegant': 'Raffinement, château et grandes tablées',
  'chateau': 'Raffinement, château et grandes tablées',
  'intimiste': 'Petit comité, émotion et proximité',
  'destination': 'Ailleurs, soleil et évasion',
  'douceur': 'Fleurs de saison et lumière tendre',
  'printaniere': 'Fleurs de saison et lumière tendre',
  'romantisme': 'Arches fleuries et élégance délicate',
  'fleuri': 'Arches fleuries et élégance délicate',
};

const norm = (s = '') =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const taglineFor = (name) => {
  const n = norm(name);
  const key = Object.keys(UNIVERSE_TAGLINES).find((k) => n.includes(k));
  return key ? UNIVERSE_TAGLINES[key] : 'Une ambiance pensée sur-mesure';
};

const PHOTO_CREDITS = [
  { keys: ['printaniere', 'douceur'], name: "L'Instant T Photographie" },
  { keys: ['intimiste'], name: 'Clément Lepan Photographie' },
  { keys: ['romantisme', 'fleuri'], name: 'Samuel Bocquillon Photographe' },
  { keys: ['strawberry', 'matcha'], name: 'Samuel Bocquillon Photographe' },
];

const creditFor = (name) => {
  const n = norm(name || '');
  const match = PHOTO_CREDITS.find((c) => c.keys.some((k) => n.includes(k)));
  return match ? match.name : null;
};

const GalleryPage = () => {
  const [albums, setAlbums] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const mapMongoToAlbum = (data) => {
      const byCat = {};
      data.forEach((it) => {
        (byCat[it.category] = byCat[it.category] || []).push({
          id: it.id,
          thumb: it.image_url,
          full: it.image_url,
          name: it.title,
        });
      });
      return Object.entries(byCat).map(([name, images], i) => ({
        id: `mongo-${i}`,
        name,
        count: images.length,
        images,
      }));
    };

    const fetchData = async () => {
      try {
        const driveRes = await axios.get(`${API}/drive/albums`);
        if (driveRes.data?.configured && driveRes.data.albums?.length) {
          setAlbums(driveRes.data.albums);
          if (driveRes.data.albums.length === 1) {
            setActiveAlbum(driveRes.data.albums[0]);
          }
        } else {
          const res = await axios.get(`${API}/gallery`);
          const a = mapMongoToAlbum(res.data);
          setAlbums(a);
          if (a.length === 1) setActiveAlbum(a[0]);
        }
      } catch (e) {
        console.error('Error fetching gallery:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const allImages = albums.flatMap((a) => a.images || []);
  const hasUniverses = albums.length > 1;

  const coverOf = (a) => a?.images?.[0]?.thumb || a?.videos?.[0]?.thumb || null;
  const countLabel = (a) => {
    const p = a?.count || (a?.images?.length || 0);
    const v = a?.video_count || (a?.videos?.length || 0);
    const parts = [];
    if (p) parts.push(`${p} ${p > 1 ? 'photos' : 'photo'}`);
    if (v) parts.push(`${v} ${v > 1 ? 'vidéos' : 'vidéo'}`);
    return parts.join(' · ') || '—';
  };

  const currentImages = activeAlbum ? (activeAlbum.images || []) : [];
  const currentVideos = activeAlbum ? (activeAlbum.videos || []) : [];

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };
  const closeLightbox = () => setSelectedImage(null);
  const goToPrevious = () => {
    const i = selectedIndex === 0 ? currentImages.length - 1 : selectedIndex - 1;
    setSelectedIndex(i);
    setSelectedImage(currentImages[i]);
  };
  const goToNext = () => {
    const i = selectedIndex === currentImages.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(i);
    setSelectedImage(currentImages[i]);
  };

  const openAlbum = (album) => {
    setActiveAlbum(album);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div data-testid="gallery-page" className="pt-20">
      <Seo
        title="Galerie de mariages — Léomentia Event"
        description="Explorez nos univers de mariage : champêtre, élégant, intimiste, destination. Une sélection de réalisations élégantes signées Léomentia Event."
        path="/galerie"
      />

      {/* Hero */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
            Portfolio
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-coffee mb-6">
            Explorez nos univers de mariage
          </h1>
          <p className="font-poppins text-lg text-coffee/70 max-w-2xl mx-auto">
            Chaque mariage raconte une ambiance. Choisissez l'univers qui vous
            ressemble et laissez-vous inspirer.
          </p>
        </div>
      </section>

      {/* Interactive showcase (photo à points chauds) */}
      <InteractiveShowcase />

      {/* Universe cards OR album grid */}
      {loading ? (
        <section className="py-24 bg-white text-center">
          <p className="font-poppins text-coffee/60">Chargement...</p>
        </section>
      ) : !activeAlbum && hasUniverses ? (
        <section className="py-16 lg:py-24 bg-white" data-testid="universe-grid">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-3 block">
                Nos univers
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl text-coffee">
                Dans quel décor vous imaginez-vous ?
              </h2>
              <div className="section-divider mt-6" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <button
                  key={album.id}
                  data-testid={`universe-card-${norm(album.name).split(' ').join('-')}`}
                  onClick={() => openAlbum(album)}
                  className="group relative text-left rounded-xl overflow-hidden aspect-[4/5] focus:outline-none bg-coffee"
                >
                  {coverOf(album) && (
                    <img
                      src={coverOf(album)}
                      alt={album.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-coffee/90 via-coffee/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-poppins text-xs text-peach uppercase tracking-[0.2em] mb-1">
                      {countLabel(album)}
                    </p>
                    <h3 className="font-cormorant text-2xl lg:text-3xl text-cream leading-tight">
                      {album.name}
                    </h3>
                    <p className="font-poppins text-sm text-cream/70 mt-1">
                      {taglineFor(album.name)}
                    </p>
                    <span className="inline-flex items-center mt-4 font-poppins text-sm text-peach opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      Découvrir <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
                    </span>
                  </div>
                </button>
              ))}

              {/* Toutes les photos */}
              <button
                data-testid="universe-card-toutes"
                onClick={() =>
                  openAlbum({ id: 'all', name: 'Toutes les photos', count: allImages.length, images: allImages })
                }
                className="group relative text-left rounded-xl overflow-hidden aspect-[4/5] bg-coffee focus:outline-none flex items-center justify-center"
              >
                <div className="text-center px-6">
                  <h3 className="font-cormorant text-2xl lg:text-3xl text-cream">
                    Toutes les photos
                  </h3>
                  <p className="font-poppins text-sm text-cream/60 mt-2">
                    {allImages.length} clichés
                  </p>
                  <span className="inline-flex items-center mt-4 font-poppins text-sm text-peach">
                    Tout voir <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {hasUniverses && (
              <button
                data-testid="back-to-universes"
                onClick={() => {
                  setActiveAlbum(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center font-poppins text-sm text-coffee/70 hover:text-gold transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Retour aux univers
              </button>
            )}

            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 data-testid="gallery-album-title" className="font-cormorant text-3xl sm:text-4xl text-coffee">
                  {activeAlbum?.name || 'Galerie'}
                </h2>
                {creditFor(activeAlbum?.name) && (
                  <p
                    data-testid="gallery-photo-credit"
                    className="font-poppins text-xs text-coffee/45 italic mt-1"
                  >
                    <Camera className="inline w-3 h-3 mr-1 -mt-0.5" strokeWidth={1.5} />
                    Crédit photo · {creditFor(activeAlbum?.name)}
                  </p>
                )}
              </div>
              <span data-testid="gallery-photo-count" className="font-poppins text-sm text-coffee/60 whitespace-nowrap">
                {countLabel(activeAlbum)}
              </span>
            </div>

            {currentImages.length > 0 && (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
                {currentImages.map((item, index) => (
                  <div
                    key={item.id}
                    data-testid={`gallery-item-${index}`}
                    className="mb-6 break-inside-avoid relative rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(item, index)}
                  >
                    <img
                      src={item.thumb}
                      alt={item.name || activeAlbum?.name}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coffee/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            )}

            {currentVideos.length > 0 && (
              <div className="mt-14" data-testid="album-videos">
                <div className="flex items-center mb-6">
                  <span className="font-poppins text-xs text-gold uppercase tracking-[0.2em]">
                    Vidéos
                  </span>
                  <span className="ml-4 h-px flex-1 bg-coffee/10" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentVideos.map((video, index) => (
                    <div
                      key={video.id}
                      data-testid={`album-video-${index}`}
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
            )}

            {currentImages.length === 0 && currentVideos.length === 0 && (
              <p className="text-center py-20 font-poppins text-coffee/60">
                Aucun média pour le moment
              </p>
            )}
          </div>
        </section>
      )}

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl bg-coffee/95 border-none p-0">
          <DialogTitle className="sr-only">Photo — {activeAlbum?.name}</DialogTitle>
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
            {currentImages.length > 1 && (
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
                  alt={selectedImage.name || activeAlbum?.name}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[80vh] object-contain rounded-lg animate-fade-in"
                />
                {creditFor(activeAlbum?.name) && (
                  <p className="text-center font-poppins text-xs text-white/45 italic mt-3">
                    <Camera className="inline w-3 h-3 mr-1 -mt-0.5" strokeWidth={1.5} />
                    Crédit photo · {creditFor(activeAlbum?.name)}
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
              Discutons de votre mariage
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
