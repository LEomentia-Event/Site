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
- `/` Accueil, `/services` Services, `/galerie` Galerie, `/temoignages` Témoignages, `/blog` Blog, `/blog/:slug` Article, `/contact` Contact.

## Intégrations
- Calendly (lien externe) : `https://calendly.com/virginie-bocquelet-pro/rdv-avec-virginie-de-leomentia`.
- Resend (email formulaire contact) via SDK `resend` — **RESEND_API_KEY non configurée** ⇒ le formulaire enregistre en base et renvoie 200 mais N'ENVOIE PAS d'email tant que la clé n'est pas fournie.

## API
- `POST /api/contact`, `GET /api/contacts`
- `GET /api/testimonials`, `POST /api/testimonials`
- `GET /api/blog`, `GET /api/blog/{slug}`, `POST /api/blog`
- `GET /api/gallery`, `POST /api/gallery`
- `POST /api/seed` (seed manuel témoignages/blog/galerie)

## Réalisé (juin 2026)
- ✅ Correctif bug : logo invisible avant scroll sur l'accueil → logo SVG de marque (variante blanche/or sur hero sombre, café/or sur fond clair). Vérifié testing_agent (iteration_1, 5/5).
- ✅ Refonte design éditoriale : swap typographique global (Cormorant Garamond + Poppins), hero agrandi avec accent italique « sans stress », texture grain sur sections sombres, utilitaires CSS raffinés (grain, gold-underline, reveal, nav-glass), smooth scroll. Vérifié testing_agent (iteration_2, aucune régression).
- ✅ Section « Mes accompagnements » : suppression de tous les prix des formules (accueil + Services + options + puces sur-mesure) et mention unique « À partir de 1 200€ ». Vérifié testing_agent (iteration_3, frontend 100%).
- ✅ Embed Calendly inline (iframe) sur la page Contact (`calendly-embed-section` / `calendly-iframe`) en plus des boutons — charge calendly.com correctement, formulaire de contact toujours fonctionnel. Vérifié testing_agent (iteration_4, frontend 100%).

## Backlog / Prochaines actions
- P0 : Fournir une clé Resend pour l'envoi réel des emails du formulaire de contact (sinon, envisager auto-seed au démarrage ou brancher un autre service).
- P1 : Auto-seed des données (galerie/témoignages/blog) au démarrage ou via script de déploiement — la base est vide sur un déploiement neuf (seed manuel via POST /api/seed).
- P1 : a11y — ajouter un `DialogTitle` (visually-hidden) dans la lightbox de la galerie (warning Radix).
- P2 : Intégrer les vraies photos de mariage fournies par la cliente dans la galerie/seed.
- P2 : Nettoyer les champs `price` inutilisés dans les tableaux de données de ServicesPage/HomePage.
- P2 : Envisager un embed Calendly (iframe) sur la page Contact en plus des boutons.
