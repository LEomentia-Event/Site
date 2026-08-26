import { Seo } from '@/components/Seo';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, User, ArrowLeft, ArrowRight, MapPin, Heart, Check, X } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/blog/${slug}`);
        setPost(res.data);
      } catch (e) {
        console.error('Error fetching post:', e);
        setError('Article non trouvé');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-cream flex items-center justify-center">
        <p className="font-poppins text-coffee/60">Chargement...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-20 min-h-screen bg-cream flex flex-col items-center justify-center">
        <p className="font-poppins text-coffee/60 mb-8">{error || 'Article non trouvé'}</p>
        <Link to="/blog">
          <Button variant="outline" className="border-coffee text-coffee">
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Retour au journal
          </Button>
        </Link>
      </div>
    );
  }

  const isRealWedding = post.post_type === 'real_wedding';
  const gallery = post.gallery_images || [];

  const CtaSection = () => (
    <section className="py-24 lg:py-32 bg-coffee">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-cormorant text-3xl sm:text-4xl text-white mb-6">
          {isRealWedding ? 'Envie du même bonheur ?' : "Besoin d'aide pour votre mariage ?"}
        </h2>
        <p className="font-poppins text-lg text-cream/80 max-w-2xl mx-auto mb-10">
          Je vous accompagne pour transformer votre vision en une expérience inoubliable.
        </p>
        <a
          href="https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            data-testid="cta-calendly-blogpost"
            className="bg-peach hover:bg-peach-light text-coffee font-poppins text-sm uppercase tracking-wider px-10 py-6"
          >
            Discutons de votre mariage
            <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
          </Button>
        </a>
      </div>
    </section>
  );

  return (
    <div data-testid="blog-post-page" className="pt-20">
      <Seo
        title={`${post.title} — Léomentia Event`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.image_url}
      />

      {/* Hero */}
      <section className="relative py-24 lg:py-40">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${post.image_url}')` }}>
          <div className="absolute inset-0 bg-coffee/70"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center font-poppins text-peach hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Retour au journal
          </Link>

          {isRealWedding && post.couple_names ? (
            <>
              <p className="font-poppins text-peach text-sm uppercase tracking-[0.2em] mb-4 flex items-center justify-center">
                <Heart className="w-4 h-4 mr-2 fill-peach text-peach" strokeWidth={1.5} />
                Mariage réel
              </p>
              <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
                {post.couple_names}
              </h1>
              <p className="font-cormorant text-xl sm:text-2xl text-cream/90 mb-6 italic">
                {post.title}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-cream/70 font-poppins text-sm">
                {(post.venue || post.location) && (
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    {[post.venue, post.location].filter(Boolean).join(' · ')}
                  </span>
                )}
                {post.event_date && (
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    {post.event_date}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <span className="block font-poppins text-peach text-sm uppercase tracking-wide mb-4">
                {post.category}
              </span>
              <h1 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
                {post.title}
              </h1>
              <div className="flex items-center justify-center space-x-6 text-cream/70 font-poppins text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  {formatDate(post.created_at)}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  {post.author}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none font-poppins text-coffee/80 
                       prose-headings:font-cormorant prose-headings:text-coffee 
                       prose-h2:text-2xl prose-h3:text-xl
                       prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-coffee
                       prose-ul:list-disc prose-ol:list-decimal
                       prose-li:marker:text-gold"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Prestations (real wedding) */}
      {isRealWedding && post.prestations?.length > 0 && (
        <section className="py-16 lg:py-20 bg-cream" data-testid="real-wedding-prestations">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-3 block">
                Mon accompagnement
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl text-coffee">
                Ce que j'ai orchestré
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.prestations.map((p, i) => (
                <div
                  key={i}
                  data-testid={`prestation-${i}`}
                  className="flex items-center bg-white rounded-lg border border-coffee/10 px-6 py-4"
                >
                  <span className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center mr-4 flex-shrink-0">
                    <Check className="w-4 h-4 text-gold" strokeWidth={2} />
                  </span>
                  <span className="font-poppins text-coffee/80">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photo gallery (real wedding) */}
      {isRealWedding && gallery.length > 0 && (
        <section className="py-16 lg:py-24 bg-white" data-testid="real-wedding-gallery">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-3 block">
                La galerie
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl text-coffee">
                Les plus beaux instants
              </h2>
              <div className="section-divider mt-6" />
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
              {gallery.map((src, index) => (
                <div
                  key={index}
                  data-testid={`rw-photo-${index}`}
                  className="mb-6 break-inside-avoid rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => setLightbox(src)}
                >
                  <img
                    src={src}
                    alt={`${post.couple_names || post.title} — photo ${index + 1}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-5xl bg-coffee/95 border-none p-0">
          <DialogTitle className="sr-only">Photo — {post.couple_names || post.title}</DialogTitle>
          <DialogDescription className="sr-only">Photo du mariage en plein écran.</DialogDescription>
          <div className="relative p-4">
            <button
              onClick={() => setLightbox(null)}
              data-testid="rw-lightbox-close"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" strokeWidth={1.5} />
            </button>
            {lightbox && (
              <img
                src={lightbox}
                alt="Photo du mariage"
                referrerPolicy="no-referrer"
                className="w-full max-h-[80vh] object-contain rounded-lg animate-fade-in"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Author (articles only) */}
      {!isRealWedding && (
        <section className="py-16 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-6 p-8 bg-white rounded-lg border border-coffee/10">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src="https://customer-assets.emergentagent.com/job_elegant-marriage/artifacts/cqg9s9l3_Virginie%20%26%20Alex-490.jpg"
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-cormorant text-xl text-coffee mb-1">{post.author}</p>
                <p className="font-poppins text-coffee/70 text-sm">
                  Wedding Planner & Designer chez Léomentia Event
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </div>
  );
};

export default BlogPostPage;
