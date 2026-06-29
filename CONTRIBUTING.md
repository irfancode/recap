# Contributing to Recap

We love contributions! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/irfancode/recap.git
cd recap
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

## Project Structure

- `src/app/` — Next.js app router pages and API routes
- `src/components/` — React components
- `src/lib/` — Shared utilities and logic
- `cli/` — Rust CLI tool
- `extension/` — Browser extension

## Making Changes

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Make your changes
4. Run `npm run lint`
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing`)
7. Open a Pull Request

## Code Style

- TypeScript strict mode
- Tailwind CSS for styling
- shadcn/ui component patterns
- No comments in code (self-documenting)

## License

By contributing, you agree that your contributions will be licensed under the MIT license.
