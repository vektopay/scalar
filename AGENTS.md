# Repository Guidelines

## Project Structure & Module Organization
This is a pnpm + Turbo monorepo. Core code lives under `packages/`, with framework integrations in `integrations/`. Example apps and demos are in `examples/`, and product docs/live content are in `documentation/` and `projects/`. Shared tooling and scripts are in `tooling/`. Tests generally live alongside source files (for example, `packages/<pkg>/src/foo.ts` and `packages/<pkg>/src/foo.test.ts`). Playwright end-to-end tests live under `playwright/`.

## Build, Test, and Development Commands
- `pnpm install`: install workspace dependencies.
- `pnpm dev`: run the development server (from repo root).
- `pnpm build`: build all workspaces via Turbo.
- `pnpm build:packages`: build packages only.
- `pnpm test`: run the Vitest suite.
- `pnpm test:e2e`: run Playwright tests.
- `pnpm format` / `pnpm format:check`: format or verify formatting.
- `pnpm lint:check` / `pnpm lint:fix`: run or fix lint issues.
- `pnpm types:check`: run type checks.

Some tests require local servers; start them with `pnpm script run test-servers`.

## Coding Style & Naming Conventions
Use TypeScript and Vue 3 Composition API (`<script setup lang="ts">`). Naming conventions: components and types in `PascalCase`, files in `kebab-case`, variables in `camelCase`, constants in `UPPER_SNAKE_CASE`. Prefer `type` over `interface`, avoid `any`, and use explicit types for Vue props/emits. Formatting is enforced by Prettier (Vue/Markdown) and Biome (TS/JS/JSON); linting uses Biome and ESLint. Pre-commit hooks are managed by Lefthook.

## Testing Guidelines
Unit tests use Vitest with `.test.ts` files colocated with the code under test. Each test file should have a top-level `describe()` that matches the file name and import `describe`, `it`, and `expect` explicitly from `vitest`. Playwright tests live in `playwright/` and use `.spec.ts` naming. Run tests with `pnpm test` or `pnpm test:e2e`.

## Commit & Pull Request Guidelines
PR titles must be semantic (for example, `fix(api-client): handle null responses`). Use prefixes like `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, etc. If a change affects package versions, add a changeset via `pnpm changeset`. Recent commits follow conventional scopes (for example, `fix(workspace-store): ...`), so keep scopes consistent with the package you touch.

## Auto-Generated Files & Documentation
Some files are generated. Integration `README.md` files are generated from `package.json` metadata; update them via `pnpm script generate-readme`. Do not hand-edit generated enums for Java/.NET; use the scripts in `packages/snippetz/scripts/` instead.
