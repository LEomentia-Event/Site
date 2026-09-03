import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Lien vers la fiche Google (repli tant que l'API/les avis ne sont pas configurés)
const GOOGLE_PLACE_URL = 'https://share.google/RnHw6giYQDWTgyeXV';
const FALLBACK_RATING = 5.0;
const FALLBACK_TOTAL = 4;

const GoogleLogo = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.29 9.14 5.38 12 5.38Z" />
  </svg>
);

const Stars = ({ rating = 0, size = 'w-4 h-4' }) => (
  <div className="flex" aria-label={`Note ${rating} sur 5`}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size} ${i < Math.round(rating) ? 'text-gold fill-gold' : 'text-coffee/20'}`}
        strokeWidth={1.5}
      />
    ))}
  </div>
);

const GoogleReviews = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    axios
      .get(`${API}/google-reviews`)
      .then((res) => active && setData(res.data))
      .catch(() => active && setData({ configured: false, reviews: [] }));
    return () => {
      active = false;
    };
  }, []);

  if (!data) return null; // en cours de chargement

  const hasReviews = data.configured && Array.isArray(data.reviews) && data.reviews.length > 0;

  return (
    <section data-testid="google-reviews-section" className="py-16 lg:py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <GoogleLogo />
            <span className="font-poppins text-sm uppercase tracking-[0.2em] text-coffee/70">
              Avis Google
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span
              data-testid="google-rating-value"
              className="font-cormorant text-5xl lg:text-6xl text-coffee leading-none"
            >
              {Number(hasReviews ? data.rating || FALLBACK_RATING : FALLBACK_RATING).toFixed(1)}
            </span>
            <div className="flex flex-col items-start">
              <Stars rating={hasReviews ? data.rating : FALLBACK_RATING} size="w-5 h-5" />
              <span className="font-poppins text-sm text-coffee/60 mt-1">
                {(hasReviews ? data.total_ratings : FALLBACK_TOTAL)} avis
              </span>
            </div>
          </div>
        </div>

        {hasReviews ? (
          <>
            <div className="reviews-mask overflow-hidden">
              <div className="reviews-marquee">
                {[...data.reviews, ...data.reviews].map((r, idx) => (
                <a
                  key={idx}
                  href={r.google_maps_uri || data.google_maps_uri || GOOGLE_PLACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`google-review-${idx}`}
                  className="w-80 flex-shrink-0 mr-6 bg-white border border-coffee/10 rounded-lg p-6 flex flex-col hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {r.author_photo ? (
                      <img
                        src={r.author_photo}
                        alt={r.author_name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gold/20 flex items-center justify-center font-cormorant text-xl text-gold">
                        {r.author_name?.charAt(0) || 'G'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-poppins text-sm font-medium text-coffee truncate">
                        {r.author_name}
                      </p>
                      <p className="font-poppins text-xs text-coffee/50">{r.relative_time}</p>
                    </div>
                    <GoogleLogo className="w-5 h-5 flex-shrink-0 opacity-80" />
                  </div>
                  <Stars rating={r.rating} />
                  <p className="font-poppins text-sm text-coffee/80 leading-relaxed mt-3 line-clamp-6">
                    {r.text}
                  </p>
                </a>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <a
                href={data.google_maps_uri || GOOGLE_PLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="google-reviews-cta"
                className="inline-flex items-center gap-3 border border-coffee/20 rounded-full px-8 py-3.5 font-poppins text-sm uppercase tracking-wider text-coffee hover:bg-coffee hover:text-cream transition-colors duration-300"
              >
                <GoogleLogo className="w-5 h-5" />
                Voir tous nos avis sur Google
              </a>
            </div>
          </>
        ) : (
          /* Repli : note réelle + lien vers la fiche Google */
          <div className="max-w-2xl mx-auto text-center" data-testid="google-reviews-fallback">
            <p className="font-poppins text-coffee/70 leading-relaxed mb-8">
              Nos mariés nous accordent une note de <strong>5/5</strong> sur Google.
              Retrouvez leurs avis vérifiés directement sur notre fiche.
            </p>
            <a
              href={GOOGLE_PLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="google-reviews-cta"
              className="inline-flex items-center gap-3 border border-coffee/20 rounded-full px-8 py-3.5 font-poppins text-sm uppercase tracking-wider text-coffee hover:bg-coffee hover:text-cream transition-colors duration-300"
            >
              <GoogleLogo className="w-5 h-5" />
              Lire nos avis sur Google
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default GoogleReviews;
