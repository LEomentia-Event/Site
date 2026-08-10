import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'leomentia-cookie-consent';

const applyAnalyticsConsent = (accepted) => {
  try {
    if (window.posthog) {
      if (accepted && window.posthog.opt_in_capturing) {
        window.posthog.opt_in_capturing();
      } else if (!accepted && window.posthog.opt_out_capturing) {
        window.posthog.opt_out_capturing();
      }
    }
  } catch (e) {
    /* no-op */
  }
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = localStorage.getItem(CONSENT_KEY);
    if (!choice) {
      // No choice yet: block non-essential cookies and show the banner
      applyAnalyticsConsent(false);
      setVisible(true);
    } else {
      applyAnalyticsConsent(choice === 'accepted');
    }
  }, []);

  const handleChoice = (accepted) => {
    localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'refused');
    applyAnalyticsConsent(accepted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      data-testid="cookie-banner"
      className="fixed bottom-0 left-0 right-0 z-[60] bg-coffee/95 backdrop-blur-md border-t border-gold/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <p className="font-poppins text-sm text-cream/85 leading-relaxed flex-1">
          Ce site utilise des cookies pour assurer son bon fonctionnement et,
          avec votre accord, mesurer son audience. Aucun cookie non essentiel
          n'est déposé sans votre consentement.{' '}
          <Link
            to="/politique-de-confidentialite"
            data-testid="cookie-learn-more"
            className="text-peach underline hover:text-gold transition-colors"
          >
            En savoir plus
          </Link>
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            data-testid="cookie-refuse"
            onClick={() => handleChoice(false)}
            className="font-poppins text-sm uppercase tracking-wider px-6 py-2.5 rounded border border-cream/40 text-cream hover:bg-cream/10 transition-colors"
          >
            Refuser
          </button>
          <button
            type="button"
            data-testid="cookie-accept"
            onClick={() => handleChoice(true)}
            className="font-poppins text-sm uppercase tracking-wider px-6 py-2.5 rounded bg-gold hover:bg-gold-dark text-white transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
