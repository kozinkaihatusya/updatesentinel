# Contributing to UpdateSentinel

Thanks for considering a contribution. UpdateSentinel is intended to stay small, readable, and useful for people running Docker Compose stacks on home servers, VPSes, NAS devices, and small team infrastructure.

## Install

```bash
npm install
```

## Run Tests

```bash
npm test
```

## Build

```bash
npm run build
```

## Run the CLI

```bash
npm run build
node dist/cli.js scan examples/risky-compose.yml --format markdown
```

With Docker:

```bash
docker build -t updatesentinel .
docker run --rm -v "$(pwd):/scan" updatesentinel scan /scan/examples/risky-compose.yml --format markdown
```

## Add a New Rule

1. Add a focused rule file in `src/rules/`.
2. Return findings using the shared `Finding` model from `src/types.ts`.
3. Add the rule to the `RULES` array in `src/index.ts`.
4. Add tests in `tests/`.
5. Update the README if the behavior is user-facing.

Each finding should include:

- `ruleId`
- `severity`
- `service`
- `title`
- `description`
- `evidence`
- `recommendation`

## Open an Issue or PR

Please include:

- what you expected
- what happened
- the command you ran
- a minimal Compose snippet with secrets removed
- your Node.js and Docker versions, if relevant

## Coding Style

- Keep rule logic understandable without a lot of framework knowledge.
- Prefer explicit names over clever abstractions.
- Avoid network calls in the MVP.
- Keep the tool read-only.
- Do not add registry lookup, container access, update execution, cloud sync, or authentication unless there is an explicit issue and design discussion.

## Safety

Do not paste secrets, credentials, private Compose files, or sensitive infrastructure details into public issues or PRs.
