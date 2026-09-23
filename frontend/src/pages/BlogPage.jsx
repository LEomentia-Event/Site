import { Seo } from '@/components/Seo';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight, MapPin, Heart } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API}/blog`);
        setPosts(res.data);
      } catch (e) {
        console.error('Error fetching blog posts:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const realWeddings = posts.filter((p) => p.post_type === 'real_wedding');
  const articles = posts.filter((p) => p.post_type !== 'real_wedding');

  return (
    <div data-testid="blog-page" className="pt-20">
      <Seo
        title="Mariages réels & Inspirations — Léomentia Event"
        description="Des mariages réels racontés en détail et des conseils d'organisation pour préparer sereinement le plus beau jour de votre vie, par Léomentia Event."
        path="/blog"
      />

      {/* Hero */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
            Le Journal
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-coffee mb-6">
            Mariages réels & Inspirations
          </h1>
          <p className="font-poppins text-lg text-coffee/70 max-w-2xl mx-auto">
            Plongez dans de véritables histoires de couples, et retrouvez mes
            conseils pour organiser votre mariage sereinement.
          </p>
        </div>
      </section>

      {loading ? (
        <section className="py-24 bg-white text-center">
          <p className="font-poppins text-coffee/60">Chargement...</p>
        </section>
      ) : (
        <>
          {/* Real weddings */}
          {realWeddings.length > 0 && (
            <section className="py-16 lg:py-24 bg-white" data-testid="real-weddings-section">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-3 block">
                    Mariages réels
                  </span>
                  <h2 className="font-cormorant text-3xl sm:text-4xl text-coffee">
                    Ils l'ont vécu
                  </h2>
                  <div className="section-divider mt-6" />
                </div>

                <div className="space-y-12">
                  {realWeddings.map((post, i) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      data-testid={`real-wedding-${post.slug}`}
                      className="group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-coffee/10 bg-cream hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className={`aspect-[4/3] lg:aspect-auto overflow-hidden ${i % 2 ? 'lg:order-2' : ''}`}>
                        <img
                          src={post.image_url}
                          alt={post.couple_names || post.title}
                          width="800"
                          height="600"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        {post.couple_names && (
                          <p className="font-poppins text-xs text-gold uppercase tracking-[0.2em] mb-3 flex items-center">
                            <Heart className="w-3.5 h-3.5 mr-2 fill-gold text-gold" strokeWidth={1.5} />
                            {post.couple_names}
                          </p>
                        )}
                        <h3 className="font-cormorant text-2xl lg:text-3xl text-coffee mb-4 group-hover:text-gold transition-colors">
                          {post.title}
                        </h3>
                        <p className="font-poppins text-coffee/70 text-sm leading-relaxed mb-6">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-coffee/50 font-poppins text-sm">
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
                        <span className="inline-flex items-center mt-8 font-poppins text-sm text-gold uppercase tracking-wider">
                          Découvrir ce mariage
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Articles / conseils */}
          {articles.length > 0 && (
            <section className="py-16 lg:py-24 bg-cream" data-testid="articles-section">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-3 block">
                    Conseils & inspirations
                  </span>
                  <h2 className="font-cormorant text-3xl sm:text-4xl text-coffee">
                    Pour préparer sereinement
                  </h2>
                  <div className="section-divider mt-6" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((post) => (
                    <Card
                      key={post.id}
                      data-testid={`blog-post-${post.slug}`}
                      className="blog-card bg-white border-coffee/10 overflow-hidden group"
                    >
                      <Link to={`/blog/${post.slug}`}>
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            width="800"
                            height="450"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-6">
                          <span className="font-poppins text-xs text-gold uppercase tracking-wide px-3 py-1 bg-gold/10 rounded-full">
                            {post.category}
                          </span>
                          <h2 className="font-cormorant text-xl text-coffee mb-3 mt-4 group-hover:text-gold transition-colors">
                            {post.title}
                          </h2>
                          <p className="font-poppins text-coffee/70 text-sm mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center text-sm font-poppins text-coffee/50">
                            <Calendar className="w-4 h-4 mr-2" strokeWidth={1.5} />
                            {formatDate(post.created_at)}
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {posts.length === 0 && (
            <section className="py-24 bg-white text-center">
              <p className="font-poppins text-coffee/60">Aucun article pour le moment</p>
            </section>
          )}
        </>
      )}

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-coffee">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl text-white mb-6">
            Et si le prochain, c'était le vôtre ?
          </h2>
          <p className="font-poppins text-lg text-cream/80 max-w-2xl mx-auto mb-10">
            Racontez-moi votre projet : je vous aide à en faire une histoire
            aussi belle que celles-ci.
          </p>
          <a
            href="https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              data-testid="cta-contact-blog"
              className="bg-peach hover:bg-peach-light text-coffee font-poppins text-sm uppercase tracking-wider px-10 py-6"
            >
              Discutons de votre mariage
              <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
