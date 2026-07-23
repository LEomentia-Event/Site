import { Seo } from '@/components/Seo';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

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
            Retour au blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="blog-post-page" className="pt-20">
      <Seo
        title={`${post.title} — Léomentia Event`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.image_url}
      />
      {/* Hero */}
      <section className="relative py-24 lg:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${post.image_url}')` }}
        >
          <div className="absolute inset-0 bg-coffee/70"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center font-poppins text-peach hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Retour au blog
          </Link>
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
        </div>
      </section>

      {/* Content */}
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

      {/* Author */}
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
              <p className="font-cormorant text-xl text-coffee mb-1">
                {post.author}
              </p>
              <p className="font-poppins text-coffee/70 text-sm">
                Wedding Planner & Designer chez Léomentia Event
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-coffee">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl text-white mb-6">
            Besoin d'aide pour votre mariage ?
          </h2>
          <p className="font-poppins text-lg text-cream/80 max-w-2xl mx-auto mb-10">
            Je vous accompagne pour transformer votre vision en une expérience
            inoubliable.
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
              Réserver un appel découverte
              <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
