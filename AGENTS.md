# AGENTS.md

## Project Purpose

UpdateSentinel is a TypeScript CLI tool for self-hosted Docker Compose update risk review.

It scans `docker-compose.yml` files and reports configuration-based update risks such as `latest` tags, unpinned images, risky floating tags, auto-update services, stateful services, and missing update, rollback, or backup hints.

UpdateSentinel is read-only in the MVP. It must never modify Compose files, update containers, pull images, connect to containers, or contact Docker Hub, GHCR, or any external registry unless explicitly requested in a future task.

## Code Style Rules

- Keep code simple, readable, modular, and easy for open-source contributors to understand.
- Use TypeScript with strict types.
- Put individual checks in `src/rules/`.
- Put shared types in `src/types.ts`.
- Put report rendering in `src/report/`.
- Prefer small pure functions for rule logic.
- Do not build a web dashboard unless explicitly requested.
- Do not add cloud or hosted functionality unless explicitly requested.
- Do not add authentication unless explicitly requested.
- Do not query external registries unless explicitly requested.

## Testing Rules

- Use Vitest.
- Add or update tests when changing rule behavior.
- Run `npm test` before committing.
- Run `npm run build` before committing.
- For Docker changes, run `docker build -t updatesentinel .` before committing when Docker is available.

## README Update Rules

- Update `README.md` when user-facing CLI behavior changes.
- Keep README examples aligned with `examples/`.
- Do not claim UpdateSentinel guarantees safe updates.
- Clearly state that findings are local heuristic checks based on Compose configuration.

## Git Workflow Rules

- Work on feature branches.
- Do not force push.
- Do not overwrite unrelated user changes.
- Stage only files related to the task.
- Run tests and build before committing.
- End every task with branch name, commit hash, push status, PR link if available, and any release or merge status.

## Security and Safety Rules

- Do not commit secrets, `.env` files, private Compose files, credentials, tokens, `node_modules`, `dist`, `coverage`, OS junk, or unrelated files.
- UpdateSentinel must not modify `docker-compose.yml`.
- UpdateSentinel must not update containers.
- UpdateSentinel must not pull images.
- UpdateSentinel must not connect to containers.
- UpdateSentinel must not contact Docker Hub, GHCR, or any external registry in the MVP.
- Treat user infrastructure details as sensitive.
