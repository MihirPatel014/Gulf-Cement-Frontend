# Frontend Migration Scaffold

This folder is prepared for migrating from Next.js to `React + TanStack`.

## Target stack
- React + TypeScript + Vite
- TanStack Router
- TanStack Query
- TanStack Table
- React Hook Form + Zod
- Toast + Skeleton (single shared implementations)

## Key idea
UI code must consume services via interfaces.  
Services can use either:
- `dummy` adapter (now)
- `api` adapter (later, ASP.NET backend)

Switching adapters should not require component rewrites.

## Initial scaffold added
- `src/lib/config/env.ts`
- `src/lib/http/http-client.ts`
- `src/services/contracts/product.ts`
- `src/services/adapters/products.dummy.ts`
- `src/services/adapters/products.api.ts`
- `src/services/index.ts`

## Run
```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` and choose:
- `VITE_DATA_SOURCE=dummy` for mock data
- `VITE_DATA_SOURCE=api` for backend integration
