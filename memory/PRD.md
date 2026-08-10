# Léomentia Event — PRD

## Problème / Objectif
Site vitrine premium et responsive pour "Léomentia Event" (Wedding Planner & Designer — Virginie Bocquelet). Objectif : convertir les visiteurs en leads via un design haut de gamme, des offres claires et une touche émotionnelle. **Langue : Français uniquement.**

## Stack
- Frontend : React (CRA + craco), Tailwind, shadcn/ui, react-router-dom, axios, lucide-react, sonner.
- Backend : FastAPI + MongoDB (motor). Routes préfixées `/api`.
- Preview URL (source de vérité) : `https://leomentia-preview.preview.emergentagent.com` (REACT_APP_BACKEND_URL).

## Identité de marque
- Couleurs : Café `#3d211a`, Pêche `#f7d58f`, Or `#99824d`, Crème `#FFFCF8`.
- Typographies (direction éditoriale, d'après PDF brandboard/Instagram) :
  - Titres : **Cormorant Garamond** (`font-cormorant`, serif).
  - Corps : **Poppins** (`font-poppins`).
  - Poiret One (`font-poiret`) disponible pour accents/chiffres (non utilisé actuellement).
- Logo SVG : `logo-light.svg` (blanc/or, sur hero sombre) et `logo-dark.svg` (café/or, fond clair) dans `src/assets/`.

## Pages & routes
- `/` Accueil, `/services` Services, `/galerie` Galerie, `/temoignages` Témoignages, `/blog` Blog, `/blog/:slug` Article, `/contact` Contact, `/politique-de-confidentialite` (Politique de confidentialité), `/mentions-legales` (Mentions légales).

## Intégrations
- Calendly (lien externe + embed iframe sur /contact) : `https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia`.
- **Google Drive** (galerie photos + vidéos) : backend `GET /api/drive/albums` (photos) et `GET /api/drive/videos` (vidéos) appellent l'API Drive v3 (REST + clé `GOOGLE_DRIVE_API_KEY`) sur le dossier public `GOOGLE_DRIVE_ROOT_FOLDER_ID`. Sous-dossiers = albums photo ; s'il n'y en a pas, toutes les images = album « Galerie ». Vidéos jouées via iframe Drive preview (`/file/d/{id}/preview`), vignette Drive avec repli si 401. Cache 5 min (auto-refresh ; `?refresh=1`). Repli Mongo si non configuré. Frontend : grille masonry + lazy loading + lightbox photo + section « Vidéos » avec lecture en modale. ✅ Testé e2e (19 photos + 26 vidéos). État Drive : pas de sous-dossiers → 1 album « Galerie ».
- **Brevo** (email transactionnel) via API REST `POST https://api.brevo.com/v3/smtp/email` (httpx async). Le formulaire de contact envoie 2 emails : notification à Virginie + confirmation au client. Config `.env` : `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `INSTAGRAM_URL`. ✅ Testé e2e.

## API
- `POST /api/contact`, `GET /api/contacts`
- `GET /api/testimonials`, `POST /api/testimonials`
- `GET /api/blog`, `GET /api/blog/{slug}`, `POST /api/blog`
- `GET /api/gallery`, `POST /api/gallery`
- `POST /api/seed` (seed manuel témoignages/blog/galerie)

## Réalisé (juin 2026)
- ✅ **Pré-rendu statique SEO** : `frontend/scripts/prerender.js` (postbuild) sert le dossier `build/`, rend chaque route avec `puppeteer-core@25.5.0` + Chrome système (`/usr/bin/google-chrome`), et écrit un `index.html` statique par route (avec `<head>` Helmet complet : title, description, OG, Twitter, canonical). Installé via `yarn add puppeteer-core --ignore-engines` (Node 20). Le postbuild ne bloque jamais le build (`|| echo 'prerender skipped'`) et le script skip proprement si Chrome absent (repli CSR). `src/index.js` : `hydrateRoot` si HTML prérendu présent, sinon `createRoot`. ✅ Vérifié : `yarn build` génère les 8 routes avec meta SEO par page.
- ✅ **Destinataire Brevo** mis à jour vers `contact@léomentia-event.fr` (forme punycode `contact@xn--lomentia-event-bkb.fr` dans le payload — même boîte, domaine IDN OVH réel). `RECIPIENT_EMAIL` configurable via `.env`. Reply-to client = cette adresse. ⚠️ **Expéditeur (`BREVO_SENDER_EMAIL`) laissé sur le Gmail vérifié** (pour envoyer DEPUIS contact@, la cliente doit authentifier son domaine dans Brevo).
- ⚠️ **BLOQUEUR EMAILS Brevo — restriction d'IP** : le compte Brevo a une liste d'IP autorisées activée ; l'IP serveur (`35.184.53.215` en preview, différente en prod) est refusée → **401 Unauthorized**, aucun email n'est envoyé. La cliente doit soit désactiver la restriction d'IP dans Brevo (Sécurité → IP autorisées), soit y ajouter les IP. À revérifier après action cliente.
- ✅ **Bouton « Gérer les cookies »** dans le footer (`data-testid="footer-manage-cookies"`) : réouvre le bandeau RGPD via un événement `open-cookie-consent` écouté par `CookieConsent.jsx`. Vérifié via screenshot (bandeau se rouvre).
- 🟠 **SEO canonical/OG** : `src/components/Seo.jsx` `SITE_URL` figé sur `https://leomentia-preview.emergent.host` — à pointer vers le vrai domaine de prod (`https://léomentia-event.fr`) une fois le domaine connecté au déploiement. Idem `public/sitemap.xml`.

- ✅ Conformité RGPD : (1) case de consentement (non pré-cochée) avant l'envoi du formulaire contact, bouton désactivé tant que non cochée, lien « En savoir plus » → politique de confidentialité ; (2) bandeau cookies bas de page au 1er chargement (Accepter/Refuser à égalité + En savoir plus), choix stocké en localStorage (`leomentia-cookie-consent`), analytics PostHog opt-in/opt-out selon consentement ; (3) page `/politique-de-confidentialite` ; (4) page `/mentions-legales` (SIREN 999 705 932, SIRET 999 705 932 00013, TVA FR28999705932, hébergeur Emergent) ; (5) liens footer vers les 2 pages. Composants : `CookieConsent.jsx`, `PrivacyPage.jsx`, `LegalPage.jsx`. ✅ Vérifié testing_agent iteration_10 (frontend 100%).
- ✅ Vidéo en fond du hero d'accueil : la vidéo Drive `seance-couple-mariage` (id `1rD4Rado7s4Vv9se5ZVyHponnJbMPAb9u`) remplace la photo, en autoplay/muet/boucle (`data-testid="hero-video"`), cadrée sur les visages/baiser via `object-[center_35%]`, avec image poster de repli + fondu d'apparition. Autoplay fiabilisé : `muted`/`defaultMuted` forcés via `useRef` + `play()` (fix React muted). Streamée via backend `GET /api/drive/stream/{file_id}` qui **télécharge une seule fois le fichier en cache disque** (`backend/media_cache/`, source `uc?export=download` → repli usercontent → repli API alt=media) puis le sert localement avec support Range (206). Évite les 403 de quota Drive. ✅ Vérifié bug_testing_agent iteration_9 (la vidéo se lance et boucle, frontend+backend 100%).
- ✅ Email affiché sur le site remplacé par `contact@léomentia-event.fr` (ContactPage + Footer + JSON-LD SEO). NB : les emails du formulaire partent toujours vers l'adresse Gmail (expéditeur vérifié Brevo) — le destinataire n'a pas été changé pour ne pas casser l'envoi.
- ✅ Correctif bug : logo invisible avant scroll sur l'accueil → logo SVG de marque (variante blanche/or sur hero sombre, café/or sur fond clair). Vérifié testing_agent (iteration_1, 5/5).
- ✅ Refonte design éditoriale : swap typographique global (Cormorant Garamond + Poppins), hero agrandi avec accent italique « sans stress », texture grain sur sections sombres, utilitaires CSS raffinés (grain, gold-underline, reveal, nav-glass), smooth scroll. Vérifié testing_agent (iteration_2, aucune régression).
- ✅ Section « Mes accompagnements » : suppression de tous les prix des formules (accueil + Services + options + puces sur-mesure) et mention unique « À partir de 1 200€ ». Vérifié testing_agent (iteration_3, frontend 100%).
- ✅ Embed Calendly inline (iframe) sur la page Contact (`calendly-embed-section` / `calendly-iframe`) en plus des boutons — charge calendly.com correctement, formulaire de contact toujours fonctionnel. Vérifié testing_agent (iteration_4, frontend 100%).

## Backlog / Prochaines actions
- ✅ (Fait) SEO : sitemap.xml + robots.txt (public/), index.html optimisé (lang fr, title, description, keywords, Open Graph, Twitter, canonical, JSON-LD ProfessionalService), et meta par page via react-helmet-async (composant `src/components/Seo.jsx`, HelmetProvider dans App.js).
- ✅ (Fait) Envoi réel des emails du formulaire de contact via Brevo (notification + confirmation client) — testé e2e.
- ✅ (Fait) Email de confirmation automatique au client (objet « Léomentia Event ✨ Parlons de votre joli projet », prénom auto, lien Instagram) en plus de la notification à Virginie.
- 🟢 Confirmer/ajuster le lien Instagram de l'email client : actuellement `INSTAGRAM_URL` (env, défaut = taplink https://taplink.cc/virginie.leomentia).
- 🟠 Auto-seed des données (galerie/témoignages/blog) au démarrage ou via script de déploiement — la base est vide sur un déploiement neuf (seed manuel via POST /api/seed).
- P1 : a11y — ajouter un `DialogTitle` (visually-hidden) dans la lightbox de la galerie (warning Radix).
- P2 : Intégrer les vraies photos de mariage fournies par la cliente dans la galerie/seed.
- P2 : Nettoyer les champs `price` inutilisés dans les tableaux de données de ServicesPage/HomePage.
- P2 : Envisager un embed Calendly (iframe) sur la page Contact en plus des boutons.
