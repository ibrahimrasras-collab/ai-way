# AI Way

<p align="center">
  <strong>Build AI Chatbots Trained on Your Data — For Free</strong>
</p>

<p align="center">
  AI Way is an open-source alternative to Sibaway AI, Botpress, and Chatbase.  
  Create intelligent chatbots in minutes using free AI models, embed them anywhere.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#features">Features</a> ·
  <a href="docs/USER-GUIDE.md">User Guide</a> ·
  <a href="#deployment">Deployment</a> ·
  <a href="#api-reference">API</a> ·
  <a href="#license">License</a>
</p>

---

## Why AI Way?

Most AI chatbot builders charge **$30–$80/month** and lock you into expensive proprietary models. AI Way uses **free AI models** (Google Gemini Flash) and **open-source infrastructure** (pgvector, PostgreSQL) to deliver the same features at a fraction of the cost.

| | Sibaway AI | Chatbase | Botpress | **AI Way** |
|---|---|---|---|---|
| Free tier | 100 queries | 20 queries | 50 messages | **500 queries** |
| Starter price | $6–8/mo | $19/mo | $49/mo | **$5/mo** |
| Pro price | $33–80/mo | $99/mo | Custom | **$19/mo** |
| AI model | GPT-4o | GPT-4 | GPT-4 | **Gemini Flash (FREE)** |
| Vector search | Paid | Paid | Paid | **pgvector (FREE)** |
| Self-hostable | No | No | No | **Yes** |
| Open source | No | No | No | **Yes** |

---

## Features

