# Repository guidance

This repository is a TypeScript retail ERP monorepo. Run package commands from the relevant directory; there is no root package script.

## Build, test, and lint

The CI workflow (`.github/workflows/ci.yml`) installs dependencies and builds both packages with Node 22.

Frontend (`frontend/`):

- `npm run dev` starts the Vite development server.
- `npm run build` runs the TypeScript project build and Vite production build.
- `npm run lint` runs ESLint across the frontend.
- `npx eslint src/path/to/file.tsx` lints one file.
- There is currently no frontend test script or configured test runner.

Backend (`backend/`):

- `npm run dev` starts the API with `tsx` watch mode.
- `npm run build` compiles TypeScript.
- `npm test -- --runInBand` runs the Jest suite.
- `npm test -- --runInBand src/tests/GSTINManagement.test.ts` runs one test file; add `-t "test name"` to select a test by name.

## Architecture

- The frontend is a React 19 + TypeScript + Vite single-page app. `src/main.tsx` mounts the router and app providers; `src/routes/routes.tsx` defines screens and nested domain routes, while `src/config/navigationConfig.tsx` separately defines the sidebar modules and tabs. Keep these route/navigation definitions aligned when adding navigable screens. Inventory product setup has its own nested tabs in `src/config/productSetupTabs.ts`.
- Frontend screens are grouped by domain under `frontend/src/modules/`. Shared UI is in `components/shared/`, shared form controls and schemas in `components/forms/`, and the application shell in `layouts/`. Domain types, API services, mocks, and configuration are kept in their respective top-level `src/` directories.
- Frontend data flows from a page/component through TanStack Query into a domain service. Services use `fromMockOrApi` (`src/services/dataSource.ts`) to select mock data or the API, with `src/config/env.ts` controlling the `VITE_USE_MOCKS`, `VITE_API_BASE_URL`, and mock-delay settings. `apiClient.ts` is the shared Axios client. Keep mock selection and mock imports in services rather than UI components.
- The backend is an Express API. `backend/src/app.ts` mounts route modules; routes compose middleware and controller handlers, controllers handle HTTP input/output, and domain services access PostgreSQL through the shared Prisma client in `backend/src/config/prisma.ts`. The Prisma schema uses the `finance`, `organization`, `public`, and `user` schemas.

## Repository conventions

- For backend endpoints, follow the existing route → controller → service layering and place new files alongside the corresponding domain. Apply the existing authentication, permission, and resource-scope middleware where the route requires it. Backend TypeScript uses NodeNext module resolution; retain `.js` extensions in relative imports.
- For frontend features, keep route-level pages focused on composing domain components and hooks. Put shared/reused UI in `components/shared/`; use existing shared table, badge/status, filter, card, and form patterns before introducing another implementation.
- Use domain services and `useQuery` for screen data. Keep sample data in `frontend/src/mocks/`, types in `frontend/src/types/`, and API/mock switching in the service layer.
- Frontend styling uses Tailwind CSS v4 and the global utilities in `frontend/src/index.css` (`page-shell`, `page-header`, `page-title`, `page-subtitle`, `page-actions`, `section-card`, and related classes). Use the Plus Jakarta Sans theme and the existing typography scale. Prefer Lucide icons; Ant Design is used for dense tables and the shared `ReusableTable`.
- Build frontend layouts mobile-first: stack headers and content on narrow screens, wrap actions and filters, and constrain horizontal overflow to intentional scroll areas such as tables. Reuse the responsive dashboard shell rather than adding fixed desktop offsets.
- The existing Cursor standards in `.cursor/skills/streamys-frontend/` and `.cursor/skills/streamys-mobile/` are the source for detailed frontend structure, shared UI, and responsive patterns.
