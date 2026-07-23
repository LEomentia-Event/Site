import { Seo } from '@/components/Seo';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight, User } from 'lucide-react';
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div data-testid="blog-page" className="pt-20">
      <Seo
        title="Blog mariage — Conseils & Inspirations | Léomentia Event"
        description="Conseils d'organisation, budget et inspirations pour préparer votre mariage sereinement, par une wedding planner & designer professionnelle."
        path="/blog"
      />
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-poppins text-gold text-sm uppercase tracking-[0.2em] mb-4 block">
            Blog
          </span>
          <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-coffee mb-6">
            Conseils & Inspirations
          </h1>
          <p className="font-poppins text-lg text-coffee/70 max-w-2xl mx-auto">
            Retrouvez mes conseils pour organiser votre mariage sereinement,
            ainsi que des inspirations pour créer un événement qui vous
            ressemble.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <p className="font-poppins text-coffee/60">Chargement...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-poppins text-coffee/60">
                Aucun article pour le moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  data-testid={`blog-post-${post.slug}`}
                  className="blog-card bg-cream border-coffee/10 overflow-hidden group"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="font-poppins text-xs text-gold uppercase tracking-wide px-3 py-1 bg-gold/10 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <h2 className="font-cormorant text-xl text-coffee mb-3 group-hover:text-gold transition-colors">
                        {post.title}
                      </h2>
                      <p className="font-poppins text-coffee/70 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-coffee/50">
                        <div className="flex items-center text-sm font-poppins">
                          <Calendar className="w-4 h-4 mr-2" strokeWidth={1.5} />
                          {formatDate(post.created_at)}
                        </div>
                        <div className="flex items-center text-sm font-poppins">
                          <User className="w-4 h-4 mr-2" strokeWidth={1.5} />
                          {post.author}
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 lg:py-32 bg-coffee">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl text-white mb-6">
            Vous avez une question ?
          </h2>
          <p className="font-poppins text-lg text-cream/80 max-w-2xl mx-auto mb-10">
            N'hésitez pas à me contacter pour discuter de votre projet ou pour
            toute question sur l'organisation de votre mariage.
          </p>
          <Link to="/contact">
            <Button
              data-testid="cta-contact-blog"
              className="bg-peach hover:bg-peach-light text-coffee font-poppins text-sm uppercase tracking-wider px-10 py-6"
            >
              Me contacter
              <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
