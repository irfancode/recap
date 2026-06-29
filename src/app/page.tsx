import Link from "next/link"
import { Bookmark, Search, Sparkles, Layers, Share2, Shield, ArrowRight, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <header className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Bookmark className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Recap</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Bookmark Manager
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Your Bookmarks,{" "}
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Supercharged
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Save, organize, and instantly rediscover anything from the web. 
              Auto-tagging, full-text search, spaced repetition recall, and AI-powered insights — all free and open-source.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Start Saving <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://github.com/irfancode/recap" target="_blank">
                <Button variant="outline" size="lg" className="gap-2">
                  <Code2 className="h-4 w-4" /> GitHub
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-24 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Full-Text Search",
                description: "Search inside every saved page — not just titles. Find anything instantly.",
              },
              {
                icon: Sparkles,
                title: "AI Auto-Tagging",
                description: "Automatic tags and smart summaries powered by local or cloud AI.",
              },
              {
                icon: Layers,
                title: "Smart Collections",
                description: "Nested collections with drag-and-drop. Organize your way.",
              },
              {
                icon: Share2,
                title: "Spaced Recall",
                description: "Never forget what you saved. Periodic review reminders keep knowledge fresh.",
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "Self-host or use our cloud. End-to-end encryption. No tracking. No ads.",
              },
              {
                icon: Bookmark,
                title: "Universal Capture",
                description: "Browser extension, CLI, mobile share sheet, API — save from anywhere.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 rounded-2xl border bg-card p-8 sm:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Another Bookmark Manager?</h2>
                <p className="text-muted-foreground mb-6">
                  Raindrop.io is great, but it locks core features behind $28/yr, has no CLI, no spaced repetition, 
                  struggles with 5,000+ bookmarks, and its AI features are basic. 
                  The open-source alternatives lack polish. 
                  Recap is built to be the best — completely free, blazing fast, AI-native, and truly open.
                </p>
                <ul className="space-y-3">
                  {[
                    "Unlimited bookmarks, collections, and tags — always free",
                    "AI auto-tagging and semantic search with your own LLM",
                    "Spaced repetition to actually remember what you save",
                    "CLI, browser extensions, Raycast, and Alfred integration",
                    "Self-hostable with single-command Docker deploy",
                    "Export with full page content, not just links",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-purple-400/10 p-8 border">
                <h3 className="font-semibold mb-4">vs Raindrop.io</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Price", recap: "Free forever", rd: "$28/yr (Pro)" },
                    { label: "AI Features", recap: "Free (local LLM)", rd: "Pro only" },
                    { label: "Full-Text Search", recap: "Free", rd: "Pro only" },
                    { label: "CLI / Terminal", recap: "Built-in", rd: "None" },
                    { label: "Spaced Repetition", recap: "Built-in", rd: "None" },
                    { label: "Self-Hostable", recap: "Yes (1 command)", rd: "No" },
                    { label: "Page Archival", recap: "Free", rd: "Pro only" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                      <span className="text-muted-foreground">{row.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-medium">{row.recap}</span>
                        <span className="text-muted-foreground line-through">{row.rd}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Take Control of Your Bookmarks?</h2>
            <p className="text-muted-foreground mb-8">Join us. Free forever. Open source.</p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" />
            Recap
          </div>
          <div className="flex items-center gap-6">
            <Link href="https://github.com/irfancode/recap" className="hover:text-foreground transition-colors">GitHub</Link>
            <span>Open source (MIT)</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
