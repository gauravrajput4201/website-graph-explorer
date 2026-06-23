# Website Graph Explorer

An interactive visualization tool that crawls any website and maps its entire page structure as a force-directed graph — inspired by [npmgraph](https://npmgraph.js.org).

Paste a URL, explore how every page connects.

---

## Features

- Crawl any public website up to a configurable depth
- Visualize page structure as an interactive force-directed graph
- Click any node to highlight its connected pages
- Node colors indicate HTTP status (200, 301, 404)
- Zoom, pan, and drag nodes freely
- Shareable URL — every graph gets a unique link

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Graph | D3.js, Dagre |
| State | Zustand |
| Crawler | Playwright |
| Queue | BullMQ |
| Cache | Redis |
| Validation | Zod |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Bun
- Docker (for Redis)

### Installation

```bash
git clone https://github.com/yourusername/website-graph-explorer
cd website-graph-explorer
bun install
```

### Start Redis

```bash
docker run -d -p 6379:6379 --name graph-redis redis:7-alpine
```

### Setup environment

```bash
cp .env.example .env.local
```

```env
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

### Run the app

```bash
# terminal 1 — Next.js app
bun dev

# terminal 2 — crawler worker
bun run src/worker/index.ts
```

Open [http://localhost:3000](http://localhost:3000)

---

## How It Works

```
User pastes URL
      ↓
API validates + enqueues crawl job
      ↓
Playwright worker visits every page
      ↓
Raw data normalized into nodes + edges
      ↓
Result stored in Redis
      ↓
D3.js renders interactive graph
```

---

## Project Structure

```
src/
├── app/
│   ├── api/crawl/        ← REST API routes
│   └── graph/            ← graph view page
├── components/           ← UI components
├── lib/                  ← crawler, queue, redis
├── store/                ← Zustand stores
├── hooks/                ← custom hooks
├── types/                ← TypeScript types
└── worker/               ← BullMQ worker process
```

---

## Architecture

```
Browser (Next.js)
      ↓  POST /api/crawl
API Route (Next.js)
      ↓  enqueue job
BullMQ Queue
      ↓  pick up job
Playwright Worker
      ↓  crawl pages
Graph Normalizer
      ↓  store result
Redis Cache
      ↓  fetch result
D3.js Graph
```

---



## Author

Built by [Gaurav Singh](https://github.com/gauravrajput4201)

---