- **No-Code Chatbot Builder** — Upload files or paste a URL, no coding required
- **RAG-Powered Answers** — Retrieval-Augmented Generation for accurate, grounded responses
- **Website Crawler** — Automatically crawls and indexes your website content
- **Document Upload** — Supports TXT, MD, CSV, JSON, PDF
- **Embeddable Widget** — One script tag to add a chatbot to any website
- **Multi-Language** — Supports 100+ languages out of the box
- **Custom Instructions** — Control chatbot personality, tone, and behavior
- **Conversation History** — Full chat history with context
- **Usage Analytics** — Track queries, tokens, and active users
- **Team Management** — Multiple team members per account
- **Stripe Billing** — Built-in subscription management
- **Self-Hostable** — Deploy anywhere with Docker
- **API Access** — Programmatic access for integrations

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ 
- [Docker](https://docker.com/) (for databases)
- A [Google AI Studio](https://aistudio.google.com/) API key (free)

### 1. Clone and Install

```bash
git clone https://github.com/ibrahimrasras-collab/ai-way.git
cd ai-way
npm install
```

### 2. Start Databases

```bash
docker-compose up -d
```

This starts PostgreSQL (with pgvector) and Redis.

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your Gemini API key:

```env
GEMINI_API_KEY=your-key-here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com/) — no credit card required.

### 4. Initialize Database

```bash
npx prisma db push
npx prisma generate
```

### 5. Start Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Architecture

```
ai-way/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/
│   │   │   ├── auth/                 # Authentication
│   │   │   │   ├── [...nextauth]/    # NextAuth.js handler
│   │   │   │   └── signup/           # User registration
│   │   │   ├── chat/                 # RAG-powered chat endpoint
│   │   │   ├── chatbots/             # Chatbot CRUD
│   │   │   ├── sources/              # Website crawler trigger
│   │   │   ├── upload/               # File upload + processing
│   │   │   └── widget/               # Public widget API
│   │   ├── dashboard/                # Chatbot management UI
│   │   │   └── chatbot/[id]/         # Individual chatbot builder
│   │   ├── login/                    # Login page
│   │   └── signup/                   # Signup page
│   ├── lib/
│   │   ├── llm.ts                    # Gemini API integration
│   │   ├── embeddings.ts             # Vector embeddings + RAG search
│   │   ├── crawler.ts                # Website crawler
│   │   ├── billing.ts                # Stripe plans & limits
│   │   ├── models.ts                 # AI model definitions
│   │   ├── db.ts                     # Prisma client
│   │   └── utils.ts                  # Token helpers
│   ├── middleware.ts                  # Auth middleware
│   └── workers/
│       └── index.ts                  # Background job processor
├── prisma/
│   ├── schema.prisma                 # Database schema (9 models)
│   └── seed.ts                       # Demo user seed
├── public/
│   └── widget.js                     # Embeddable chat widget
├── docker-compose.yml                # PostgreSQL + Redis
├── Dockerfile                        # Production container
└── package.json
```

### Database Schema

```
User ──┬── Chatbot ──┬── Document ── Chunk (vector embeddings)
       │             ├── DataSource (website URLs)
       │             └── Conversation ── Message
       ├── Usage (monthly limits)
       └── Subscription (Stripe)
```

---

## How It Works

### The RAG Pipeline

1. **Data Ingestion** — User uploads files or provides a website URL
2. **Chunking** — Content is split into 500-word chunks with 50-word overlap
3. **Embedding** — Each chunk is converted to a 768-dimension vector via Gemini
4. **Storage** — Vectors are stored in PostgreSQL with pgvector extension
5. **Query** — User asks a question
6. **Retrieval** — Top 5 most similar chunks are found via cosine similarity
7. **Generation** — Gemini generates an answer using the retrieved context

```
User Question → Embed → Vector Search (pgvector) → Retrieve Chunks → Gemini Answer
```

---

## Pricing Plans

| Plan | Price | Chatbots | Pages | Queries/mo | Tokens |
|---|---|---|---|---|---|
| **Free** | $0 | 1 | 30 | 100 | 1M |
| **Starter** | $5/mo | 2 | 200 | 500 | 5M |
| **Pro** | $19/mo | 10 | 2,000 | 5,000 | 50M |
| **Enterprise** | $49/mo | Unlimited | Unlimited | Unlimited | Unlimited |

---

## Deployment

### Docker (Recommended)

```bash
docker build -t aiway .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e GEMINI_API_KEY="..." \
  -e NEXTAUTH_SECRET="..." \
  aiway
```

### Vercel

```bash
npm i -g vercel
vercel
```

> Note: For production, use a hosted PostgreSQL (Supabase, Neon, Railway) and Redis (Upstash).

### Railway

```bash
railway login
railway init
railway up
```

### Fly.io

```bash
fly auth login
fly launch
fly deploy
```

---

## API Reference

### Public Endpoints (No Auth)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Create account |
| `POST` | `/api/widget/chat` | Send message to chatbot |
| `GET` | `/api/widget/[id]` | Get chatbot config |

### Protected Endpoints (Require Session)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/chatbots` | List user chatbots |
| `POST` | `/api/chatbots` | Create chatbot |
| `GET` | `/api/chatbots/[id]` | Get chatbot details |
| `PATCH` | `/api/chatbots/[id]` | Update chatbot |
| `DELETE` | `/api/chatbots/[id]` | Delete chatbot |
| `POST` | `/api/upload` | Upload document |
| `POST` | `/api/sources` | Add website source |
| `POST` | `/api/chat` | Chat with history |

### Widget Embed

Add to any HTML page:

```html
<script 
  src="https://your-domain.com/widget.js" 
  data-chatbot-id="YOUR_CHATBOT_ID">
</script>
```

---

## Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | Next.js 14, Tailwind CSS | Free |
| Backend | Next.js API Routes | Free |
| Database | PostgreSQL 16 + pgvector | Free (self-hosted) |
| AI Model | Google Gemini 1.5 Flash | Free (15 RPM) |
| Embeddings | Gemini text-embedding-004 | Free |
| Auth | NextAuth.js | Free |
| Payments | Stripe | Free (pay per transaction) |
| Search | pgvector cosine similarity | Free |
| Crawler | Cheerio + fetch | Free |
| OCR | Tesseract.js | Free |
| Queue | BullMQ + Redis | Free (self-hosted) |

**Total infrastructure cost: ~$5–10/month** (VPS + domain)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | No | Redis connection string (for job queue) |
| `GEMINI_API_KEY` | Yes | Google Gemini API key (free) |
| `NEXTAUTH_URL` | Yes | App URL (e.g., http://localhost:3000) |
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT signing |
| `STRIPE_SECRET_KEY` | No | Stripe secret key (for billing) |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook secret |
| `APP_URL` | No | Public app URL |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.
