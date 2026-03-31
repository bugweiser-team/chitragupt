# Chitragupta (formerly NyayaMitra)

Chitragupta is a "Legal First-Response" platform designed to simplify Indian law for the common citizen. It uses a Next.js 14 (App Router) frontend, Tailwind CSS 4 for styling, and a Mock-First Architecture to enable a seamless production-ready demo.

## Getting Started

First, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure
- `app/` - Next.js App Router pages (Home, Get Help, Documents, Lawyers, My Case)
- `components/` - Reusable UI components
- `context/` - React Context providers for global state (Case Memory)
- `lib/` - Utilities and Mock Data
- `types/` - TypeScript interface definitions

## Backend Handoff

Currently, the app is entirely frontend utilizing mock data in `lib/mockData.ts` to simulate API calls.
To connect a real backend:
1. Provide the actual backend API routes in `NEXT_PUBLIC_API_URL` within `.env.local`
2. Update the components to fetch from the API instead of `lib/mockData.ts`
3. Connect `CaseContext.tsx` to the backend for persistent case tracking
