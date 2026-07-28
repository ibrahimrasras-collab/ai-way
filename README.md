# AI Way

Build AI chatbots trained on your data. Cheaper than Sibaway AI, powered by free AI models.

## Quick Start

```bash
# 1. Start databases
docker-compose up -d

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your Gemini API key (free at aistudio.google.com)

# 4. Initialize database
npx prisma db push
npx prisma generate

# 5. Start dev server
npm run dev
```

Open http://localhost:3000

## Architecture

```
src/
  app/               # Next.js App Router pages & API routes
    api/
      auth/          # Authentication (NextAuth.js)
      chatbots/      # CRUD for chatbots
      chat/          # Chat endpoint (RAG-powered)
      upload/        # File upload + processing
      sources/       # Website crawling
      widget/        # Public widget API
    dashboard/       # Dashboard UI
    login/           # Auth pages
    signup/
  lib/               # Core business logic
    llm.ts           # Gemini API integration (FREE)
    embeddings.ts    # Vector embeddings + RAG search
    crawler.ts       # Website crawler
    billing.ts       # Stripe billing
    models.ts        # AI model definitions
    db.ts            # Prisma client
  workers/           # Background job processing
prisma/              # Database schema
public/              # Static assets + widget.js
```

## How It Works

1. **Create a chatbot** via the dashboard
2. **Add data** - upload files or paste a website URL
3. **Crawler/processor** indexes content into vectors
4. **Chat** - users ask questions, RAG finds relevant chunks, Gemini generates answers
5. **Embed** - add the widget to any website with one script tag

## Cost Comparison

| Feature | Sibaway AI | AI Way |
|---|---|---|
| Free tier | 100 queries | 500 queries |
| Starter plan | $6-8/mo | $5/mo |
| Pro plan | $33-80/mo | $19/mo |
| AI model | GPT-4o ($$$) | Gemini Flash (FREE) |
| Vector DB | Paid | pgvector (FREE) |
| OCR | Paid | Tesseract.js (FREE) |

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + pgvector (vector search)
- **AI**: Google Gemini 1.5 Flash (free tier: 15 RPM)
- **Embeddings**: Gemini text-embedding-004
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **Deployment**: Docker + any VPS

## Deployment

```bash
# Build and run with Docker
docker build -t aiway .
docker run -p 3000:3000 aiway
```

Or deploy to Vercel/Railway/Fly.io.

## License

MIT
