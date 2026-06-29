# Recap - Intelligent Open-Source Bookmark Manager

Save, organize, and instantly rediscover anything from the web. AI-powered auto-tagging, full-text search, spaced repetition recall, CLI integration, and more — all free and open-source.

![Recap](https://img.shields.io/badge/Recap-v1.0.0-6366f1)
![License](https://img.shields.io/badge/license-MIT-green)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen)

## Why Recap?

**Raindrop.io** is great but locks core features behind $28/year, has no CLI, no spaced repetition, struggles at scale, and AI features are an upsell.

**Open-source alternatives** (Linkwarden, Karakeep, Linkding) lack polish, have no CLI, complex deployment, and weak AI integration.

**Recap** is built to be the best of both worlds — beautiful, fast, AI-native, and truly free.

| Feature | Recap | Raindrop.io (Free) | Raindrop.io (Pro) | Linkwarden |
|---|---|---|---|---|
| Price | **Free** | Free | $28/yr | Free (self-host) |
| Bookmarks | **Unlimited** | 500 | Unlimited | Unlimited |
| AI Auto-Tagging | **Free** | ❌ | ✅ | Optional |
| Full-Text Search | **Free** | ❌ | ✅ | ✅ |
| CLI / Terminal | **Built-in** | ❌ | ❌ | ❌ |
| Spaced Repetition | **Built-in** | ❌ | ❌ | ❌ |
| Self-Host | **1 command** | ❌ | ❌ | Docker |
| Page Archival | **Free** | ❌ | ✅ | ✅ |
| Browser Extensions | **Chrome + FF** | ✅ | ✅ | ✅ |

## Features

### 📥 Universal Capture
- **Browser extension** — one-click save from Chrome, Firefox, Edge, Safari
- **CLI tool** — `recap add https://example.com` from your terminal
- **Mobile share sheet** — save from any iOS/Android app
- **Bookmarklet** — drag to your browser bar
- **Import** — from browser exports, Pocket, Raindrop, or any HTML file

### 🧠 AI-Powered (Local or Cloud)
- **Auto-tagging** — AI suggests tags based on page content
- **Semantic search** — find bookmarks by meaning, not just keywords
- **Summarization** — AI generates page summaries
- **Works with Ollama** (local, free, private) or OpenAI/Anthropic

### 🔍 Full-Text Search
- Search inside every saved page — not just titles and URLs
- Powered by SQLite FTS5 — fast, offline, private
- Filter by tags, collections, domains, date, favorites

### 📂 Smart Organization
- **Nested collections** with drag-and-drop
- **Tags** with auto-complete and merge
- **Multiple views**: grid, list, masonry, compact
- **Auto-cleanup**: duplicate detection, broken link checker

### 🔄 Spaced Repetition Recall
- Never forget what you saved
- Periodic review reminders
- Smart scheduling based on your reading habits

### 🖥️ CLI-First Design
- `recap add <url>` — save bookmarks from the terminal
- `recap search <query>` — find anything instantly
- `recap list` — view recent bookmarks
- **Raycast extension** and **Alfred workflow** included

### 🔒 Privacy & Ownership
- **Self-host** with single Docker command
- **End-to-end encryption** option
- **No tracking, no ads, no data selling**
- **Full export** with page content, not just links
- **Open source** — inspect every line of code

## Quick Start

### Option 1: Cloud (Coming Soon)
The hosted version at recap.app is free during beta.

### Option 2: Self-Host with Docker
```bash
git clone https://github.com/irfancode/recap.git
cd recap
cp .env.example .env
# Edit .env with your settings
docker compose up -d
```

Open http://localhost:3000 and create your account.

### Option 3: Manual Setup
```bash
git clone https://github.com/irfancode/recap.git
cd recap
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

## CLI Tool

```bash
# Install the CLI
cargo install --path cli

# Login
recap login your@email.com

# Save a bookmark
recap add https://example.com --title "Example" --tags "web,reference"

# Search
recap search "interesting article"

# List recent
recap list --limit 20
```

## Browser Extension

The browser extension is in `extension/`. To install:

1. Open Chrome and go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select `extension/`
4. Configure your Recap server URL in the extension settings

## AI Integration

Recap supports local AI via [Ollama](https://ollama.ai):

```bash
# Install Ollama
brew install ollama
ollama pull llama3
ollama serve
```

Configure AI in Settings → AI Features.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: SQLite (default) / PostgreSQL
- **Search**: SQLite FTS5
- **AI**: Ollama, OpenAI, Anthropic
- **CLI**: Rust (clap, reqwest)
- **Auth**: NextAuth.js
- **Deployment**: Docker, Docker Compose

## Project Structure

```
recap/
├── src/
│   ├── app/          # Next.js app router pages & API routes
│   ├── components/   # React components
│   ├── lib/          # Utilities, auth, database
│   └── types/        # TypeScript types
├── cli/              # Rust CLI tool
├── extension/        # Browser extension
├── prisma/           # Database schema
├── docker-compose.yml
└── Dockerfile
```

## Roadmap

- [x] Core bookmark CRUD
- [x] Collections (nested)
- [x] Tags
- [x] Full-text search
- [x] AI auto-tagging
- [x] CLI tool
- [x] Import/Export
- [x] Docker deployment
- [ ] Browser extensions (Chrome, Firefox)
- [ ] Mobile apps (iOS, Android)
- [ ] Spaced repetition recall
- [ ] End-to-end encryption
- [ ] Web archive (permanent page copies)
- [ ] API for third-party integrations
- [ ] Obsidian/Notion/Logseq plugins
- [ ] Raycast/AIfred extensions
- [ ] Collaborative collections
- [ ] Windows/macOS/Linux desktop apps (Tauri)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT © [irfancode](https://github.com/irfancode)

---

**Recap** — Your bookmarks, supercharged.
