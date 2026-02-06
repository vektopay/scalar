# Vektopay API (Internal)

This service powers share links, SDK generation, and agent chat for the Vektopay docs UI.

## Quick Start

```bash
bun install
bun run dev
```

## Environment

Set these variables before running:

- `DATABASE_URL` (required)
- `AI_PROVIDER` = `openai` or `gemini`
- `OPENAI_API_KEY` or `GEMINI_API_KEY`
- `OPENAI_CHAT_MODEL`, `OPENAI_EMBEDDING_MODEL` (optional)
- `GEMINI_CHAT_MODEL`, `GEMINI_EMBEDDING_MODEL` (optional)
- `EMBEDDING_DIMENSIONS` (must match your embedding model)
- `DEFAULT_NAMESPACE` (default: `vektopay`)
- `REGISTRY_BASE_URL` (default: `https://registry.vektopay.com`)
- `API_BASE_URL` (default: `https://api.vektopay.com`)
- `SDK_GENERATOR` = `remote`, `openapi-generator`, or `none`
- `OPENAPI_GENERATOR_URL` (default: `https://api.openapi-generator.tech`)
- `AUTH_VERIFY_URL` (optional, for external auth check)

## Notes

- SDK generation defaults to the remote OpenAPI Generator service (no Java required).
- To run locally with Java, set `SDK_GENERATOR=openapi-generator` and ensure `openapi-generator-cli` is installed.
- Temporary share links expire after 7 days (`SHARE_TTL_DAYS`).
