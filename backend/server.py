from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import asyncio
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Brevo (transactional email) configuration
BREVO_API_KEY = os.environ.get('BREVO_API_KEY', '')
BREVO_SENDER_EMAIL = os.environ.get('BREVO_SENDER_EMAIL', '')
BREVO_SENDER_NAME = os.environ.get('BREVO_SENDER_NAME', 'Léomentia Event')
RECIPIENT_EMAIL = 'virginie.bocquelet.pro@gmail.com'
BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'
INSTAGRAM_URL = os.environ.get('INSTAGRAM_URL', 'https://www.instagram.com/leomentia.event/')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class ContactForm(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    wedding_date: Optional[str] = None
    wedding_location: Optional[str] = None
    guest_count: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactFormCreate(BaseModel):
    name: str
    email: EmailStr
    wedding_date: Optional[str] = None
    wedding_location: Optional[str] = None
    guest_count: Optional[str] = None
    message: str

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    couple_names: str
    wedding_date: str
    content: str
    rating: int = 5
    image_url: Optional[str] = None
    is_featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TestimonialCreate(BaseModel):
    couple_names: str
    wedding_date: str
    content: str
    rating: int = 5
    image_url: Optional[str] = None
    is_featured: bool = False

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    category: str
    author: str = "Virginie Bocquelet"
    is_published: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    image_url: Optional[str] = None
    category: str
    author: str = "Virginie Bocquelet"
    is_published: bool = True

class GalleryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    image_url: str
    category: str
    is_featured: bool = False
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GalleryItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: str
    category: str
    is_featured: bool = False
    order: int = 0

# ============== ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "Léomentia Event API"}

async def send_brevo_email(to_email: str, to_name: str, subject: str, html_content: str, reply_to: Optional[dict] = None):
    """Send a single transactional email via Brevo. Returns True on success."""
    if not (BREVO_API_KEY and BREVO_SENDER_EMAIL):
        logger.warning("BREVO_API_KEY/BREVO_SENDER_EMAIL not configured; email skipped")
        return False
    payload = {
        "sender": {"email": BREVO_SENDER_EMAIL, "name": BREVO_SENDER_NAME},
        "to": [{"email": to_email, "name": to_name}],
        "subject": subject,
        "htmlContent": html_content,
    }
    if reply_to:
        payload["replyTo"] = reply_to
    try:
        async with httpx.AsyncClient(timeout=15) as http_client:
            resp = await http_client.post(
                BREVO_API_URL,
                headers={
                    "api-key": BREVO_API_KEY,
                    "content-type": "application/json",
                    "accept": "application/json",
                },
                json=payload,
            )
        if resp.status_code in (200, 201):
            logger.info(f"Brevo email sent to {to_email} ({subject})")
            return True
        logger.error(f"Brevo email failed ({resp.status_code}) to {to_email}: {resp.text}")
        return False
    except Exception as e:
        logger.error(f"Failed to send Brevo email to {to_email}: {str(e)}")
        return False


# Contact endpoints
@api_router.post("/contact", response_model=ContactForm)
async def submit_contact_form(form_data: ContactFormCreate):
    contact = ContactForm(**form_data.model_dump())
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contacts.insert_one(doc)
    
    # 1) Notification email to Virginie
    admin_html = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #3d211a; border-bottom: 2px solid #99824d; padding-bottom: 10px;">
                    Nouvelle demande de contact - Léomentia Event
                </h2>
                <div style="background: #FFFCF8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Nom:</strong> {contact.name}</p>
                    <p><strong>Email:</strong> {contact.email}</p>
                    <p><strong>Date du mariage:</strong> {contact.wedding_date or 'Non spécifiée'}</p>
                    <p><strong>Lieu:</strong> {contact.wedding_location or 'Non spécifié'}</p>
                    <p><strong>Nombre d'invités:</strong> {contact.guest_count or 'Non spécifié'}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background: white; padding: 15px; border-left: 3px solid #99824d;">
                        {contact.message}
                    </p>
                </div>
                <p style="color: #666; font-size: 12px;">
                    Envoyé depuis le site Léomentia Event
                </p>
            </div>
            """
    await send_brevo_email(
        to_email=RECIPIENT_EMAIL,
        to_name="Virginie Bocquelet",
        subject=f"Nouvelle demande de {contact.name} - Léomentia Event",
        html_content=admin_html,
        reply_to={"email": contact.email, "name": contact.name},
    )

    # 2) Confirmation email to the client
    first_name = contact.name.split(' ')[0] if contact.name else ''
    client_html = f"""
            <div style="font-family: 'Georgia', 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background: #FFFCF8; padding: 40px 32px; color: #3d211a;">
                <p style="text-align: center; letter-spacing: 4px; text-transform: uppercase; font-size: 12px; color: #99824d; font-family: Arial, sans-serif; margin-bottom: 24px;">
                    Léomentia Event
                </p>
                <p style="font-size: 16px; line-height: 1.7;">Bonjour {first_name},</p>
                <p style="font-size: 16px; line-height: 1.7;">
                    Je vous remercie chaleureusement pour votre message et pour l'intérêt que vous portez à mon travail.
                </p>
                <p style="font-size: 16px; line-height: 1.7;">
                    C'est toujours un immense plaisir de découvrir de nouveaux projets et d'imaginer les contours d'un événement unique, sur mesure et qui vous ressemble.
                </p>
                <p style="font-size: 16px; line-height: 1.7;">
                    Votre demande est bien arrivée entre mes mains. Je l'étudie avec la plus grande attention et je reviens vers vous sous <strong>48 heures (jours ouvrés)</strong> pour que nous puissions échanger de vive voix sur vos envies, vos attentes et l'organisation de ce joli moment.
                </p>
                <p style="font-size: 16px; line-height: 1.7;">
                    En attendant, n'hésitez pas à faire un tour sur <a href="{INSTAGRAM_URL}" style="color: #99824d; font-weight: bold; text-decoration: none;">mon compte Instagram</a> pour découvrir mon univers et mes dernières réalisations.
                </p>
                <p style="font-size: 16px; line-height: 1.7; margin-top: 28px;">À très bientôt,</p>
                <p style="font-family: 'Georgia', serif; font-size: 22px; color: #99824d; margin-top: 4px;">Virginie</p>
                <hr style="border: none; border-top: 1px solid #e6ddcf; margin: 32px 0 16px;" />
                <p style="text-align: center; font-size: 12px; color: #99824d; font-family: Arial, sans-serif;">
                    Léomentia Event — Wedding Planner &amp; Designer
                </p>
            </div>
            """
    await send_brevo_email(
        to_email=contact.email,
        to_name=contact.name,
        subject="Léomentia Event \u2728 Parlons de votre joli projet",
        html_content=client_html,
        reply_to={"email": RECIPIENT_EMAIL, "name": "Virginie - Léomentia Event"},
    )

    return contact

@api_router.get("/contacts", response_model=List[ContactForm])
async def get_contacts():
    contacts = await db.contacts.find({}, {"_id": 0}).to_list(1000)
    for contact in contacts:
        if isinstance(contact.get('created_at'), str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at'])
    return contacts

# Testimonials endpoints
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(100)
    for t in testimonials:
        if isinstance(t.get('created_at'), str):
            t['created_at'] = datetime.fromisoformat(t['created_at'])
    return testimonials

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(data: TestimonialCreate):
    testimonial = Testimonial(**data.model_dump())
    doc = testimonial.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.testimonials.insert_one(doc)
    return testimonial

# Blog endpoints
@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts():
    posts = await db.blog_posts.find({"is_published": True}, {"_id": 0}).to_list(100)
    for post in posts:
        if isinstance(post.get('created_at'), str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
    return posts

@api_router.get("/blog/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    if isinstance(post.get('created_at'), str):
        post['created_at'] = datetime.fromisoformat(post['created_at'])
    return post

@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(data: BlogPostCreate):
    post = BlogPost(**data.model_dump())
    doc = post.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.blog_posts.insert_one(doc)
    return post

# Gallery endpoints
@api_router.get("/gallery", response_model=List[GalleryItem])
async def get_gallery_items():
    items = await db.gallery.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    for item in items:
        if isinstance(item.get('created_at'), str):
            item['created_at'] = datetime.fromisoformat(item['created_at'])
    return items

@api_router.post("/gallery", response_model=GalleryItem)
async def create_gallery_item(data: GalleryItemCreate):
    item = GalleryItem(**data.model_dump())
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.gallery.insert_one(doc)
    return item

# Seed data endpoint (for initial setup)
@api_router.post("/seed")
async def seed_data():
    # Check if already seeded
    existing = await db.testimonials.find_one()
    if existing:
        return {"message": "Data already seeded"}
    
    # Seed testimonials
    testimonials = [
        {
            "id": str(uuid.uuid4()),
            "couple_names": "Marie & Thomas",
            "wedding_date": "Juin 2024",
            "content": "Virginie nous a permis de vivre notre mariage sans stress. Tout était parfaitement organisé, chaque détail avait été pensé. Nous avons pu profiter pleinement de notre journée grâce à elle.",
            "rating": 5,
            "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
            "is_featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "couple_names": "Sophie & Pierre",
            "wedding_date": "Septembre 2024",
            "content": "Une organisation impeccable du début à la fin. Virginie a su comprendre nos attentes et créer un mariage qui nous ressemblait vraiment. Son professionnalisme et sa bienveillance ont fait toute la différence.",
            "rating": 5,
            "image_url": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400",
            "is_featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "couple_names": "Émilie & Lucas",
            "wedding_date": "Mai 2024",
            "content": "Nous étions débordés par notre travail et l'organisation nous semblait impossible. Virginie a pris les rênes avec une efficacité remarquable. Le jour J, tout s'est déroulé comme dans un rêve.",
            "rating": 5,
            "image_url": "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400",
            "is_featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.testimonials.insert_many(testimonials)
    
    # Seed blog posts
    blog_posts = [
        {
            "id": str(uuid.uuid4()),
            "title": "Comment organiser son mariage sans stress",
            "slug": "organiser-mariage-sans-stress",
            "excerpt": "Découvrez les secrets d'une organisation sereine pour vivre pleinement le plus beau jour de votre vie.",
            "content": """<h2>L'organisation d'un mariage peut sembler intimidante</h2>
<p>Entre le choix du lieu, des prestataires, la gestion du budget et la coordination de tous les détails, il est facile de se sentir submergé. Voici mes conseils pour une organisation zen.</p>

<h3>1. Commencez tôt</h3>
<p>Idéalement, commencez à planifier 12 à 18 mois avant la date souhaitée. Cela vous laisse le temps de comparer les prestataires et de négocier les meilleurs tarifs.</p>

<h3>2. Établissez un budget réaliste</h3>
<p>Définissez clairement votre budget global et répartissez-le entre les différents postes : lieu, traiteur, décoration, photographe, etc.</p>

<h3>3. Faites-vous accompagner</h3>
<p>Un wedding planner peut vous faire gagner un temps précieux et vous éviter bien des erreurs. C'est un investissement qui vaut la peine.</p>""",
            "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
            "category": "Organisation",
            "author": "Virginie Bocquelet",
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Combien coûte un wedding planner ?",
            "slug": "cout-wedding-planner",
            "excerpt": "Investir dans un wedding planner est-il rentable ? Décryptage des tarifs et de la valeur ajoutée.",
            "content": """<h2>Un investissement qui a du sens</h2>
<p>Beaucoup de couples hésitent à faire appel à un wedding planner par peur du coût. Pourtant, cet investissement peut s'avérer très rentable.</p>

<h3>Les différentes formules</h3>
<p>Les tarifs varient selon le niveau d'accompagnement choisi :</p>
<ul>
<li><strong>Organisation complète :</strong> entre 4000€ et 8000€</li>
<li><strong>Organisation partielle :</strong> entre 2500€ et 4000€</li>
<li><strong>Coordination jour J :</strong> entre 1000€ et 2000€</li>
</ul>

<h3>Ce que vous gagnez</h3>
<p>Au-delà du temps économisé, un wedding planner vous fait bénéficier de son réseau de prestataires, de tarifs négociés et de son expertise pour éviter les erreurs coûteuses.</p>""",
            "image_url": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800",
            "category": "Budget",
            "author": "Virginie Bocquelet",
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Les 10 erreurs à éviter pour son mariage",
            "slug": "erreurs-eviter-mariage",
            "excerpt": "Évitez ces pièges classiques pour un mariage réussi et sans accroc.",
            "content": """<h2>Apprenez des erreurs des autres</h2>
<p>Après avoir accompagné de nombreux couples, voici les erreurs les plus fréquentes à éviter.</p>

<h3>1. Ne pas définir de budget clair</h3>
<p>Sans budget défini, les dépenses peuvent vite déraper et créer du stress.</p>

<h3>2. Inviter trop de monde</h3>
<p>Plus d'invités = plus de coûts. Privilégiez la qualité à la quantité.</p>

<h3>3. Négliger le timing</h3>
<p>Un planning mal géré le jour J peut gâcher les meilleurs moments.</p>

<h3>4. Oublier le plan B météo</h3>
<p>Même en été, prévoyez toujours une solution de repli en cas de mauvais temps.</p>

<h3>5. Sous-estimer la fatigue</h3>
<p>Les derniers jours avant le mariage sont intenses. Gardez de l'énergie pour le jour J !</p>""",
            "image_url": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
            "category": "Conseils",
            "author": "Virginie Bocquelet",
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.blog_posts.insert_many(blog_posts)
    
    # Seed gallery with user's photos and stock photos
    gallery_items = [
        {
            "id": str(uuid.uuid4()),
            "title": "Décoration de table élégante",
            "description": "Une table magnifiquement dressée pour un événement",
            "image_url": "https://customer-assets.emergentagent.com/job_elegant-marriage/artifacts/s5yr64eo_BabyShowerNinie-4%20-%20Copie.jpg",
            "category": "Décoration",
            "is_featured": True,
            "order": 1,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Baptême de Léo",
            "description": "Moment de célébration familiale",
            "image_url": "https://customer-assets.emergentagent.com/job_elegant-marriage/artifacts/32g1l3i7_BaptemeLe%CC%81o-49.jpg",
            "category": "Événements",
            "is_featured": True,
            "order": 2,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Mariage romantique",
            "description": "Couple heureux lors de leur union",
            "image_url": "https://customer-assets.emergentagent.com/job_elegant-marriage/artifacts/cqg9s9l3_Virginie%20%26%20Alex-490.jpg",
            "category": "Mariages",
            "is_featured": True,
            "order": 3,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Les mariés",
            "description": "Un moment de bonheur capturé",
            "image_url": "https://customer-assets.emergentagent.com/job_elegant-marriage/artifacts/j5xip4br_Virginie%20%26%20Alex-475%20%281%29.jpg",
            "category": "Mariages",
            "is_featured": True,
            "order": 4,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Décoration lumineuse",
            "description": "Ambiance chaleureuse et intimiste",
            "image_url": "https://customer-assets.emergentagent.com/job_elegant-marriage/artifacts/ihcbo5rj_FB_IMG_1756386454467.jpg",
            "category": "Décoration",
            "is_featured": True,
            "order": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Table de réception",
            "description": "Art de la table raffiné",
            "image_url": "https://images.unsplash.com/photo-1761110840708-9d6814876068?w=800",
            "category": "Décoration",
            "is_featured": False,
            "order": 6,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.gallery.insert_many(gallery_items)
    
    return {"message": "Data seeded successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
